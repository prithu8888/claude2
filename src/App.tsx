import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import AppShell from './components/shell/AppShell';
import BottomNav from './components/shell/BottomNav';
import Sidebar from './components/shell/Sidebar';
import FloatingAIButton from './components/shared/FloatingAIButton';
import DemoShowcase from './components/demo/DemoShowcase';
import Login from './components/auth/Login';
import KycFlow from './components/kyc/KycFlow';
import Onboarding from './components/onboarding/Onboarding';
import PromoterHome from './components/home/PromoterHome';
import SellFlow from './components/sell/SellFlow';
import Wallet from './components/wallet/Wallet';
import ClaimsFNOL from './components/claims/ClaimsFNOL';
import DealerDashboard from './components/dealer/DealerDashboard';
import BrandAdminDashboard from './components/brand-admin/BrandAdminDashboard';
import BrandAdminDealers from './components/brand-admin/BrandAdminDealers';
import BrandAdminProducts from './components/brand-admin/BrandAdminProducts';
import BrandAdminSales from './components/brand-admin/BrandAdminSales';
import BrandAdminClaims from './components/brand-admin/BrandAdminClaims';
import SuperAdminDashboard from './components/super-admin/SuperAdminDashboard';
import SuperAdminBrands from './components/super-admin/SuperAdminBrands';
import SuperAdminPolicies from './components/super-admin/SuperAdminPolicies';
import SuperAdminFinance from './components/super-admin/SuperAdminFinance';
import SuperAdminConfig from './components/super-admin/SuperAdminConfig';
import GSTInvoices from './components/gst/GSTInvoices';
import UserManagement from './components/rbac/UserManagement';
import MorePage from './components/more/MorePage';
import Transactions from './components/transactions/Transactions';
import Incentives from './components/incentives/Incentives';
import Campaigns from './components/campaigns/Campaigns';
import Training from './components/training/Training';
import AskMpos from './components/ask/AskMpos';
import WhatsAppLog from './components/whatsapp/WhatsAppLog';
import SettingsPage from './components/settings/SettingsPage';
import BulkOnboarding from './components/bulk-onboarding/BulkOnboarding';
import PlanConfigGenerator from './components/plan-config/PlanConfigGenerator';
import DealerNetwork from './components/dealer-network/DealerNetwork';
import DealerSetupWizard from './components/dealer-setup-wizard/DealerSetupWizard';
import './App.css';

// Picks the right home component based on the active role
function RoleHome() {
  const { activeRole } = useAppStore();
  switch (activeRole) {
    case 'acko-super-admin':
      return <SuperAdminDashboard />;
    case 'brand-admin':
      return <BrandAdminDashboard />;
    case 'dealer':
      return <DealerDashboard />;
    default:
      return <PromoterHome />;
  }
}

function AppContent() {
  const { isAuthenticated, hasSeenDemo, activeRole } = useAppStore();
  const location = useLocation();

  // Pre-login flow: demo -> login -> home
  if (location.pathname === '/') {
    if (!hasSeenDemo) return <DemoShowcase />;
    return <Navigate to={isAuthenticated ? '/home' : '/login'} replace />;
  }

  if (location.pathname === '/login') {
    if (isAuthenticated) return <Navigate to="/home" replace />;
    return <Login />;
  }

  // Gate all other routes behind auth
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Full-page wizard — renders outside of AppShell (no sidebar/header chrome)
  if (location.pathname === '/setup-wizard') {
    return <DealerSetupWizard />;
  }

  const isDesktop =
    activeRole === 'brand-admin' ||
    activeRole === 'acko-super-admin' ||
    activeRole === 'dealer';

  return (
    <AppShell>
      <div className={`app-layout ${isDesktop ? 'desktop-layout' : ''}`}>
        <Sidebar />
        <div className="app-content">
          <Routes>
            <Route path="/home" element={<RoleHome />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/kyc" element={<KycFlow />} />

            {/* Core flows */}
            <Route path="/sell" element={<SellFlow />} />
            <Route path="/new-sale" element={<SellFlow />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/claims" element={<ClaimsFNOL />} />
            <Route path="/claims/new" element={<ClaimsFNOL />} />

            {/* Money */}
            <Route path="/incentives" element={<Incentives />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/invoices" element={<GSTInvoices />} />

            {/* Growth */}
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/new" element={<Campaigns />} />
            <Route path="/training" element={<Training />} />
            <Route path="/training/:courseId" element={<Training />} />

            {/* AI / comms */}
            <Route path="/ask" element={<AskMpos />} />
            <Route path="/whatsapp" element={<WhatsAppLog />} />

            {/* Admin surfaces (scoped) */}
            <Route path="/dealers" element={<DealerNetwork />} />
            <Route path="/dealers/legacy" element={<BrandAdminDealers />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/dealer-network" element={<DealerNetwork />} />
            <Route path="/bulk-onboarding" element={<BulkOnboarding />} />
            <Route path="/plan-config" element={<PlanConfigGenerator />} />
            <Route path="/products" element={<BrandAdminProducts />} />
            <Route path="/sales-report" element={<BrandAdminSales />} />
            <Route path="/admin/claims" element={<BrandAdminClaims />} />

            {/* Super admin surfaces */}
            <Route path="/super-admin/brands" element={<SuperAdminBrands />} />
            <Route path="/super-admin/policies" element={<SuperAdminPolicies />} />
            <Route path="/super-admin/finance" element={<SuperAdminFinance />} />
            <Route path="/super-admin/config" element={<SuperAdminConfig />} />

            {/* Profile & branding */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<SettingsPage />} />

            {/* More (mobile) */}
            <Route path="/more" element={<MorePage />} />

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </div>
      <BottomNav />
      <FloatingAIButton />
    </AppShell>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
