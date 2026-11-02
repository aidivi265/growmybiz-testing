import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { SYNE_FONT } from '@/lib/fonts';

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer';
  const sizes = { sm: 'px-3.5 py-2 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3.5 text-[0.9375rem]' };
  const variants = {
    primary:   'bg-[#477BDB] hover:bg-[#3366C8] text-white hover:shadow-[0_6px_20px_rgba(71,123,219,0.35)] hover:-translate-y-0.5',
    secondary: 'border-[1.5px] border-[#477BDB] text-[#477BDB] hover:bg-[#EBF1FB]',
    ghost:     'text-[#477BDB] hover:bg-[#EBF1FB]',
    outline:   'border border-[#E8EDF4] text-[#0F1C31] hover:bg-[#F7F9FC] hover:border-[#C8D3E0]',
  };
  return (
    <button className={clsx(base, sizes[size], variants[variant], className)} {...props}>
      {children}
      {icon && <ArrowRight size={size === 'lg' ? 16 : 14} />}
    </button>
  );
}

// ─── Link Button ──────────────────────────────────────────────────────────────
interface LinkButtonProps {
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'navy-ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: boolean;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function LinkButton({ href, variant = 'primary', size = 'md', icon = false, external = false, className, children }: LinkButtonProps) {
  const base = 'inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200';
  const sizes = { sm: 'px-3.5 py-2 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3.5 text-[0.9375rem]' };
  const variants = {
    primary:    'bg-[#477BDB] hover:bg-[#3366C8] text-white hover:shadow-[0_6px_20px_rgba(71,123,219,0.35)] hover:-translate-y-0.5',
    secondary:  'border-[1.5px] border-[#477BDB] text-[#477BDB] hover:bg-[#EBF1FB]',
    ghost:      'text-[#477BDB] hover:bg-[#EBF1FB]',
    outline:    'border border-[#E8EDF4] text-[#0F1C31] hover:bg-[#F7F9FC] hover:border-[#C8D3E0]',
    'navy-ghost': 'border border-white/20 text-white/80 hover:bg-white/10 hover:text-white',
  };
  const cls = clsx(base, sizes[size], variants[variant], className);
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}{icon && <ArrowRight size={14} />}</a>;
  return <Link href={href} className={cls}>{children}{icon && <ArrowRight size={size === 'lg' ? 16 : 14} />}</Link>;
}

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'indigo';
  size?: 'sm' | 'md';
  className?: string;
}
export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  const variants = {
    default: 'bg-[#F1F5F9] text-[#3D4F63] border border-[#E8EDF4]',
    accent:  'bg-[#EBF1FB] text-[#3366C8] border border-[rgba(71,123,219,0.2)]',
    success: 'bg-[#E6F5F1] text-[#268C72] border border-[rgba(50,168,138,0.2)]',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    indigo:  'bg-[#EEF0FA] text-[#4E62B8] border border-[rgba(100,119,200,0.2)]',
  };
  const sizes = { sm: 'text-[11px] px-2.5 py-0.5', md: 'text-xs px-3 py-1' };
  return (
    <span className={clsx('inline-flex items-center rounded-full font-semibold', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
// dark  = dark navy background (#0F1C31 → #1A2B4A) — white text content inside
// subtle = soft grey (#F7F9FC) — dark text content inside
// default = pure white
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;     // dark navy
  subtle?: boolean;   // soft grey
  navy?: boolean;     // legacy alias for dark
  id?: string;
}
export function Section({ children, className, dark, subtle, navy, id }: SectionProps) {
  const isDark = dark || navy;
  return (
    <section
      id={id}
      style={isDark ? { background: 'linear-gradient(135deg, #0F1C31 0%, #1A2B4A 100%)' } : undefined}
      className={clsx(
        'py-16 lg:py-24',
        isDark  ? '' : subtle ? 'bg-[#F7F9FC]' : 'bg-white',
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  navy?: boolean;
  centered?: boolean;
  className?: string;
}
export function SectionHeader({ eyebrow, title, subtitle, dark, navy, centered, className }: SectionHeaderProps) {
  const isDark = dark || navy;
  return (
    <div className={clsx('mb-12 lg:mb-16', centered && 'text-center', className)}>
      {eyebrow && (
        <p className={clsx('text-xs font-bold tracking-[0.18em] uppercase mb-3', isDark ? 'text-[#32A88A]' : 'text-[#477BDB]')}>
          {eyebrow}
        </p>
      )}
      <h2
        className={clsx('leading-tight', isDark ? 'text-white' : 'text-[#0F1C31]')}
        style={{ fontFamily: SYNE_FONT, fontWeight: 800, fontSize: 'clamp(1.6rem, 2.5vw, 2.25rem)', letterSpacing: '-0.025em' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={clsx(
          'mt-4 text-base leading-relaxed max-w-2xl',
          centered && 'mx-auto',
          isDark ? 'text-white/50' : 'text-[#6B7E95]'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
// dark/navy = translucent white-on-dark card (for use on dark Section bg)
// default   = white card with border
interface CardProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  navy?: boolean;
  hover?: boolean;
  onClick?: () => void;
}
export function Card({ children, className, dark, navy, hover, onClick }: CardProps) {
  const isDark = dark || navy;
  return (
    <div onClick={onClick}
      className={clsx(
        'rounded-2xl border',
        isDark ? 'bg-white/[0.05] border-white/[0.08]' : 'bg-white border-[#DDE3EC]',
        hover && 'transition-all duration-200 hover:-translate-y-1 cursor-pointer',
        hover && (isDark
          ? 'hover:bg-white/[0.09] hover:border-white/[0.18] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
          : 'hover:shadow-[0_8px_32px_rgba(15,28,49,0.10)] hover:border-[#C8D2DF]'),
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
interface BreadcrumbProps {
  items: { label: string; href?: string }[];
  dark?: boolean;
}
export function Breadcrumb({ items, dark }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={11} className={dark ? 'text-white/25' : 'text-[#6B7E95]'} />}
          {item.href && i < items.length - 1 ? (
            <Link href={item.href}
              className={clsx('text-xs font-medium transition-colors', dark ? 'text-white/40 hover:text-white/70' : 'text-[#6B7E95] hover:text-[#0F1C31]')}>
              {item.label}
            </Link>
          ) : (
            <span className={clsx('text-xs font-medium', dark ? 'text-white/70' : 'text-[#0F1C31]')}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}
export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-[#0F1C31]">
          {label}{props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input id={inputId}
        aria-invalid={Boolean(error)}
        className={clsx(
          'w-full px-4 py-3 rounded-xl border text-sm transition-colors',
          'bg-white text-[#0F1C31] placeholder-[#6B7E95]',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-[#E8EDF4] focus:border-[#477BDB] focus:ring-2 focus:ring-[#477BDB]/10',
          'outline-none',
          className
        )}
        {...props}
      />
      {error  && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#6B7E95]">{hint}</p>}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}
export function Textarea({ label, error, hint, className, id, ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-[#0F1C31]">
          {label}{props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea id={inputId}
        className={clsx(
          'w-full px-4 py-3 rounded-xl border text-sm transition-colors resize-none',
          'bg-white text-[#0F1C31] placeholder-[#6B7E95]',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-[#E8EDF4] focus:border-[#477BDB] focus:ring-2 focus:ring-[#477BDB]/10',
          'outline-none',
          className
        )}
        rows={4}
        {...props}
      />
      {error  && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#6B7E95]">{hint}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}
export function Select({ label, error, options, className, id, ...props }: SelectProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-[#0F1C31]">
          {label}{props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select id={inputId}
        aria-invalid={Boolean(error)}
        className={clsx(
          'w-full px-4 py-3 rounded-xl border text-sm transition-colors',
          'bg-white text-[#0F1C31]',
          error
            ? 'border-red-400 focus:border-red-400'
            : 'border-[#E8EDF4] focus:border-[#477BDB] focus:ring-2 focus:ring-[#477BDB]/10',
          'outline-none appearance-none cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export { default as PhoneInput } from './ui/PhoneInput';
