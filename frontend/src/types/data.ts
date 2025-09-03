export interface GenericData {
  [key: string]: number | string | boolean | GenericData; // Рекурсивный тип для любых вложенных объектов
}

export interface ApiData {
  _id: string;

  [key: string]: GenericData | string | number; // Поддержка любых полей (temperatures, parameters, info и т.д.)
  lastUpdated: string;
  __v: number;
}

// Тип для состояния слайса
export interface DataState {
  data: { [key: string]: ApiData | null }; // Храним данные по ключу (vr1, vr2, mpa2, kotel1 и т.д.)
  loading: { [key: string]: 'idle' | 'pending' | 'succeeded' | 'failed' };
  error: { [key: string]: string | null };
}