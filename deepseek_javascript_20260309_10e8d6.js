import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import { FiHome, FiCheckSquare, FiFileText, FiCalendar, FiLogOut, FiCpu } from 'react-icons/fi';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const navigation = [
    { name: 'Resumen', href: '/', icon: FiHome },
    { name: 'Tareas', href: '/tasks', icon: FiCheckSquare },
    { name: 'Notas', href: '/notes', icon: FiFileText },
    { name: 'Calendario', href: '/calendar', icon: FiCalendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">FocusAlbayero</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === item.href
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="mr-3" size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <ThemeToggle />
          <button
            onClick={logout}
            className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <FiLogOut size={18} className="mr-2" />
            Salir
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {children}
      </main>

      {/* AI Assistant Button */}
      <button
        onClick={() => setShowAIAssistant(true)}
        className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-110"
      >
        <FiCpu size={24} />
      </button>

      {/* AI Assistant Panel */}
      {showAIAssistant && (
        <div className="fixed bottom-24 right-6 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <AIAssistant onClose={() => setShowAIAssistant(false)} />
        </div>
      )}
    </div>
  );
}

// Importamos el componente AIAssistant (lo definiremos después)
import AIAssistant from './AIAssistant';