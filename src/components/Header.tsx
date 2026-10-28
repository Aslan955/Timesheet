import React from 'react';
import { Menu, User } from 'lucide-react';
import { NotificationBell, WishHost } from '../marcom/WishUi';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
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
        
        <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
          <span className="text-sm font-medium text-gray-700">admin</span>
          <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
            <User size={20} className="text-gray-400" />
            {/* If we had an image, we'd put it here like in the screenshot */}
            <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
      {/* Popup thông báo lời chúc sinh nhật + thiệp chúc (mở khi người nhận bấm thông báo) */}
      <WishHost />
    </header>
  );
};
