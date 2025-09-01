import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = [
  body('name')
  .notEmpty()
  .withMessage('Имя обязательно')
  .matches(/^[а-яА-ЯёЁ\s-]+$/)
  .withMessage('Имя должно содержать только русские буквы, пробелы или дефисы'),
  body('surname')
  .notEmpty()
  .withMessage('Фамилия обязательна')
  .matches(/^[а-яА-ЯёЁ\s-]+$/)
  .withMessage('Фамилия должна содержать только русские буквы, пробелы или дефисы'),
  body('email')
  .isEmail()
  .withMessage('Введите корректный email')
  .normalizeEmail(),
  body('password')
  .isLength({ min: 6 })
  .withMessage('Пароль должен быть не короче 6 символов'),

  async (req, res ) => {
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

      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token, user: { name: user.name, surname: user.surname, email: user.email } });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Ошибка сервера');
    }
  },
];

export const login = [
  body('email')
  .isEmail()
  .withMessage('Введите корректный email')
  .normalizeEmail(),
  body('password')
  .notEmpty()
  .withMessage('Пароль обязателен'),

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

      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token, user: { name: user.name, surname: user.surname, email: user.email } });
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