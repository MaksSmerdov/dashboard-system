import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Имя обязательно'],
    match: [/^[а-яА-ЯёЁ\s-]+$/, 'Имя должно содержать только русские буквы, пробелы или дефисы'],
  },
  surname: {
    type: String,
    required: [true, 'Фамилия обязательна'],
    match: [/^[а-яА-ЯёЁ\s-]+$/, 'Фамилия должна содержать только русские буквы, пробелы или дефисы'],
  },
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Введите корректный email'],
  },
  password: {
    type: String,
    required: [true, 'Пароль обязателен'],
    minlength: [6, 'Пароль должен быть не короче 6 символов'],
  },
});

const User = mongoose.model('User', userSchema);

export default User;