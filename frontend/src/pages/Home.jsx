import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Shield,
    Clock,
    ArrowRight,
    CheckCircle2,
    Users,
    Building2,
    Globe
} from 'lucide-react';

const Home = () => {
    const stats = [
        { label: 'Reported Issues', value: '1,284', icon: BarChart3, color: 'text-blue-600' },
        { label: 'Cities Covered', value: '12', icon: Globe, color: 'text-indigo-600' },
        { label: 'Resolved Cases', value: '942', icon: CheckCircle2, color: 'text-emerald-600' },
        { label: 'Active Admins', value: '45', icon: Shield, color: 'text-amber-600' },
    ];

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-32">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-30">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-indigo-200 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] bg-blue-100 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 mb-8">
                                Building a better city together
                            </span>
                            <h1 className="text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
                                Bright City: Making Civic
                                <span className="block text-indigo-600">Reporting Simple.</span>
                            </h1>
                            <p className="text-xl text-gray-500 leading-relaxed mb-10">
                                A production-grade platform for citizens to report public issues and for authorities to track, manage, and resolve them transparently.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link
                                    to="/register"
                                    className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 shadow-indigo-100 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
                                >
                                    Get Started
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center"
                                >
                                    Log in to your account
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gray-50/50 py-24 border-y border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white p-8 rounded-2xl premium-shadow border border-gray-100"
                            >
                                <div className={cn("p-3 rounded-xl inline-flex mb-6 bg-gray-50", stat.color)}>
                                    <stat.icon size={28} />
                                </div>
                                <p className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</p>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Enterprise-grade city management</h2>
                        <p className="text-lg text-gray-500">Everything you need to run a modern city infrastructure.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Citizen First</h3>
                            <p className="text-gray-500 leading-relaxed">Easy-to-use interface for reporting road damage, water leakage, and more in seconds.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                <Building2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Admin Control</h3>
                            <p className="text-gray-500 leading-relaxed">Full dashboard for authorities to prioritize, assign, and resolve city-wide issues efficiently.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                                <Clock size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Real-time Updates</h3>
                            <p className="text-gray-500 leading-relaxed">Notifications and status history tracking for full transparency between citizens and admins.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Helper function locally since we can't import easily during write_to_file without complexity
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default Home;
