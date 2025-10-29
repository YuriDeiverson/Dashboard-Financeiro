
import React from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import { FiltersProvider } from './hooks/useFilters';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return user ? (
    <FiltersProvider>
      <DashboardPage />
    </FiltersProvider>
  ) : (
    <LoginPage />
  );
};

export default App;
