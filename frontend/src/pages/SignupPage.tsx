import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { ParticleCanvas } from '../components/ParticleCanvas';

export function SignupPage() {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);

        try {
            await signup({ name, email, password });
            navigate('/dashboard', { replace: true });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
                                Your research,<br /><span className="hl">published</span><br />on autopilot.
                            </h2>

                            <p className="panel-desc">
                                Join thousands of researchers who have eliminated manual submission workflows. Set up once, let agents handle the rest.
                            </p>

                            <div className="feat-list">
                                <div className="feat-item"><span className="feat-dot" />Connect your institution credentials</div>
                                <div className="feat-item"><span className="feat-dot" />Upload once, submit everywhere</div>
                                <div className="feat-item"><span className="feat-dot" />AI-generated cover letters</div>
                                <div className="feat-item"><span className="feat-dot" />Get notified on acceptance &amp; review</div>
                                <div className="feat-item"><span className="feat-dot" />Automated revision tracking</div>
                            </div>

                            <div className="beta-banner">★ FREE during beta — full access to all agents</div>
                        </div>
                    </div>

                    {/* ── Right Form Panel ── */}
                    <div className="form-panel">
                        <div className="status-badge"><span className="status-dot" />OPEN REGISTRATION</div>

                        <div className="form-eyebrow">// new researcher</div>
                        <h1 className="form-title">Create account</h1>
                        <p className="form-sub">Start automating your research publications today.</p>

                        {error && <div className="toast toast-error">{error}</div>}

                        <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
                            <div className="field">
                                <label className="field-label" htmlFor="r-name">Full Name</label>
                                <input
                                    className="field-input"
                                    id="r-name"
                                    type="text"
                                    placeholder="Jane Doe"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    minLength={2}
                                />
                            </div>

                            <div className="field">
                                <label className="field-label" htmlFor="r-email">Institutional Email</label>
                                <input
                                    className="field-input"
                                    id="r-email"
                                    type="email"
                                    placeholder="you@university.edu"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="side-by-side">
                                <div className="field">
                                    <label className="field-label" htmlFor="r-pwd">Password</label>
                                    <input
                                        className="field-input"
                                        id="r-pwd"
                                        type="password"
                                        placeholder="min. 8 chars"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="field">
                                    <label className="field-label" htmlFor="r-pwd2">Confirm</label>
                                    <input
                                        className="field-input"
                                        id="r-pwd2"
                                        type="password"
                                        placeholder="repeat"
                                        autoComplete="new-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-submit" disabled={isLoading}>
                                {isLoading ? 'Activating…' : 'Activate Account \u00a0→'}
                            </button>
                        </form>

                        <div className="divider-row">or</div>

                        <p className="switch-row">
                            Already a member?&nbsp;
                            <button className="switch-btn" onClick={() => navigate('/login')}>
                                ← Sign in
                            </button>
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
}
