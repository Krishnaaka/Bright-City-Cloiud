import React from 'react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar />
            <main className="flex-1 pl-20 lg:pl-[260px] transition-all duration-300">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="container mx-auto p-4 lg:p-8"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default MainLayout;
