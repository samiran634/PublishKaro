interface ContributorChipProps {
    name: string;
    affiliation?: string;
}

export function ContributorChip({ name, affiliation }: ContributorChipProps) {
    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            background: 'rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.18)',
            borderRadius: 20, padding: '0.15rem 0.55rem',
            fontFamily: "'JetBrains Mono',monospace", fontSize: '0.58rem', color: '#94a3b8',
            maxWidth: 180, overflow: 'hidden'
        }}>
            <span style={{
                width: 14, height: 14, borderRadius: '50%',
                background: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.45rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                fontFamily: "'Playfair Display',serif"
            }}>
                {name.charAt(0).toUpperCase()}
            </span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {name}{affiliation ? ` · ${affiliation}` : ''}
            </span>
        </div>
    );
}
