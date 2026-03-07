import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import AppShell from './components/shell/AppShell';
import BottomNav from './components/shell/BottomNav';
import Sidebar from './components/shell/Sidebar';
import Onboarding from './components/onboarding/Onboarding';
import PromoterHome from './components/home/PromoterHome';
import SellFlow from './components/sell/SellFlow';
import Wallet from './components/wallet/Wallet';
import ClaimsFNOL from './components/claims/ClaimsFNOL';
import DealerDashboard from './components/dealer/DealerDashboard';
import DistributorDashboard from './components/dealer/DistributorDashboard';
import BrandAdminDashboard from './components/brand-admin/BrandAdminDashboard';
import BrandAdminDealers from './components/brand-admin/BrandAdminDealers';
import BrandAdminProducts from './components/brand-admin/BrandAdminProducts';
import BrandAdminSales from './components/brand-admin/BrandAdminSales';
import BrandAdminClaims from './components/brand-admin/BrandAdminClaims';
import BrandAdminSettings from './components/brand-admin/BrandAdminSettings';
import SuperAdminDashboard from './components/super-admin/SuperAdminDashboard';
import SuperAdminBrands from './components/super-admin/SuperAdminBrands';
import SuperAdminPolicies from './components/super-admin/SuperAdminPolicies';
import SuperAdminFinance from './components/super-admin/SuperAdminFinance';
import SuperAdminConfig from './components/super-admin/SuperAdminConfig';
import GSTInvoices from './components/gst/GSTInvoices';
import UserManagement from './components/rbac/UserManagement';
import MorePage from './components/more/MorePage';
import './App.css';

function AppRoutes() {
  const { activeRole } = useAppStore();
  const isDesktop = activeRole === 'brand-admin' || activeRole === 'acko-super-admin';

  const getDefaultRoute = () => {
    switch (activeRole) {
      case 'dealer': return '/dealer';
      case 'distributor': return '/distributor';
      case 'brand-admin': return '/brand-admin';
      case 'acko-super-admin': return '/super-admin';
      default: return '/home';
    }
  };

  return (
    <AppShell>
      <div className={`app-layout ${isDesktop ? 'desktop-layout' : ''}`}>
        <Sidebar />
        <div className="app-content">
          <Routes>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/home" element={<PromoterHome />} />
            <Route path="/sell" element={<SellFlow />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/claims" element={<ClaimsFNOL />} />
            <Route path="/more" element={<MorePage />} />
            <Route path="/gst" element={<GSTInvoices />} />
            <Route path="/reports" element={
              <div className="reports-page">
                <h2>Reports</h2>
                <div className="placeholder-card">
                  <p>Reports module coming soon</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-2)' }}>
                    Sales analytics, performance trends, and exportable reports will appear here.
                  </p>
                </div>
              </div>
            } />
            <Route path="/dealer" element={<DealerDashboard />} />
            <Route path="/distributor" element={<DistributorDashboard />} />
            <Route path="/brand-admin" element={<BrandAdminDashboard />} />
            <Route path="/brand-admin/dealers" element={<BrandAdminDealers />} />
            <Route path="/brand-admin/products" element={<BrandAdminProducts />} />
            <Route path="/brand-admin/sales" element={<BrandAdminSales />} />
            <Route path="/brand-admin/claims" element={<BrandAdminClaims />} />
            <Route path="/brand-admin/users" element={<UserManagement />} />
            <Route path="/brand-admin/settings" element={<BrandAdminSettings />} />
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/super-admin/brands" element={<SuperAdminBrands />} />
            <Route path="/super-admin/dealers" element={<BrandAdminDealers />} />
            <Route path="/super-admin/policies" element={<SuperAdminPolicies />} />
            <Route path="/super-admin/claims" element={<BrandAdminClaims />} />
            <Route path="/super-admin/finance" element={<SuperAdminFinance />} />
            <Route path="/super-admin/users" element={<UserManagement />} />
            <Route path="/super-admin/config" element={<SuperAdminConfig />} />
            <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
          </Routes>
        </div>
      </div>
      <BottomNav />
    </AppShell>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
