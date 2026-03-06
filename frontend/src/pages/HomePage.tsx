import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';

export function HomePage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--accent-primary)]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--accent-secondary)]/8 rounded-full blur-3xl pointer-events-none" />

            {/* Hero Section */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-sm font-medium mb-8 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                        AI-Powered Research Publishing
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--text-primary)] leading-tight mb-6 tracking-tight">
                        Publish Your Research
                        <span className="block bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
                            Effortlessly
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
                        PublishKaro uses AI agents to automate journal submissions, format papers, and handle the tedious publishing workflow — so you can focus on research.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        {isAuthenticated ? (
                            <Link to="/dashboard">
                                <Button size="lg">
                                    Go to Dashboard
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup">
                                    <Button size="lg">
                                        Get Started Free
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="secondary" size="lg">
                                        Log In
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-36">
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {[
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            ),
                            title: 'AI-Powered Automation',
                            desc: 'Our AI agents handle journal submissions, CAPTCHA solving, and form filling using Amazon Bedrock and Nova Act.',
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            ),
                            title: 'Multi-Journal Support',
                            desc: 'Submit to IEEE, Springer, Elsevier, and more — all from a single dashboard with unified formatting.',
                        },
                        {
                            icon: (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            ),
                            title: 'Secure & Private',
                            desc: 'Your research stays safe with JWT authentication, encrypted storage, and S3 document handling.',
                        },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="group relative p-6 lg:p-8 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--accent-primary)]/5"
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/15 to-[var(--accent-secondary)]/15 flex items-center justify-center text-[var(--accent-primary)] mb-5 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{feature.title}</h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
