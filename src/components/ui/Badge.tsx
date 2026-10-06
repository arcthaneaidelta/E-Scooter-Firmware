import React from 'react';

export type BadgeVariant = 'supported' | 'read-only' | 'out-of-scope' | 'active' | 'unused' | 'revoked' | 'default' | 'warning' | 'info' | 'mismatch';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  pulse = false,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string }> = {
    mismatch: {
      bg: 'bg-[#F4E1DE]',
      text: 'text-[#822E27]',
      border: 'border-[#E5B5AF]',
      dot: 'bg-[#A8423A]'
    },
    supported: {
      bg: 'bg-[#E5F0E9]',
      text: 'text-[#28573D]',
      border: 'border-[#BDDBC7]',
      dot: 'bg-[#3F7D5A]'
    },
    'read-only': {
      bg: 'bg-[#E1ECF3]',
      text: 'text-[#264A62]',
      border: 'border-[#B8D3E5]',
      dot: 'bg-[#3E6A8A]'
    },
    'out-of-scope': {
      bg: 'bg-[#F2EFE9]',
      text: 'text-[#646A66]',
      border: 'border-[#DBD6CB]',
      dot: 'bg-[#8F9490]'
    },
    active: {
      bg: 'bg-[#E5F0E9]',
      text: 'text-[#28573D]',
      border: 'border-[#BDDBC7]',
      dot: 'bg-[#3F7D5A]'
    },
    unused: {
      bg: 'bg-[#F6ECD6]',
      text: 'text-[#87550E]',
      border: 'border-[#E4D1A6]',
      dot: 'bg-[#B7791F]'
    },
    revoked: {
      bg: 'bg-[#F4E1DE]',
      text: 'text-[#822E27]',
      border: 'border-[#E5B5AF]',
      dot: 'bg-[#A8423A]'
    },
    warning: {
      bg: 'bg-[#F6ECD6]',
      text: 'text-[#87550E]',
      border: 'border-[#E4D1A6]',
      dot: 'bg-[#B7791F]'
    },
    info: {
      bg: 'bg-[#E1ECF3]',
      text: 'text-[#264A62]',
      border: 'border-[#B8D3E5]',
      dot: 'bg-[#3E6A8A]'
    },
    default: {
      bg: 'bg-secondary',
      text: 'text-ink',
      border: 'border-border',
      dot: 'bg-text-secondary'
    }
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-[6px] border ${style.bg} ${style.text} ${style.border} ${sizeClasses} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${style.dot} ${pulse ? 'pulse-subtle' : ''}`}
      />
      <span>{children}</span>
    </span>
  );
};
