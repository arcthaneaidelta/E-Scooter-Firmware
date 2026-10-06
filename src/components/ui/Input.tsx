import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  hint,
  error,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium uppercase tracking-[0.08em] text-text-secondary mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-text-muted pointer-events-none flex items-center">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`w-full bg-surface-elevated text-ink text-sm rounded-[6px] border transition-all duration-140 placeholder:text-text-muted/60 disabled:opacity-50 disabled:bg-bg ${
            error
              ? 'border-error focus:ring-2 focus:ring-error/20 focus:border-error'
              : 'border-border-strong hover:border-text-secondary focus:border-info focus:ring-2 focus:ring-info/20'
          } ${leftIcon ? 'pl-9' : 'pl-3.5'} ${rightIcon ? 'pr-9' : 'pr-3.5'} py-2.5 focus:outline-none ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 text-text-muted pointer-events-none flex items-center">
            {rightIcon}
          </span>
        )}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs text-error font-medium flex items-center gap-1">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
