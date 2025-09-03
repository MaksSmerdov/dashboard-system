import React, {type JSX} from 'react';
import {useSelector} from "react-redux";
import type {RootState} from "../store/store.ts";
import {Navigate} from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace/>;
  }

  return children;
};

export default ProtectedRoute;