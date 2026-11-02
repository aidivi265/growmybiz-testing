import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env.local if not already in env
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
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl ? 'Configured (' + supabaseUrl + ')' : 'MISSING');
console.log('Key:', supabaseKey ? 'Configured' : 'MISSING');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration in environment');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const tables = ['services', 'portfolio_projects', 'articles', 'testimonials', 'page_content', 'seo_metadata', 'inquiries', 'site_settings'];
  console.log('\nChecking tables in database:');
  
  for (const table of tables) {
    try {
      const { data, count, error } = await supabase.from(table).select('*', { count: 'exact' });
      if (error) {
        console.log(`❌ Table '${table}': Error - ${error.message}`);
      } else {
        console.log(`✅ Table '${table}': Connected! Total rows: ${count !== null ? count : (data ? data.length : 0)}`);
      }
    } catch (err) {
      console.log(`❌ Table '${table}': Exception - ${err.message}`);
    }
  }

  console.log('\nChecking Supabase Storage buckets:');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      console.log(`❌ Storage: Error - ${error.message}`);
    } else {
      const mediaBucket = buckets.find((b) => b.id === 'growmybizz-media');
      if (mediaBucket) {
        console.log(`✅ Storage Bucket 'growmybizz-media': Connected! (Public: ${mediaBucket.public})`);
      } else {
        console.log(`⚠️ Storage Bucket 'growmybizz-media': Not found. Run 'npm run setup:storage' to initialize.`);
      }
    }
  } catch (err) {
    console.log(`❌ Storage: Exception - ${err.message}`);
  }
}

checkTables();
