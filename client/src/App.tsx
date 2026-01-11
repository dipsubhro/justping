import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LoginModal from './components/LoginModal';
import ElementSelector from './components/ElementSelector';
import Navigate from './pages/Navigate';
import DashboardHome from './pages/DashboardHome';
import MonitorList from './pages/MonitorList';
import Billing from './pages/Billing';
import Alerts from './pages/Alerts';
import './index.css';
// import ProtectedRoute from './components/protected-route';

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/navigate" element={<Navigate />}>
            <Route index element={<DashboardHome />} />
            <Route path="monitors" element={<MonitorList />} />
            <Route path="pinning" element={<ElementSelector />} />
            <Route path="billing" element={<Billing />} />
            <Route path="alerts" element={<Alerts />} />
          {/* </Route> */}
        </Route>
      </Routes>
      
      {backgroundLocation && (
        <Routes>
          <Route path="/login" element={<LoginModal />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

// // Placeholder for future pages
// function ComingSoon({ page }: { page: string }) {
//   return (
//     <div style={{
//       minHeight: '100vh',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       backgroundColor: 'var(--bg-background)',
//       color: 'var(--text-primary)',
//       fontFamily: 'inherit',
//     }}>
//       <div style={{ textAlign: 'center' }}>
//         <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{page}</h1>
//         <p style={{ color: 'var(--text-secondary)' }}>Coming soon</p>
//       </div>
//     </div>
//   );
// }
