// src/pages/Home.tsx
import React from 'react';
import {useSelector} from 'react-redux';
import type {RootState} from "../../store/store.ts";
import Dashboard from "../Dashboard/Dashboard.tsx";
import Header from "../../components/Header/Header.tsx";

const Home: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.email || 'guest');

  return (
    <>
      <Header/>
      <Dashboard userId={userId}/>
    </>
  );
};

export default Home;