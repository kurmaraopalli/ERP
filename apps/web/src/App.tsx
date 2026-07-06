import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FinanceModule from './pages/Finance';
import InventoryModule from './pages/Inventory';
import SalesModule from './pages/Sales';
import ProcurementModule from './pages/Procurement';
import HRModule from './pages/HR';
import Login from './pages/Login';

// ProtectedRoute defined outside App to avoid re-creation on every render
const ProtectedRoute = ({ isAuthenticated, children }: { isAuthenticated: boolean; children: React.ReactNode }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
        } />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="finance" element={<FinanceModule />} />
          <Route path="inventory" element={<InventoryModule />} />
          <Route path="sales" element={<SalesModule />} />
          <Route path="procurement" element={<ProcurementModule />} />
          <Route path="hr" element={<HRModule />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
