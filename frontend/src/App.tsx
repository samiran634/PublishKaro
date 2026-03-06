import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Page modules
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage.tsx';

function Starfield() {
  useEffect(() => {
    const sf = document.getElementById('sf');
    if (!sf || sf.childElementCount > 0) return;
    for (let i = 0; i < 130; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const sz = Math.random() * 2 + 0.4;
      s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random() * 100}%;left:${Math.random() * 100}%;--dur:${2 + Math.random() * 4}s;--delay:${Math.random() * 5}s;opacity:${0.1 + Math.random() * 0.4};`;
      sf.appendChild(s);
    }
  }, []);

  return (
    <>
      <div className="grid-bg" />
      <div className="starfield" id="sf" />
      {/* Ambient teal glow — matches dashboard */}
      <div style={{
        position: 'fixed',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        height: 500,
        background: 'radial-gradient(ellipse, rgba(14,165,233,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      {/* Secondary gold glow (bottom-right) */}
      <div style={{
        position: 'fixed',
        bottom: '-10%',
        right: '-5%',
        width: 500,
        height: 400,
        background: 'radial-gradient(ellipse, rgba(245,158,11,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Starfield background for all non-dashboard pages */}
        <Starfield />
        <Routes>
          {/* Dashboard is full-viewport — it renders its own nav and background */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Shared Layout wraps the public / auth pages */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <LoginPage />
              </Layout>
            }
          />
          <Route
            path="/signup"
            element={
              <Layout>
                <SignupPage />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
