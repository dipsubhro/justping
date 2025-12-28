import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Pinning from './pages/Pinning';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pinning" element={<Pinning />} />
        {/* <Route path="/pricing" element={<ComingSoon page="Pricing" />} />
        <Route path="/dashboard" element={<ComingSoon page="Dashboard" />} /> */}
      </Routes>
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
