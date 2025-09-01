import * as React from "react";
import { useSelector, useDispatch } from 'react-redux';
import type {RootState} from "../store/store.ts";
import { logout} from "../store/authSlice.ts";
import styles from './Profile.module.scss';

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className={styles.container}>
      <h2>Профиль</h2>
      {user ? (
        <div>
          <p>
            Добро пожаловать, {user.name} {user.surname} ({user.email})
          </p>
          <button onClick={() => dispatch(logout())} className={styles.logoutButton}>
            Выйти
          </button>
        </div>
      ) : (
        <p>Данные пользователя недоступны</p>
      )}
    </div>
  );
};

export default Profile;