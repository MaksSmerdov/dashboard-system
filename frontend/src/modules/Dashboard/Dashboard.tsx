// src/components/Dashboard/Dashboard.tsx
import React, {useState, useEffect} from 'react';
import {useApiData} from '../../hooks/useApiData';
import DashboardConfig from "./components/DashboardConfig/DashboardConfig.tsx";
import {loadDashboardConfig} from './utils/localStorage.ts';
import {API_ENDPOINTS} from "../../store/slices/dataSlice.ts";
import styles from './Dashboard.module.scss';
import Button from "../../components/UI/Button/Button.tsx";

interface DashboardProps {
  userId: string;
}

const Dashboard: React.FC<DashboardProps> = ({userId}) => {
  const {data, loading, error} = useApiData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [config, setConfig] = useState(loadDashboardConfig(userId));

  // Обновляем конфигурацию при изменении в localStorage
  useEffect(() => {
    setConfig(loadDashboardConfig(userId));
  }, [userId, isModalOpen]);

  const isLoading = Object.values(loading).some((status) => status === 'pending');

  return (
    <div className={`container`}>
      <div className={`${styles['dashboard__title']}`}>
        <h2 className={`${styles['dashboard__title--name']}`}>Дашборд</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          Настроить дашборд
        </Button>
      </div>
      <DashboardConfig isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} userId={userId}/>
      {isLoading && <div className={styles.dashboard__loading}>Загрузка данных...</div>}
      {Object.entries(config).map(([endpointKey, endpointConfig]) => {
        const endpointData = data[endpointKey];
        const endpointError = error[endpointKey];
        const displayName = API_ENDPOINTS.find((ep) => ep.key === endpointKey)?.displayName || endpointKey;

        if (endpointError) {
          return (
            <div key={endpointKey} className={styles.dashboard__section}>
              <h3>{displayName}</h3>
              <p className={styles.dashboard__error}>{endpointError}</p>
            </div>
          );
        }

        if (!endpointData) return null;

        return (
          <div key={endpointKey} className={styles.dashboard__section}>
            <h3>{displayName}</h3>
            <div className={`${styles['dashboard__section--tables']}`}>
              {endpointConfig.displayType === 'table' ? (
                endpointConfig.fields.map((field) => (
                  endpointData[field] && (
                    <div className={`${styles['dashboard__table']}`} key={field}>
                      <table>
                        <thead>
                        <tr>
                          <th className={styles['dashboard__table-th']}>Параметр</th>
                          <th className={styles['dashboard__table-th']}>Значение</th>
                          <th className={styles['dashboard__table-th']}>Ед. измерения</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Object.entries(endpointData[field]).map(([key, value]) => (
                          <tr key={key}>
                            <td className={styles['dashboard__table-td']}>{key}</td>
                            <td className={styles['dashboard__table-td']}>
                              {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                            </td>
                            <td className={styles['dashboard__table-td']}>
                              -
                            </td>
                          </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ))
              ) : (
                <p>График для {displayName} (в разработке)</p>
              )}
            </div>
          </div>
        );
      })}
      {Object.keys(config).length === 0 && !isLoading && (
        <p className={styles.dashboard__error}>Настройте дашборд, чтобы отобразить данные.</p>
      )}
    </div>
  );
};

export default Dashboard;