import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import api from '@/services/api';

const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAdmin = localStorage.getItem('isAdmin');
        if (!isAdmin) {
          setIsAuthenticated(false);
          return;
        }

        // Verify the token with the backend
        const response = await api.get('/test');

        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('isAdmin');
          toast.error("Session expired. Please log in again.");
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('isAdmin');
        toast.error("Authentication failed. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-restaurant-green"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
