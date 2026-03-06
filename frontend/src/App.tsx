import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Page modules
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';

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
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Starfield />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
