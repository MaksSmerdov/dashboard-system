import {useSelector, useDispatch} from 'react-redux';
import type {RootState} from '../../store/store.ts';
import {logout} from '../../store/authSlice.ts';
import Button from '../UI/Button/Button.tsx';
import styles from './Header.module.scss';

const Header = () => {
  const {user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
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
            Здравствуйте, {user.name}.
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