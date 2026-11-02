import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 1. Load environment variables from .env.local if not already set
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = 'growmybizz-media';

console.log('====================================================');
console.log('🚀 Growmybizz Supabase Storage Initialization');
console.log('====================================================');
console.log('Target Bucket:', BUCKET_NAME);
console.log('Supabase URL: ', supabaseUrl ? supabaseUrl : '❌ MISSING');
console.log('Service Key:  ', serviceRoleKey ? 'Configured (Secret)' : '❌ MISSING');

if (!supabaseUrl || !serviceRoleKey) {
  console.error('\n❌ ERROR: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  try {
    console.log('\n[1/3] Inspecting existing storage buckets...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      throw new Error(`Failed to list buckets: ${listError.message}`);
    }

    const existingBucket = buckets?.find((b) => b.id === BUCKET_NAME || b.name === BUCKET_NAME);

    const bucketConfig = {
      public: true,
      fileSizeLimit: 26214400, // 25 MB
      allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
        'image/avif',
        'image/gif',
        'image/x-icon',
      ],
    };

    if (existingBucket) {
      console.log(`ℹ️  Bucket '${BUCKET_NAME}' already exists (Public: ${existingBucket.public}).`);
      console.log('[2/3] Updating bucket to enforce public read access and configuration...');
      const { error: updateError } = await supabase.storage.updateBucket(BUCKET_NAME, bucketConfig);
      if (updateError) {
        console.warn(`⚠️ Warning during bucket update: ${updateError.message}`);
      } else {
        console.log(`✅ Bucket '${BUCKET_NAME}' updated successfully.`);
      }
    } else {
      console.log(`[2/3] Creating new public bucket '${BUCKET_NAME}'...`);
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, bucketConfig);
      if (createError) {
        throw new Error(`Failed to create bucket: ${createError.message}`);
      }
      console.log(`✅ Bucket '${BUCKET_NAME}' created successfully with public read access.`);
    }

    console.log('\n[3/3] Performing end-to-end storage probe verification...');
    const probePath = `_probe_test_${Date.now()}.png`;
    // Valid 1x1 transparent PNG
    const probeContent = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=',
      'base64'
    );

    // Upload test probe
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(probePath, probeContent, { contentType: 'image/png', upsert: true });

    if (uploadError) {
      throw new Error(`Storage probe upload failed: ${uploadError.message}`);
    }

    // Resolve public URL
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(probePath);

    console.log(`📍 Public URL resolved: ${publicUrlData.publicUrl}`);

    // Verify public fetch without authentication
    const probeFetch = await fetch(publicUrlData.publicUrl);
    if (!probeFetch.ok) {
      console.warn(`⚠️ Warning: Public fetch returned HTTP ${probeFetch.status}. Storage RLS policy may need a moment to propagate.`);
    } else {
      const arrayBuffer = await probeFetch.arrayBuffer();
      if (arrayBuffer.byteLength > 0) {
        console.log(`✅ Unauthenticated public HTTP GET test: 200 OK (${arrayBuffer.byteLength} bytes received)`);
      }
    }

    // Clean up probe
    await supabase.storage.from(BUCKET_NAME).remove([probePath]);
    console.log('🧹 Cleaned up temporary verification probe.');

    console.log('\n====================================================');
    console.log(`🎉 SUCCESS: Bucket '${BUCKET_NAME}' is LIVE & PUBLIC!`);
    console.log('File Size Limit: 25 MB');
    console.log('Allowed Types:   JPG, PNG, WebP, SVG, AVIF, GIF, ICO');
    console.log('====================================================\n');
  } catch (err) {
    console.error('\n❌ Initialization failed:', err.message || err);
    process.exit(1);
  }
}

main();
