
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspect() {
    console.log('--- Checking Blueprints ---');
    const { data: blueprints, error: bpError } = await supabase
        .from('blueprints')
        .select('*')
        .limit(1);

    if (bpError) console.error('Error fetching blueprints:', bpError);
    else console.log('Blueprint sample:', blueprints?.[0]);

    console.log('\n--- Checking Keys / secrets ---');
    // Common names for key tables
    const tables = ['keys', 'api_keys', 'secrets', 'system_settings'];

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (!error) {
            console.log(`Table '${table}' exists. Sample:`, data?.[0]);
        } else {
            console.log(`Table '${table}' error/not found:`, error.message);
        }
    }
}

inspect();
