const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Получить всех клиентов (только для персонала)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Добавить нового клиента
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, phone, email, petName, petType, message } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'Имя и фамилия обязательны' });
    }

    const { data, error } = await supabase
      .from('clients')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          email: email || null,
          pet_name: petName || null,
          pet_type: petType || null,
          message: message || null
        }
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получить статистику клиентов
router.get('/stats', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;
    res.json({ totalClients: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 