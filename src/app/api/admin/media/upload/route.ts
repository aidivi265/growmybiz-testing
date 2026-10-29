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

    // 3. Validate File Size (Max 15MB to allow high-res mobile and camera headshots)
    const MAX_FILE_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 15MB size limit. Please upload a photo under 15MB.' }, { status: 400 });
    }

    // 4. Validate MIME Type & File Extension
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const extension = (originalName.split('.').pop() || 'png').toLowerCase();
    const cleanBaseName = originalName.substring(0, originalName.lastIndexOf('.')) || 'media';
    const filePath = `uploads/${Date.now()}_${cleanBaseName.slice(0, 30)}.${extension}`;

    const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'avif', 'gif', 'heic', 'heif'];
    const isImageMime = file.type?.startsWith('image/') || file.type === 'application/octet-stream';
    const isAllowedExt = allowedExtensions.includes(extension);

    if (!isImageMime && !isAllowedExt) {
      return NextResponse.json(
        { error: 'Invalid file format. Please upload an image (PNG, JPG, JPEG, WEBP, AVIF, SVG).' },
        { status: 400 }
      );
    }

    // 5. Upload to Supabase Storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const contentType = file.type && file.type !== 'application/octet-stream' ? file.type : `image/${extension === 'jpg' ? 'jpeg' : extension}`;

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

    // 7. Get Public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('growmybizz-media')
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: 'Internal server error during upload.' }, { status: 500 });
  }
}
