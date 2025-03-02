import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-accent-pink text-white hover:shadow-[0_5px_15px_rgba(255,56,180,0.4)] hover:-translate-y-0.5',
        secondary: 'bg-transparent border border-text-secondary text-text-primary hover:border-accent-pink hover:text-accent-pink',
        tertiary: 'bg-transparent text-text-primary hover:bg-white/5 hover:border-text-primary border border-transparent',
        ghost: 'bg-transparent hover:bg-white/5 text-text-primary',
        danger: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-5 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      icon,
      iconPosition = 'right',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {icon && iconPosition === 'left' && !isLoading && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && !isLoading && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };