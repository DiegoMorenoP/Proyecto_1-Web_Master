
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUrls() {
    const { data: kits, error } = await supabase
        .from('kits')
        .select('id, name, image_url');

    if (error) {
        console.error('Error fetching kits:', error);
        return;
    }

    console.log('--- Product URLs ---');
    kits.forEach(k => {
        console.log(`[${k.name}]`);
        console.log(`URL: ${k.image_url ? k.image_url : 'NULL/EMPTY'}`);
        console.log('---');
    });
}

checkUrls();
