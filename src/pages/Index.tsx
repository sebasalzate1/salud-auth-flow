import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  useEffect(() => {
    // Redirect to login page as the main entry point
  }, []);

  return <Navigate to="/login" replace />;
};

export default Index;
