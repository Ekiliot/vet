const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase;

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_url_here') {
  console.warn('⚠️  Supabase не настроен. Используется демо-режим.');
  
  // Создаем mock Supabase для демонстрации
  supabase = {
    from: (table) => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [{ id: Date.now() }], error: null }),
      count: () => ({ count: 0, error: null })
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

module.exports = supabase; 