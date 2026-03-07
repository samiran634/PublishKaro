import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Layout({ children }: { children: ReactNode }) {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        logout();
        navigate('/');
    };

    return (
        <>
            {/* ── Navigation ── */}
            <nav className="sf-nav">
                <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
                    <div className="logo-box">
                        <span className="logo-letter">PK</span>
                    </div>
                    <div>
                        <div className="brand-name">PublishKaro</div>
                        <div className="brand-sub">Autonomous Publishing</div>
                    </div>
                </Link>

                <div className="nav-links">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="nav-link">
                                dashboard
                            </Link>
                            <button className="btn-secondary" onClick={handleLogout} style={{ fontSize: '0.78rem', padding: '0.4rem 0.9rem' }}>
                                logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">
                                sign_in
                            </Link>
                            <Link to="/signup">
                                <button className="btn-secondary" style={{ fontSize: '0.78rem', padding: '0.4rem 0.9rem' }}>
                                    get_started →
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* ── Page Content ── */}
            <main style={{ position: 'relative', zIndex: 10 }}>
                {children}
            </main>
        </>
    );
}
