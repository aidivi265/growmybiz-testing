import { createClient } from '@supabase/supabase-js';

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
}

checkTables();
