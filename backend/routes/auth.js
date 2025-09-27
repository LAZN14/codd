const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Регистрация
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role = 'user', fullName } = req.body;
    
    const exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    const user = await User.create({ username, email, password, role, fullName, isActive: true });
    res.status(201).json({ message: 'Пользователь создан успешно', userId: user.id });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const isValidPassword = await user.checkPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Аккаунт деактивирован' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Вход выполнен успешно',
      token,
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Проверка токена
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null
    
    if (!token) {
      return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Недействительный токен' });
  }
});

// Получение профиля пользователя
router.get('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null
    
    if (!token) {
      return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ user: user.toPublicJSON() });
  } catch (error) {
    res.status(401).json({ error: 'Недействительный токен' });
  }
});

// Обновление профиля
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    await user.update({ fullName, email });
    res.json({ message: 'Профиль обновлен', user: user.toPublicJSON() });
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Смена пароля
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const isValidPassword = await user.checkPassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Неверный текущий пароль' });
    }

    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Пароль изменен успешно' });
  } catch (error) {
    console.error('Ошибка смены пароля:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Получение списка пользователей (только для админов)
router.get('/users', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json({ users });
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Управление пользователями (только для админов)
router.put('/users/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }

    const { isActive, role } = req.body;
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    await user.update({ isActive, role });
    res.json({ message: 'Пользователь обновлен', user: user.toPublicJSON() });
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

module.exports = router;