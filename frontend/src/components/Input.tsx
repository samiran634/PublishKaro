import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = '', id, ...props }, ref) => {
        const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full">
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
                >
                    {label}
                </label>
                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`
              w-full rounded-xl border bg-[var(--bg-tertiary)] text-[var(--text-primary)]
              placeholder:text-[var(--text-muted)]
              focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent
              transition-all duration-200
              ${icon ? 'pl-11' : 'pl-4'} pr-4 py-3
              ${error ? 'border-red-500/60 ring-1 ring-red-500/30' : 'border-[var(--border-primary)] hover:border-[var(--accent-primary)]/50'}
              ${className}
            `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
