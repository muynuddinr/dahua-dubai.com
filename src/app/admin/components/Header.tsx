'use client';

interface HeaderProps {
  user?: { email: string } | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-30 flex items-center justify-between px-6">
      {/* Left side - Title */}
      <div className="flex items-center gap-3 ml-12 lg:ml-0">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <h1 className="text-white font-semibold text-lg">Admin Dashboard</h1>
      </div>

      {/* Right side - User info & Logout */}
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm hidden sm:block">Logged in as</span>
            <span className="text-pink-400 text-sm font-medium">{user.email}</span>
          </div>
        )}
        <button
          onClick={onLogout}
          className="px-4 py-2 text-pink-400 border border-pink-500/50 rounded-lg hover:bg-pink-500/10 transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
