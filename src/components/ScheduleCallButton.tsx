'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { ScheduleCallModal } from './ScheduleCallModal';

interface ScheduleCallButtonProps {
  className?: string;
  variant?: 'outline' | 'ghost' | 'primary';
  label?: string;
  showIcon?: boolean;
}

export default function ScheduleCallButton({
  className,
  variant = 'outline',
  label = 'Schedule a Call',
  showIcon = true,
}: ScheduleCallButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const defaultClasses =
    variant === 'primary'
      ? 'inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-[#477BDB] to-[#6477C8] hover:shadow-lg hover:shadow-blue-500/25 transition-all'
      : 'inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm text-white/90 border border-white/20 hover:border-white/40 hover:bg-white/[0.08] transition-all';

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={className || defaultClasses}
      >
        {showIcon && <Calendar size={15} className="text-[#477BDB]" />}
        <span>{label}</span>
      </button>

      <ScheduleCallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
