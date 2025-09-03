export interface DashboardConfig {
  displayType: 'table' | 'chart';
  fields: string[];
}

export interface UserDashboardConfig {
  [endpointKey: string]: DashboardConfig;
}

export interface DashboardStorage {
  [userId: string]: UserDashboardConfig;
}