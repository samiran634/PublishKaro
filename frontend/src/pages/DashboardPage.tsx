import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const stats = [
        { label: 'Papers Uploaded', value: '0', icon: '📄' },
        { label: 'Submissions', value: '0', icon: '🚀' },
        { label: 'In Review', value: '0', icon: '⏳' },
        { label: 'Published', value: '0', icon: '✅' },
    ];

    const actions = [
        {
            title: 'Upload Paper',
            desc: 'Upload a research paper for AI-assisted submission.',
            icon: (
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
            ),
        },
        {
            title: 'New Submission',
            desc: 'Start a new journal submission with AI assistance.',
            icon: (
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
            ),
        },
        {
            title: 'View History',
            desc: 'Track the status of your previous submissions.',
            icon: (
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="dashboard-wrapper">

            {/* ── Header ── */}
            <div className="dash-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div className="status-badge" style={{ marginBottom: '0.75rem' }}>
                        <span className="status-dot" />PUBLICATION PIPELINE ACTIVE
                    </div>
                    <h1 className="dash-title">
                        Welcome back, <span className="hl">{user?.firstName || 'Researcher'}</span>
                    </h1>
                    <p className="dash-sub">Here's an overview of your publishing activity.</p>
                </div>
                <button className="btn-secondary" onClick={handleLogout} style={{ marginTop: '0.5rem' }}>
                    logout →
                </button>
            </div>

            {/* ── Stats ── */}
            <div className="stats-grid">
                {stats.map((s) => (
                    <div className="stat-card" key={s.label}>
                        <div className="stat-icon">{s.icon}</div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Quick Actions ── */}
            <div className="panel-card">
                <div className="panel-card-title">Quick Actions</div>
                <div className="panel-card-sub">Get started with your research publishing workflow.</div>
                <div className="actions-grid">
                    {actions.map((a) => (
                        <button className="action-btn" key={a.title}>
                            <div className="action-icon">{a.icon}</div>
                            <div className="action-title">{a.title}</div>
                            <div className="action-desc">{a.desc}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Profile Info ── */}
            <div className="panel-card">
                <div className="panel-card-title">Profile Info</div>
                <div className="profile-row">
                    {[
                        { label: 'Name', value: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || '—' },
                        { label: 'Email', value: user?.email ?? '—' },
                        { label: 'Status', value: user?.isActive ? 'Active' : 'Inactive' },
                        { label: 'Last Login', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'First session' },
                    ].map((item) => (
                        <div className="profile-item" key={item.label}>
                            <div className="profile-key">{item.label}</div>
                            <div className="profile-val">{item.value}</div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '1.25rem' }}>
                    <button className="btn-secondary">Edit Profile</button>
                </div>
            </div>

        </div>
    );
}
