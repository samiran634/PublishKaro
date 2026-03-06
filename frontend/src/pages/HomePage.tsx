import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function HomePage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="hero-wrapper">

            {/* ── Hero ── */}
            <div className="hero-badge">
                <span className="status-dot" style={{ background: 'var(--teal)', boxShadow: '0 0 6px var(--teal)' }} />
                AI-Powered Research Publishing
            </div>

            <h1 className="hero-title">
                Publish Research<br />with <span className="hl">AI Agents</span>,<br />not Paperwork.
            </h1>

            <p className="hero-sub">
                ScholarFlow deploys intelligent agents that format, submit, and track your papers across journals — automatically.
            </p>

            <div className="hero-cta">
                {isAuthenticated ? (
                    <button className="btn-submit" style={{ width: 'auto', fontSize: '0.95rem' }} onClick={() => navigate('/dashboard')}>
                        Go to Dashboard &nbsp;→
                    </button>
                ) : (
                    <>
                        <button className="btn-submit" style={{ width: 'auto', fontSize: '0.95rem' }} onClick={() => navigate('/signup')}>
                            Get Started Free &nbsp;→
                        </button>
                        <button className="btn-secondary" onClick={() => navigate('/login')}>
                            Sign In
                        </button>
                    </>
                )}
            </div>

            {/* ── Feature Cards ── */}
            <div className="features-grid">
                {[
                    {
                        icon: (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        ),
                        title: 'AI-Powered Automation',
                        desc: 'Agents handle journal submissions, CAPTCHA solving, and form filling using Amazon Bedrock and Nova Act.',
                    },
                    {
                        icon: (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        ),
                        title: 'Multi-Journal Support',
                        desc: 'Submit to IEEE, Springer, Elsevier, and more — all from a single dashboard with unified formatting.',
                    },
                    {
                        icon: (
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        ),
                        title: 'Secure &amp; Private',
                        desc: 'Your research stays safe with JWT authentication, encrypted storage, and S3 document handling.',
                    },
                ].map((f, i) => (
                    <div className="feature-card" key={i}>
                        <div className="feature-icon">{f.icon}</div>
                        <div className="feature-title">{f.title}</div>
                        <div className="feature-desc" dangerouslySetInnerHTML={{ __html: f.desc }} />
                    </div>
                ))}
            </div>

        </div>
    );
}
