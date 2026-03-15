import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const StatCard = ({ label, value, icon: Icon, trend, color, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 tracking-tight">{value}</h3>
                    {trend && (
                        <p className={cn(
                            "text-xs font-semibold mt-2 flex items-center gap-1",
                            trend.positive ? "text-emerald-600" : "text-amber-600"
                        )}>
                            {trend.positive ? '+' : '-'}{trend.value}%
                            <span className="text-gray-400 font-normal">from last month</span>
                        </p>
                    )}
                </div>
                <div className={cn(
                    "p-3 rounded-xl transition-transform group-hover:scale-110",
                    color || "bg-indigo-50 text-indigo-600"
                )}>
                    <Icon size={24} />
                </div>
            </div>

            {/* Subtle Background Accent */}
            <div className={cn(
                "absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-[0.03] pointer-events-none",
                color?.includes('indigo') ? 'bg-indigo-600' : 'bg-current'
            )} />
        </motion.div>
    );
};

export default StatCard;
