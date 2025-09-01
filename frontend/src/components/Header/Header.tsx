import {useSelector} from "react-redux";
import type {RootState} from "../../store/store.ts";
import Button from "../UI/Button/Button.tsx";
import styles from './Header.module.scss'

const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div>
      {user ? (
        <header className={`${styles['header']}`}>
          <div className="logo">
            Многофункциональная система
          </div>
          <div>
            Здравствуйте, {user.name}.
            <Button>Настройки профиля</Button>
          </div>
        </header>
      ) : (
        <p>Данные пользователя недоступны</p>
      )}
    </div>
  )
}

export default Header;