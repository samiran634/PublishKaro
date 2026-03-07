import { useState, useRef } from 'react';

interface UploadModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const API = 'http://localhost:5000/api';

function getToken(): string | null {
    try {
        return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    } catch {
        return null;
    }
}

export function UploadModal({ onClose, onSuccess }: UploadModalProps) {
    const [useOjsTest, setUseOjsTest] = useState(false);
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [dragging, setDragging] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (f: File) => setFile(f);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragging(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    };

    const handleSubmit = async () => {
        if (!useOjsTest && (!file || !title.trim())) {
            setMessage('Please provide a title and select a file.'); return;
        }
        setStatus('loading'); setMessage('');
        const token = getToken();
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            if (useOjsTest) {
                // Fire test-flow (no file needed)
                const res = await fetch(`${API}/test-flow`, { method: 'POST', headers });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Test flow failed');
                setStatus('success'); setMessage('OJS test flow started! Tracker is updating…');
                setTimeout(() => { onSuccess(); onClose(); }, 1200);
            } else {
                const form = new FormData();
                form.append('file', file!);
                form.append('title', title.trim());
                form.append('publicationSites', JSON.stringify([{
                    name: 'Open Journal Systems (OJS)',
                    url: 'https://demo.publicknowledgeproject.org/ojs3/testdrive/index.php/testdrive-journal'
                }]));
                const res = await fetch(`${API}/upload`, { method: 'POST', headers, body: form });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Upload failed');
                setStatus('success'); setMessage('Paper uploaded! Agents are processing it…');
                setTimeout(() => { onSuccess(); onClose(); }, 1200);
            }
        } catch (err: any) {
            setStatus('error'); setMessage(err.message || 'Something went wrong');
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(10,15,30,0.88)', backdropFilter: 'blur(6px)',
        }} onClick={e => e.target === e.currentTarget && onClose()}>
            <div style={{
                width: '100%', maxWidth: 540, background: '#0f1729',
                border: '1px solid rgba(14,165,233,0.22)', borderRadius: 6,
                boxShadow: '0 24px 80px rgba(0,0,0,0.7)', overflow: 'hidden',
                animation: 'fadeUp .35s cubic-bezier(0.22,1,0.36,1) both',
            }}>
                {/* Header */}
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--teal)', marginBottom: '0.2rem' }}>// new submission</p>
                        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700, color: '#f1f5f9' }}>Upload Research Paper</h2>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, color: '#64748b', width: 28, height: 28, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                </div>

                <div style={{ padding: '1.5rem' }}>
                    {/* OJS Test Toggle */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0.85rem 1rem', marginBottom: '1.25rem', borderRadius: 4,
                        background: useOjsTest ? 'rgba(14,165,233,0.08)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${useOjsTest ? 'rgba(14,165,233,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        cursor: 'pointer', transition: 'all .2s',
                    }} onClick={() => setUseOjsTest(v => !v)}>
                        <div>
                            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', fontWeight: 600, color: useOjsTest ? '#7dd3fc' : '#94a3b8', letterSpacing: '0.06em' }}>🧪 Test with OJS Demo URI</p>
                            <p style={{ fontSize: '0.68rem', color: '#475569', marginTop: '0.15rem', fontFamily: "'JetBrains Mono',monospace" }}>demo.publicknowledgeproject.org/ojs3/testdrive</p>
                        </div>
                        <div style={{
                            width: 36, height: 20, borderRadius: 10, position: 'relative',
                            background: useOjsTest ? 'var(--teal)' : 'rgba(255,255,255,0.1)',
                            transition: 'background .2s', flexShrink: 0,
                        }}>
                            <div style={{
                                position: 'absolute', top: 2, left: useOjsTest ? 18 : 2,
                                width: 16, height: 16, borderRadius: '50%', background: '#fff',
                                transition: 'left .2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                            }} />
                        </div>
                    </div>

                    {/* Real upload fields — hidden when OJS test is active */}
                    {!useOjsTest && (
                        <>
                            {/* Title */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.4rem' }}>Paper Title *</label>
                                <input
                                    value={title} onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g. Neural Architectures for Low-Resource NLP"
                                    style={{
                                        width: '100%', padding: '0.6rem 0.85rem', borderRadius: 3,
                                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#e2e8f0', fontSize: '0.85rem', outline: 'none',
                                        fontFamily: "'Source Sans 3',sans-serif", transition: 'border-color .2s',
                                    }}
                                    onFocus={e => e.target.style.borderColor = 'rgba(14,165,233,0.5)'}
                                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                                />
                            </div>

                            {/* Drop zone */}
                            <div
                                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                style={{
                                    padding: '1.5rem', borderRadius: 4, cursor: 'pointer', textAlign: 'center',
                                    border: `1.5px dashed ${dragging ? 'var(--teal)' : file ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.1)'}`,
                                    background: dragging ? 'rgba(14,165,233,0.05)' : 'rgba(255,255,255,0.02)',
                                    transition: 'all .2s', marginBottom: '1rem',
                                }}>
                                <p style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{file ? '✅' : '📄'}</p>
                                <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '0.9rem', color: file ? '#86efac' : '#94a3b8', marginBottom: '0.2rem' }}>
                                    {file ? file.name : 'Drop your paper here'}
                                </p>
                                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', color: '#475569', letterSpacing: '0.06em' }}>
                                    {file ? `${(file.size / 1024).toFixed(1)} KB` : 'PDF, TXT, PPT — max 10 MB'}
                                </p>
                                <input ref={fileRef} type="file" accept=".pdf,.txt,.ppt,.pptx" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                            </div>
                        </>
                    )}

                    {useOjsTest && (
                        <div style={{ padding: '0.85rem 1rem', borderRadius: 4, background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.15)', marginBottom: '1rem' }}>
                            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '0.62rem', color: '#7dd3fc', lineHeight: 1.6 }}>
                                This will dispatch a simulated manuscript to the OJS testdrive instance. No file upload required — the agent pipeline runs its full stages and you can track progress in real time.
                            </p>
                        </div>
                    )}

                    {/* Status message */}
                    {message && (
                        <div style={{ padding: '0.6rem 0.85rem', borderRadius: 3, marginBottom: '1rem', fontSize: '0.75rem', fontFamily: "'JetBrains Mono',monospace", background: status === 'error' ? 'rgba(248,113,113,0.1)' : 'rgba(74,222,128,0.08)', color: status === 'error' ? '#fca5a5' : '#86efac', border: `1px solid ${status === 'error' ? 'rgba(248,113,113,0.2)' : 'rgba(74,222,128,0.15)'}` }}>
                            {message}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button onClick={onClose} style={{ flex: 1, padding: '0.65rem', borderRadius: 3, background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={status === 'loading'}
                            style={{ flex: 2, padding: '0.65rem', borderRadius: 3, cursor: status === 'loading' ? 'wait' : 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, border: 'none', color: '#fff', transition: 'opacity .2s', opacity: status === 'loading' ? 0.7 : 1, background: useOjsTest ? 'linear-gradient(135deg,#0ea5e9,#0369a1)' : 'linear-gradient(135deg,#0ea5e9,#0369a1)', boxShadow: '0 4px 14px rgba(14,165,233,0.3)' }}>
                            {status === 'loading' ? 'Processing…' : useOjsTest ? '🧪 Run OJS Test Flow' : '🚀 Upload & Submit'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
