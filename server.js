require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cors = require('cors');
const pool = require('./db');

const app = express();
const port = process.env.PORT || 3000;



// Настройка CORS
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const JWT_SECRET = 'ds34ss';

// Middleware для проверки токена и роли администратора
const adminAuth = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ error: 'Доступ запрещен. Нет токена.' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], 'your_secret_key');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен. Вы не администратор.' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Неверный или истекший токен.' });
  }
};

// Регистрация
app.post('/register', async (req, res) => {
  const { fullName, phone, email, password, driverLicense } = req.body;

  try {
    // Проверка, существует ли пользователь с таким email
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Сохранение пользователя в базу данных
    await pool.query(
      'INSERT INTO users (full_name, phone, email, password, license_series) VALUES ($1, $2, $3, $4, $5)',
      [fullName, phone, email, hashedPassword, driverLicense]
    );

    res.status(201).json({ message: 'Регистрация успешна. Теперь вы можете войти.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

  
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Проверка данных администратора
    if (email === 'car@gmail.com' && password === 'carforme') {
      // Генерация токена для администратора
      const adminToken = jwt.sign({ role: 'admin' }, 'your_secret_key', { expiresIn: '1h' });
      return res.json({
        token: adminToken,
        role: 'admin',
        message: 'Добро пожаловать, администратор!',
      });
    }

    // Проверка данных пользователя
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Неверный email или пароль' });
    }

    const user = userResult.rows[0];

    // Проверка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Неверный email или пароль' });
    }

    // Генерация токена для пользователя
    const userToken = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });

    // Возврат данных пользователя
    res.json({
      token: userToken,
      role: 'user',
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Ошибка входа:', err.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


app.get('/admin', adminAuth, (req, res) => {
  res.json({ message: 'Добро пожаловать на панель администратора!' });
});

// Получение списка автомобилей
app.get('/cars', async (req, res) => {
  try {
      const result = await pool.query('SELECT * FROM cars');
      res.json(result.rows);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Бронирование автомобиля
app.post('/book', async (req, res) => {
  const { carId, bookingDate } = req.body;
  try {
      // Проверка доступности
      const carResult = await pool.query('SELECT is_available FROM cars WHERE id = $1', [carId]);
      if (!carResult.rows[0].is_available) {
          return res.status(400).json({ error: 'Car is not available' });
      }

      // Создание бронирования
      await pool.query('INSERT INTO bookings (car_id, booking_date) VALUES ($1, $2)', [carId, bookingDate]);

      // Обновление статуса автомобиля
      await pool.query('UPDATE cars SET is_available = FALSE WHERE id = $1', [carId]);

      res.status(200).json({ message: 'Car booked successfully' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});



// Получение автомобилей, забронированных конкретным пользователем
app.get('/user-cars/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
      const result = await pool.query(
          `SELECT c.id, c.name, c.price, c.is_available, b.booking_date 
           FROM cars c 
           JOIN bookings b ON c.id = b.car_id 
           WHERE b.user_id = $1`, 
          [userId]
      );
      res.json(result.rows);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


app.post('/bookings', async (req, res) => {
  const { userId, carId, bookingDate } = req.body;

  if (!userId || !carId || !bookingDate) {
      return res.status(400).json({ error: 'Необходимо указать все данные' });
  }

  try {
      const result = await pool.query(
          `INSERT INTO bookings (user_id, car_id, booking_date, status) 
           VALUES ($1, $2, $3, 'Новое') RETURNING *`,
          [userId, carId, bookingDate]
      );
      res.status(201).json(result.rows[0]);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

app.get('/bookings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.id AS booking_id, 
        b.booking_date, 
        b.status, 
        u.full_name, 
        u.phone, 
        u.email, 
        c.name AS car_name 
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN cars c ON b.car_id = c.id
    `);

    const bookings = result.rows.map((row) => ({
      id: row.booking_id,
      booking_date: row.booking_date,
      status: row.status,
      user: {
        full_name: row.full_name,
        phone: row.phone,
        email: row.email,
      },
      car: {
        name: row.car_name,
      },
    }));

    res.json(bookings);
  } catch (err) {
    console.error('Ошибка при получении списка бронирований:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


// PUT маршрут для обновления статуса бронирования
app.put('/bookings/:id/status', async (req, res) => {
  const { id } = req.params; // ID бронирования
  const { status } = req.body; // Новый статус

  // Возможные статусы
  const validStatuses = ['Новое', 'Подтверждено', 'Отменено'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Недопустимый статус' });
  }

  try {
    // Обновляем статус бронирования в базе данных
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    // Возвращаем обновленное бронирование
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при обновлении статуса бронирования:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


// // Маршрут для получения пользователей
// app.get('/api/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT id, full_name, phone, email, license_series FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// Маршрут для получения пользователей и их заказанных машин
app.get('/users', async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id AS user_id,
        u.full_name,
        u.email,
        u.phone,
        c.name AS car_name,
        b.booking_date,
        b.status
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN cars c ON b.car_id = c.id
      ORDER BY b.booking_date DESC;
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Server error');
  }
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
