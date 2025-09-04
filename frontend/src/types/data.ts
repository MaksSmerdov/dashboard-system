export interface GenericData {
  [key: string]: number | string | boolean | GenericData;
}

export interface ApiData {
  _id: string;

  [key: string]: GenericData | string | number;

  lastUpdated: string;
  __v: number;
}

// Тип для состояния слайса
export interface DataState {
  data: { [key: string]: ApiData | null };
  loading: { [key: string]: 'idle' | 'pending' | 'succeeded' | 'failed' };
  error: { [key: string]: string | null };
}