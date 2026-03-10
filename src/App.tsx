import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import Home from './pages/Home';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanelPage from './pages/AdminPanelPage';

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminPanelPage />} />
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
