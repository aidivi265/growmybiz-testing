import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseServer';

export async function POST(request: Request) {
  try {
    // 1. Verify Admin Session
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!verifySessionToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Multipart Form Data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 3. Validate File Size (Max 25MB)
    const MAX_FILE_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 25MB size limit. Please upload a photo under 25MB.' }, { status: 400 });
    }

    // 4. Validate MIME Type & File Extension
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const extension = (originalName.split('.').pop() || 'png').toLowerCase();
    const cleanBaseName = originalName.substring(0, originalName.lastIndexOf('.')) || 'media';
    const filePath = `uploads/${Date.now()}_${cleanBaseName.slice(0, 30)}.${extension}`;

    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      avif: 'image/avif',
      gif: 'image/gif',
      ico: 'image/x-icon',
    };

    const contentType = mimeMap[extension] || (file.type && file.type.startsWith('image/') ? file.type : 'image/png');

    // 5. Upload to Supabase Storage Bucket ('growmybizz-media')
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabaseAdmin.storage
      .from('growmybizz-media')
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 6. Get Public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('growmybizz-media')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath,
      size: file.size,
      mimeType: contentType,
    });
  } catch (error: any) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error during upload.' }, { status: 500 });
  }
}
