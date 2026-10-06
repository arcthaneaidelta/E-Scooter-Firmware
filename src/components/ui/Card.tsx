import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'selected';
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-surface border border-border rounded-[14px]',
    elevated: 'bg-surface-elevated border border-border rounded-[14px] shadow-sm',
    interactive: 'bg-surface border border-border hover:border-border-strong hover:-translate-y-0.5 transition-all duration-200 rounded-[14px] cursor-pointer shadow-sm',
    selected: 'bg-surface border-2 border-primary rounded-[14px] shadow-md',
  }[variant];

  return (
    <Component className={`${variantStyles} p-5 ${className}`} {...props}>
      {children}
    </Component>
  );
};
