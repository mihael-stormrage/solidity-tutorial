import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

type PrimaryButtonProps<T extends 'link' | 'submit'> = {
  type?: T;
  children: ReactNode;
} & (T extends 'link' ? AnchorProps : ButtonProps);

const PrimaryButton = <T extends 'link' | 'submit'>({ type, children, ...rest }: PrimaryButtonProps<T>) => {
  const className = [
    'max-w-fit',
    'inline-flex',
    'items-center',
    'px-4',
    'py-2',
    'border',
    'border-transparent',
    'text-sm',
    'font-medium',
    'rounded-md',
    'shadow-sm',
    'text-white',
    'bg-indigo-600',
    'hover:bg-indigo-700',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-indigo-500',
    'disabled:opacity-80',
    'disabled:pointer-events-none',
  ].join(' ');
  if (type === 'link') return <a {...rest as AnchorProps} className={className}>{children}</a>;
  return <button {...rest as ButtonProps} className={className}>{children}</button>;
};

PrimaryButton.defaultProps = {
  type: 'submit',
};

export default PrimaryButton;
