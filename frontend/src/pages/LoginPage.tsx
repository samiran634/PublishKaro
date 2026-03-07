import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { ParticleCanvas } from '../components/ParticleCanvas';

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login({ email, password });
            navigate('/dashboard', { replace: true });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Login failed. Please try again.');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ParticleCanvas />

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 60px)', padding: '1rem', position: 'relative', zIndex: 1 }}>
                <div className="auth-card page-enter">

                    {/* ── Left Info Panel ── */}
                    <div className="info-panel">
                        <div className="panel-content">
                            <div className="logo-row">
                                <div className="logo-box"><span className="logo-letter">PK</span></div>
                                <div>
                                    <div className="brand-name">PublishKaro</div>
                                    <div className="brand-sub">Autonomous Publishing</div>
                                </div>
                            </div>

                            <h2 className="panel-title">
                                Publish research<br />with <span className="hl">AI agents</span>,<br />not paperwork.
                            </h2>

                            <p className="panel-desc">
                                Streamline your publication process , PublishKaro handles takes care of the formatting, submission & tracking of your research papers so you don't have to.
                            </p>

                            <div className="pipeline">
                                <div className="pipe-node"><span className="pipe-num">①</span> Smart Manuscript Intake</div>
                                <div className="pipe-arrow" />
                                <div className="pipe-node"><span className="pipe-num">②</span> Auto-formatting & Guideline check </div>
                                <div className="pipe-arrow" />
                                <div className="pipe-node"><span className="pipe-num">③</span> Seamless Journal Delivery </div>
                            </div>

                            <div className="feat-list">
                                <div className="feat-item"><span className="feat-dot" />IEEE, Springer, Elsevier &amp; 40+ venues</div>
                                <div className="feat-item"><span className="feat-dot" />Real-time submission tracking</div>
                                <div className="feat-item"><span className="feat-dot" />Automated revision handling</div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Form Panel ── */}
                    <div className="form-panel">
                        <div className="status-badge"><span className="status-dot" />AGENTS ONLINE</div>

                        <div className="form-eyebrow">// researcher access</div>
                        <h1 className="form-title">Welcome back</h1>
                        <p className="form-sub">Sign in to manage your publication pipeline.</p>

                        {error && <div className="toast toast-error">{error}</div>}

                        <form onSubmit={handleSubmit} style={{ marginTop: error ? '1rem' : 0 }}>
                            <div className="field" style={{ marginTop: error ? '0' : '0' }}>
                                <label className="field-label" htmlFor="l-uid">User ID / Email</label>
                                <input
                                    className="field-input"
                                    id="l-uid"
                                    type="text"
                                    placeholder="researcher_id"
                                    autoComplete="username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="field">
                                <label className="field-label" htmlFor="l-pwd">Password</label>
                                <input
                                    className="field-input"
                                    id="l-pwd"
                                    type="password"
                                    placeholder="••••••••••"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="row-extras">
                                <label className="check-label">
                                    <input
                                        type="checkbox"
                                        checked={keepSignedIn}
                                        onChange={(e) => setKeepSignedIn(e.target.checked)}
                                    />
                                    Keep me signed in
                                </label>
                                <button type="button" className="forgot">forgot password?</button>
                            </div>

                            <button type="submit" className="btn-submit" disabled={isLoading}>
                                {isLoading ? 'Authenticating…' : 'Sign In \u00a0→'}
                            </button>
                        </form>

                        <div className="divider-row">or</div>

                        <p className="switch-row">
                            New researcher?&nbsp;
                            <button className="switch-btn" onClick={() => navigate('/signup')}>
                                Create your account →
                            </button>
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}
