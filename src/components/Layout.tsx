import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Таймер', icon: '⏱️' },
    { path: '/stats', label: 'Статистика', icon: '📊' },
    { path: '/history', label: 'История', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
            <span className="text-2xl">🍅</span>
            <span className="hidden sm:inline">Pomodoro</span>
          </Link>

          <nav className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  location.pathname === item.path
                    ? 'bg-white text-gray-800 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-gray-400 border-t border-gray-100">
        Метод Pomodoro — работай фокусированно, отдыхай правильно
      </footer>
    </div>
  );
}
