import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FinanceModule from './pages/Finance';
import InventoryModule from './pages/Inventory';
import SalesModule from './pages/Sales';
import ProcurementModule from './pages/Procurement';
import HRModule from './pages/HR';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/finance" element={<FinanceModule />} />
          <Route path="/inventory" element={<InventoryModule />} />
          <Route path="/sales" element={<SalesModule />} />
          <Route path="/procurement" element={<ProcurementModule />} />
          <Route path="/hr" element={<HRModule />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
