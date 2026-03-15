import React from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    HelpCircle,
    ChevronRight,
    Monitor,
    Lock,
    Mail
} from 'lucide-react';
import { cn } from '../lib/utils';

const SettingsItem = ({ icon: Icon, title, description, color, hasChevron = true }) => (
    <motion.div
        whileHover={{ x: 5 }}
        className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-gray-100"
    >
        <div className="flex items-center gap-4">
            <div className={cn("p-2.5 rounded-xl", color)}>
                <Icon size={20} />
            </div>
            <div>
                <h4 className="text-sm font-bold text-gray-900">{title}</h4>
                <p className="text-xs text-gray-500 font-medium">{description}</p>
            </div>
        </div>
        {hasChevron && <ChevronRight size={16} className="text-gray-300" />}
    </motion.div>
);

const Settings = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <header>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">System Configuration</h1>
                <p className="text-gray-500 font-medium mt-1">Manage your identity and platform preferences.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <aside className="space-y-1">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-4 mb-2">Categories</p>
                    {['Account', 'Security', 'Interface', 'Network'].map((item, i) => (
                        <button key={item} className={cn(
                            "w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-all",
                            i === 0 ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                        )}>
                            {item}
                        </button>
                    ))}
                </aside>

                <main className="md:col-span-2 space-y-8">
                    <section className="bg-white rounded-3xl border border-gray-100 p-2 shadow-sm">
                        <div className="p-4 border-b border-gray-50">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Personal Identity</h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            <SettingsItem
                                icon={User}
                                title="Profile Information"
                                description="Update your display name and public image."
                                color="bg-blue-50 text-blue-600"
                            />
                            <SettingsItem
                                icon={Mail}
                                title="Email Address"
                                description="admin@brightcity.com"
                                color="bg-emerald-50 text-emerald-600"
                                hasChevron={false}
                            />
                        </div>
                    </section>

                    <section className="bg-white rounded-3xl border border-gray-100 p-2 shadow-sm">
                        <div className="p-4 border-b border-gray-50">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Privacy & Logic</h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            <SettingsItem
                                icon={Lock}
                                title="Authentication"
                                description="Manage your password and 2FA settings."
                                color="bg-amber-50 text-amber-600"
                            />
                            <SettingsItem
                                icon={Shield}
                                title="Data Usage"
                                description="Review how we handle civic reporting data."
                                color="bg-indigo-50 text-indigo-600"
                            />
                        </div>
                    </section>

                    <section className="bg-white rounded-3xl border border-gray-100 p-2 shadow-sm">
                        <div className="p-4 border-b border-gray-50">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Visual Experience</h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                            <SettingsItem
                                icon={Monitor}
                                title="System Theme"
                                description="Control light, dark, and auto modes."
                                color="bg-slate-50 text-slate-600"
                            />
                            <SettingsItem
                                icon={Bell}
                                title="Notifications"
                                description="Channel-specific alert preferences."
                                color="bg-rose-50 text-rose-600"
                            />
                        </div>
                    </section>

                    <div className="pt-6 flex justify-end">
                        <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100">
                            Save System Changes
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;
