import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    AlertCircle,
    CheckCircle2,
    Clock,
    Tag,
    ChevronRight,
    X,
    Droplets,
    Zap,
    Trash2,
    Construction,
    ArrowUpRight
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { cn } from '../lib/utils';

const CategoryIcon = ({ category, size = 18, className }) => {
    switch (category.toLowerCase()) {
        case 'road': return <Construction size={size} className={cn("text-slate-500", className)} />;
        case 'water': return <Droplets size={size} className={cn("text-blue-500", className)} />;
        case 'garbage': return <Trash2 size={size} className={cn("text-emerald-500", className)} />;
        case 'electricity': return <Zap size={size} className={cn("text-amber-500", className)} />;
        default: return <Tag size={size} className={cn("text-gray-500", className)} />;
    }
};

const CitizenDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitOpen, setIsSubmitOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('road');
    const [searchQuery, setSearchQuery] = useState('');

    const location = useLocation();

    useEffect(() => {
        fetchComplaints();

        // Handle ?new=true from Sidebar
        if (location.search.includes('new=true')) {
            setIsSubmitOpen(true);
        }
    }, [location.search]);

    const fetchComplaints = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/complaints', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter complaints to only show the user's own if needed, 
            // but the backend /complaints currently returns all. 
            // Assuming for a "Civic" app users might see all public reports or just their own.
            // Let's stick to what the backend provides but label it clearly.
            setComplaints(response.data);
        } catch (error) {
            console.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/complaints', {
                title,
                description,
                category
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchComplaints();
            setIsSubmitOpen(false);
            setTitle('');
            setDescription('');
        } catch (error) {
            alert('Failed to submit complaint');
        }
    };

    const stats = [
        {
            label: 'Active Reports',
            value: complaints.filter(c => c.status !== 'resolved').length,
            icon: Tag,
            color: 'bg-indigo-50 text-indigo-600'
        },
        {
            label: 'Pending',
            value: complaints.filter(c => c.status === 'pending').length,
            icon: Clock,
            color: 'bg-amber-50 text-amber-600'
        },
        {
            label: 'Successfully Resolved',
            value: complaints.filter(c => c.status === 'resolved').length,
            icon: CheckCircle2,
            color: 'bg-emerald-50 text-emerald-600'
        },
    ];

    const filteredComplaints = complaints.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Citizen Portal</h1>
                    <p className="text-gray-500 mt-1">Track civic improvements and report new issues in your area.</p>
                </div>
                <button
                    onClick={() => setIsSubmitOpen(true)}
                    className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 transform"
                >
                    <Plus size={20} />
                    Report Issue
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={stat.label} {...stat} delay={i * 0.1} />
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/20 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or category..."
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table/List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                        </div>
                        <p className="text-gray-500 font-medium animate-pulse">Synchronizing records...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                    <th className="px-6 py-4">Issue Description</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Progress</th>
                                    <th className="px-6 py-4">Reported On</th>
                                    <th className="px-6 py-4 text-right pr-10">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <AnimatePresence>
                                    {filteredComplaints.map((complaint, i) => (
                                        <motion.tr
                                            key={complaint.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-indigo-50/30 transition-all group cursor-pointer"
                                        >
                                            <td className="px-6 py-4 max-w-xs">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                        {complaint.title}
                                                    </span>
                                                    <span className="text-xs text-gray-500 mt-1 line-clamp-1 italic">
                                                        "{complaint.description}"
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 w-fit px-2 py-1 rounded-md border border-gray-100 uppercase tracking-tight">
                                                    <CategoryIcon category={complaint.category} size={14} />
                                                    {complaint.category}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest shadow-sm",
                                                    getStatusStyles(complaint.status)
                                                )}>
                                                    {complaint.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                                                {new Date(complaint.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-right pr-10">
                                                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                                                    <ArrowUpRight size={18} />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {filteredComplaints.length === 0 && !loading && (
                            <div className="py-24 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300 border border-gray-100">
                                    <AlertCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">No reports found</h3>
                                <p className="text-gray-500 max-w-xs mx-auto mt-2 text-sm leading-relaxed">
                                    {searchQuery ? `We couldn't find any results matching "${searchQuery}".` : "The city is looking good! No issues have been reported yet."}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal - Redesigned for better spacing and focus */}
            <AnimatePresence>
                {isSubmitOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSubmitOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20"
                        >
                            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 px-8 py-10 text-white relative">
                                <div className="absolute top-6 right-6">
                                    <button onClick={() => setIsSubmitOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                        <X size={24} className="text-white/80" />
                                    </button>
                                </div>
                                <h3 className="text-3xl font-black tracking-tight mb-2">New Civic Report</h3>
                                <p className="text-indigo-100 text-lg opacity-80">Help us keep the city bright and functional.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-10 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Issue Topic</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Pothole, Broken light, etc."
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category</label>
                                        <div className="relative">
                                            <select
                                                className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold appearance-none"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                            >
                                                <option value="road">Road Reconstruction</option>
                                                <option value="water">Water Utility</option>
                                                <option value="garbage">Waste Management</option>
                                                <option value="electricity">Electrical Grid</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                <ChevronRight size={18} className="rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Detailed Context</label>
                                    <textarea
                                        required
                                        placeholder="Please provide specific location and severity details..."
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all min-h-[160px] font-medium resize-none"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="flex items-center justify-between pt-4 gap-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsSubmitOpen(false)}
                                        className="px-8 py-4 text-sm font-bold text-gray-400 hover:text-gray-900 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-indigo-600 text-white text-md font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        Submit Official Report
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CitizenDashboard;
