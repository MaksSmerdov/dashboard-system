import type {DashboardStorage, UserDashboardConfig} from "../types/dashboard.ts";

export const saveDashboardConfig = (userId: string, config: UserDashboardConfig) => {
  const currentStorage = localStorage.getItem('dashboardConfig');
  const storage: DashboardStorage = currentStorage ? JSON.parse(currentStorage) : {};
  storage[userId] = config;
  localStorage.setItem('dashboardConfig', JSON.stringify(storage));
};

export const loadDashboardConfig = (userId: string): UserDashboardConfig => {
  const currentStorage = localStorage.getItem('dashboardConfig');
  const storage: DashboardStorage = currentStorage ? JSON.parse(currentStorage) : {};
  return storage[userId] || {};
};