import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = [
  body('name').
  notEmpty().
  withMessage('Имя обязательно').
  matches(/^[а-яА-ЯёЁ\s-]+$/).
  withMessage('Имя должно содержать только русские буквы, пробелы или дефисы'),
  body('surname').
  notEmpty().
  withMessage('Фамилия обязательна').
  matches(/^[а-яА-ЯёЁ\s-]+$/).
  withMessage('Фамилия должна содержать только русские буквы, пробелы или дефисы'),
  body('email').isEmail().withMessage('Введите корректный email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен быть не короче 6 символов'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'Пользователь с таким email уже существует' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, surname, email, password: hashedPassword });
      await user.save();

      const accessPayload = { user: { id: user.id } };
      const refreshPayload = { user: { id: user.id } };

      const accessToken = jwt.sign(accessPayload, process.env.JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      });

      res.json({ accessToken, user: { name: user.name, surname: user.surname, email: user.email } });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Ошибка сервера');
    }
  },
];

export const login = [
  body('email').isEmail().withMessage('Введите корректный email').normalizeEmail(),
  body('password').notEmpty().withMessage('Пароль обязателен'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: 'Неверные учетные данные' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Неверные учетные данные' });
      }

      const accessPayload = { user: { id: user.id } };
      const refreshPayload = { user: { id: user.id } };

      const accessToken = jwt.sign(accessPayload, process.env.JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      });

      res.json({ accessToken, user: { name: user.name, surname: user.surname, email: user.email } });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Ошибка сервера');
    }
  },
];

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }
    res.json({ user: { name: user.name, surname: user.surname, email: user.email } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ msg: 'Нет refresh токена, авторизация отклонена ' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessPayload = { user: { id: decoded.user.id } };
    const accessToken = jwt.sign(accessPayload, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.json({ accessToken });
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Refresh токен недействителен' });
  }
};