import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export function Input({ label, error, icon: _icon, className = '', ...props }: InputProps) {
    return (
        <div className="field">
            {label && (
                <label className="field-label" htmlFor={props.id || props.name}>
                    {label}
                </label>
            )}
            <input
                id={props.id || props.name}
                className={`field-input ${className}`}
                {...props}
            />
            {error && <div className="field-error">{error}</div>}
        </div>
    );
}
