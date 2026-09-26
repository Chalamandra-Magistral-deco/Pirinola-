import React from 'react';

export interface LinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: string;
  iconAlt?: string;
  className?: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  children,
  variant = 'secondary',
  icon,
  iconAlt,
  className = '',
}) => {
  const baseStyles = "flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 transition-colors font-medium text-sm md:w-[158px]";
  const variants = {
    primary: "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-sm",
    secondary: "border border-solid border-black/[.08] hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] text-zinc-800 dark:text-zinc-200",
  };

  return (
    <a
      className={`${baseStyles} ${variants[variant]} ${className}`}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon && (
        <img
          className="dark:invert w-4 h-4 object-contain inline-block"
          src={icon}
          alt={iconAlt || ""}
          width={16}
          height={16}
        />
      )}
      {children}
    </a>
  );
};
