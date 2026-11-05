import React, { useEffect, useRef, useState } from 'react';
import { LogOut, Menu, User } from 'lucide-react';
import type { LoginUser } from './LoginPage';
import { NotificationBell, WishHost } from '../marcom/WishUi';

interface HeaderProps {
  onToggleSidebar?: () => void;
  user?: LoginUser;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, user, onLogout }) => {
  const [menu, setMenu] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setMenu(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menu]);
  const name = user?.name || 'admin';
  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
        >
          <Menu size={18} />
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <NotificationBell />
        
        <div className="relative pl-4 border-l border-gray-200" ref={box}>
          <button type="button" onClick={() => setMenu((m) => !m)} className="flex items-center space-x-2 cursor-pointer" data-testid="user-menu">
            <span className="text-sm font-medium text-gray-700">{name}</span>
            <div className="w-8 h-8 rounded-md bg-[#1f5fa8] text-white text-[12px] font-bold flex items-center justify-center" aria-hidden="true">
              {name.split(/\s+/).filter(Boolean).slice(-2).map((w) => w[0]).join('').toUpperCase() || <User size={18} />}
            </div>
          </button>
          {menu && (
            <div className="absolute right-0 top-10 w-64 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b border-gray-100">
                <div className="text-sm font-semibold text-gray-800">{name}</div>
                {user && <div className="text-xs text-gray-500">{user.email}{user.method === 'microsoft' ? ' · Microsoft 365' : ''}</div>}
              </div>
              <button type="button" onClick={() => (setMenu(false), onLogout?.())} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 cursor-pointer" data-testid="logout">
                <LogOut size={15} /> Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Popup thông báo lời chúc sinh nhật + thiệp chúc (mở khi người nhận bấm thông báo) */}
      <WishHost />
    </header>
  );
};
