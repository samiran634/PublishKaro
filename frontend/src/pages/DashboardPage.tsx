import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';

export function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Welcome Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                    Welcome back, <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">{user?.firstName}</span>
                </h1>
                <p className="text-[var(--text-secondary)] mt-1.5">Here's an overview of your publishing activity.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {[
                    { label: 'Papers Uploaded', value: '0', icon: '📄', color: 'var(--accent-primary)' },
                    { label: 'Submissions', value: '0', icon: '🚀', color: '#10b981' },
                    { label: 'In Review', value: '0', icon: '⏳', color: '#f59e0b' },
                    { label: 'Published', value: '0', icon: '✅', color: '#8b5cf6' },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 hover:border-[var(--accent-primary)]/30 transition-all duration-200"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <p className="text-3xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">Quick Actions</h2>
                <p className="text-[var(--text-secondary)] mb-6">Get started with your research publishing workflow.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        {
                            title: 'Upload Paper',
                            desc: 'Upload a research paper for AI-assisted submission.',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            ),
                        },
                        {
                            title: 'New Submission',
                            desc: 'Start a new journal submission with AI assistance.',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                                </svg>
                            ),
                        },
                        {
                            title: 'View History',
                            desc: 'Track the status of your previous submissions.',
                            icon: (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ),
                        },
                    ].map((action) => (
                        <button
                            key={action.title}
                            className="flex flex-col items-start p-5 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-tertiary)] hover:border-[var(--accent-primary)]/40 hover:shadow-lg hover:shadow-[var(--accent-primary)]/5 transition-all duration-200 text-left cursor-pointer group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)] mb-3 group-hover:scale-110 transition-transform">
                                {action.icon}
                            </div>
                            <h3 className="font-semibold text-[var(--text-primary)] mb-1">{action.title}</h3>
                            <p className="text-sm text-[var(--text-secondary)]">{action.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* User Info Card */}
            <div className="mt-8 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Profile Info</h2>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                    {[
                        { label: 'Name', value: `${user?.firstName} ${user?.lastName}` },
                        { label: 'Email', value: user?.email },
                        { label: 'Status', value: user?.isActive ? 'Active' : 'Inactive' },
                        { label: 'Last Login', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'First session' },
                    ].map((item) => (
                        <div key={item.label} className="flex flex-col py-3 border-b border-[var(--border-primary)] last:border-0">
                            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{item.label}</span>
                            <span className="text-[var(--text-primary)] font-medium mt-0.5">{item.value}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-6">
                    <Button variant="secondary" size="sm">
                        Edit Profile
                    </Button>
                </div>
            </div>
        </div>
    );
}
