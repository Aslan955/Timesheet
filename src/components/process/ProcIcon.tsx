import React from 'react';
import { Workflow } from 'lucide-react';
import { PROC_COLORS, PROC_ICONS, type Process } from './processStore';

/** Biểu tượng quy trình (ô màu + icon). */
export const ProcIcon: React.FC<{ p: Pick<Process, 'icon' | 'color'>; size?: number }> = ({ p, size = 30 }) => {
  const Icon = PROC_ICONS[p.icon] || Workflow;
  const c = PROC_COLORS[p.color] || PROC_COLORS.blue;
  return (
    <span className={`inline-flex items-center justify-center rounded-[6px] shrink-0 ${c.bg} ${c.text}`} style={{ width: size, height: size }}>
      <Icon size={Math.round(size * 0.55)} />
    </span>
  );
};
