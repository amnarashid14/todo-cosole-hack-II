'use client';

import React, { useState } from 'react';
import { TaskNavbarProps } from '../../types/tasks';
import Button from '../../components/ui/Button';

const TaskNavbar: React.FC<TaskNavbarProps> = ({ userName, userEmail, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Extract first name from full name
  const firstName = userName.split(' ')[0];

  return (
    <nav className="bg-white border-b border-gray-200 p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand section - hidden on mobile */}
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-black">Task Dashboard</h1>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none p-2"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* User info and logout - visible on all screens */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <p className="text-sm font-medium text-black">Hey {firstName}</p>
            <p className="text-xs text-gray-600">{userEmail}</p>
          </div>

          <Button
            variant="outline"
            onClick={onLogout}
            className="bg-white border-gray-300 text-black hover:bg-gray-50 transition-colors duration-200"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 pb-4 bg-white rounded-lg shadow-md border border-gray-200 pt-4">
          <div className="px-4">
            <p className="text-sm font-medium text-black">Hey {firstName}</p>
            <p className="text-xs text-gray-600">{userEmail}</p>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={onLogout}
                className="w-full text-center bg-white border-gray-300 text-black hover:bg-gray-50 transition-colors duration-200"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TaskNavbar;