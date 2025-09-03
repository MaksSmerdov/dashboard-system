// src/hooks/useApiData.ts
import {useSelector, useDispatch} from 'react-redux';
import {useEffect} from 'react';
import type {RootState, AppDispatch} from "../store/store.ts";
import {fetchAllApiData} from "../store/slices/dataSlice.ts";

export const useApiData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.data.data);
  const loading = useSelector((state: RootState) => state.data.loading);
  const error = useSelector((state: RootState) => state.data.error);

  useEffect(() => {
    dispatch(fetchAllApiData());
  }, [dispatch]);

  return {data, loading, error};
};