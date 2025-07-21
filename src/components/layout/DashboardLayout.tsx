import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Settings, LogOut, Bell, Search } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const sidebarItems = [
        { icon: Building2, label: 'Facilities', active: true },
        { icon: Settings, label: 'Settings', active: false },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Sidebar */}
            <motion.div
                className="fixed left-0 top-0 h-full w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50 z-40"
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo */}
                <div className="p-6 border-b border-slate-700/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-mint-400 to-blue-400 rounded-xl flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2L8 6v4l4-2 4 2V6l-4-4zM8 12l4 2 4-2v8l-4-4-4 4v-8z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">CourtSync</h2>
                            <p className="text-xs text-slate-400">Owner Dashboard</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {sidebarItems.map((item, index) => (
                        <motion.button
                            key={item.label}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${item.active
                                ? 'bg-gradient-to-r from-mint-500/20 to-blue-500/20 text-mint-400 border border-mint-500/30'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                }`}
                            whileHover={{ x: 4 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </motion.button>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700/50">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-mint-400 to-blue-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">JD</span>
                        </div>
                        <div>
                            <p className="text-white font-medium text-sm">John Doe</p>
                            <p className="text-slate-400 text-xs">Facility Owner</p>
                        </div>
                    </div>
                    <button className="w-full flex items-center space-x-2 text-slate-400 hover:text-red-400 transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign Out</span>
                    </button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="ml-64">
                {/* Top Bar */}
                <motion.div
                    className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 p-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between">
                        {/* <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search facilities, staff..."
                                    className="pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:border-mint-500 focus:outline-none transition-colors"
                                />
                            </div>
                        </div> */}
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Page Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};