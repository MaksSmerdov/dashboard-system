import * as React from "react";
import { useSelector, useDispatch } from 'react-redux';
import type {RootState} from "../../store/store.ts";
import { logout} from "../../store/authSlice.ts";
import styles from './Profile.module.scss';
import Button from "../UI/Button/Button.tsx";

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  }

  return (
    <div className={styles.container}>
      <h2>Профиль</h2>
      {user ? (
        <div>
          <p>
            Добро пожаловать, {user.name} {user.surname} ({user.email})
          </p>
          <Button onClick={handleLogout} className={styles.logoutButton}>
            Выйти
          </Button>
        </div>
      ) : (
        <p>Данные пользователя недоступны</p>
      )}
    </div>
  );
};

export default Profile;