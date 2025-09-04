import {useSelector, useDispatch} from 'react-redux';
import type {RootState} from '../../store/store.ts';
import {logout} from '../../store/slices/authSlice.ts';
import Button from '../UI/Button/Button.tsx';
import styles from './Header.module.scss';

const Header = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Доброе утро';
    } else if (hour >= 12 && hour < 18) {
      return 'Добрый день';
    } else if (hour >= 18 && hour < 24) {
      return 'Добрый вечер';
    } else {
      return 'Доброй ночи';
    }
  };

  const handleLogout = (): void => {
    dispatch(logout());
  };

  return (
    <div>
      {user ? (
        <header className={`${styles['header-container']}`}>
          <div className={`${styles['header__title']}`}>
            Название
          </div>
          <div className={`${styles['header__user']}`}>
            <span>
              {getGreeting()}, {user.name}.
            </span>
            <Button onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </header>
      ) : (
        <p>Данные пользователя недоступны</p>
      )}
    </div>
  );
};

export default Header;