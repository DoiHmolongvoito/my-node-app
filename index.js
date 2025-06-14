const express = require('express');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();  // nhớ thêm dòng này để load .env
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const app = express();
const port = process.env.PORT || 3000;


// Kết nối tới PostgreSQL thông qua DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Cho phép đọc JSON từ client
app.use(express.json());

// Phục vụ file tĩnh từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

// API đơn giản: trả về danh sách user
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// API test kết nối database
app.get('/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi kết nối database' });
  }
});

app.listen(port, () => {
  console.log(`Server chạy tại http://localhost:${port}`);
});
