import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Layout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-primary)]/80 border-b border-[var(--border-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Brand */}
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center shadow-lg shadow-[var(--accent-primary)]/20 group-hover:shadow-[var(--accent-primary)]/40 transition-shadow">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent">
                                PublishKaro
                            </span>
                        </Link>

                        {/* Nav Links */}
                        <div className="flex items-center gap-2">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/dashboard')
                                                ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                                            }`}
                                    >
                                        Dashboard
                                    </Link>
                                    <div className="w-px h-6 bg-[var(--border-primary)] mx-1" />
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white text-xs font-bold">
                                            {user?.firstName?.charAt(0).toUpperCase()}
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/login')
                                                ? 'bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]'
                                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                                            }`}
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-md shadow-[var(--accent-primary)]/20 hover:shadow-lg hover:shadow-[var(--accent-primary)]/30 hover:scale-[1.02] transition-all duration-200"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-[var(--text-muted)]">
                            © {new Date().getFullYear()} PublishKaro. Built for researchers.
                        </p>
                        <div className="flex items-center gap-6">
                            <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                                Privacy
                            </a>
                            <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                                Terms
                            </a>
                            <a href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors">
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
