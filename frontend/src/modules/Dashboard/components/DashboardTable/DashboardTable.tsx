import React from 'react';
import styles from './DashboardTable.module.scss';
import type {GenericData} from "../../../../types/data.ts";

interface DashboardTableProps {
  data: GenericData;
  field: string;
}

const DashboardTable: React.FC<DashboardTableProps> = ({data, field}) => {
  return (
    <div>
      <table className={`${styles['dashboard__table']}`}>
        <thead className={`${styles['dashboard__table--head']}`}>
        <tr className={`${styles['dashboard__table--row']}`}>
          <th className={styles['dashboard__table--th']}>Параметр</th>
          <th className={styles['dashboard__table--th']}>Значение</th>
          <th className={styles['dashboard__table--th']}>Ед. изм</th>
        </tr>
        </thead>
        <tbody className={`${styles['dashboard__table--body']}`}>
        {Object.entries(data[field]).map(([key, value]) => (
          <tr className={`${styles['dashboard__table--row']}`} key={key}>
            <td className={`${styles['dashboard__table--td']} ${styles['name']}`}>{key}</td>
            <td className={styles['dashboard__table--td']}>
              {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
            </td>
            <td className={styles['dashboard__table--td']}>-</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;