/**
 * Skin — bộ style dùng chung cho "Recruitment 2" (bố cục như module 1, giao diện đổi theo ảnh).
 * Module 1 dùng CLASSIC (mặc định, không đổi). Module 2 bọc SkinProvider skin="v2".
 */
import React, { createContext, useContext } from 'react';

export type SkinName = 'classic' | 'v2';

export interface SkinTokens {
  name: SkinName;
  isV2: boolean;
  label: string;         // class cho nhãn field
  sectionTitle: string;  // class cho tiêu đề section
  sectionIcon: string;   // class màu icon section
}

const CLASSIC: SkinTokens = {
  name: 'classic',
  isV2: false,
  label: 'block text-[13px] font-medium text-slate-500 mb-1.5',
  sectionTitle: 'text-sm font-bold text-[#0fa57c] flex items-center gap-2',
  sectionIcon: 'text-[#0fa57c]',
};

const V2: SkinTokens = {
  name: 'v2',
  isV2: true,
  label: 'block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1',
  sectionTitle: 'text-sm font-black text-slate-700 uppercase tracking-wide flex items-center gap-2',
  sectionIcon: 'text-slate-500',
};

const SkinContext = createContext<SkinTokens>(CLASSIC);

export const SkinProvider: React.FC<{ skin?: SkinName; children: React.ReactNode }> = ({ skin = 'classic', children }) => (
  <SkinContext.Provider value={skin === 'v2' ? V2 : CLASSIC}>{children}</SkinContext.Provider>
);

export const useSkin = () => useContext(SkinContext);
