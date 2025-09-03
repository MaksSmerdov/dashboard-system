import React, {useState, useEffect} from 'react';
import Modal from "../../../../components/UI/Modal/Modal.tsx";
import {useSelector} from 'react-redux';
import type {RootState} from "../../../../store/store.ts";
import {saveDashboardConfig, loadDashboardConfig} from "../../utils/localStorage.ts";
import {API_ENDPOINTS} from "../../../../store/slices/dataSlice.ts";
import styles from './DashboardConfig.module.scss';

interface DashboardConfigProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const DashboardConfig: React.FC<DashboardConfigProps> = ({isOpen, onClose, userId}) => {
  const {data} = useSelector((state: RootState) => state.data);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('');
  const [displayType, setDisplayType] = useState<'table' | 'chart'>('table');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  // Загружаем существующие настройки или устанавливаем все поля по умолчанию
  useEffect(() => {
    const config = loadDashboardConfig(userId);
    if (config[selectedEndpoint]) {
      setDisplayType(config[selectedEndpoint].displayType);
      setSelectedFields(config[selectedEndpoint].fields);
    } else if (selectedEndpoint && data[selectedEndpoint]) {
      // По умолчанию выбираем все доступные поля
      const availableFields = Object.keys(data[selectedEndpoint]).filter(
        (key) => key !== '_id' && key !== '__v' && key !== 'lastUpdated'
      );
      setDisplayType('table');
      setSelectedFields(availableFields);
    } else {
      setDisplayType('table');
      setSelectedFields([]);
    }
  }, [selectedEndpoint, userId, data]);

  const handleSave = () => {
    const config = loadDashboardConfig(userId);
    config[selectedEndpoint] = {displayType, fields: selectedFields};
    saveDashboardConfig(userId, config);
    onClose();
  };

  const handleFieldChange = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  // Доступные поля для выбранного эндпоинта
  const availableFields = selectedEndpoint && data[selectedEndpoint]
    ? Object.keys(data[selectedEndpoint]).filter(
      (key) => key !== '_id' && key !== '__v' && key !== 'lastUpdated'
    )
    : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Настройка дашборда">
      <div className={styles['dashboard-config-modal__form']}>
        <div className={styles['dashboard-config-modal__field']}>
          <label className={styles['dashboard-config-modal__label']}>Выберите объект:</label>
          <select
            className={styles['dashboard-config-modal__select']}
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
          >
            <option value="">-- Выберите объект --</option>
            {API_ENDPOINTS.map((endpoint) => (
              <option key={endpoint.key} value={endpoint.key}>
                {endpoint.displayName}
              </option>
            ))}
          </select>
        </div>

        {selectedEndpoint && (
          <>
            <div className={styles['dashboard-config-modal__field']}>
              <label className={styles['dashboard-config-modal__label']}>Тип отображения:</label>
              <select
                className={styles['dashboard-config-modal__select']}
                value={displayType}
                onChange={(e) => setDisplayType(e.target.value as 'table' | 'chart')}
              >
                <option value="table">Таблица</option>
                <option value="chart">График (в разработке)</option>
              </select>
            </div>

            <div className={styles['dashboard-config-modal__field']}>
              <label className={styles['dashboard-config-modal__label']}>Выберите данные:</label>
              <div className={styles['dashboard-config-modal__checkbox-group']}>
                {availableFields.map((field) => (
                  <label key={field} className={styles['dashboard-config-modal__checkbox']}>
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field)}
                      onChange={() => handleFieldChange(field)}
                    />
                    {field}
                  </label>
                ))}
              </div>
            </div>

            <button className={styles['dashboard-config-modal__button']} onClick={handleSave}>
              Сохранить
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default DashboardConfig;