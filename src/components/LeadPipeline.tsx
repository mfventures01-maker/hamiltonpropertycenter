import React from "react";
import { motion } from "framer-motion";
import {
    Clock,
    Phone,
    MessageSquare,
    CheckCircle2,
    XCircle,
    AlertCircle,
    MoreHorizontal
} from "lucide-react";

interface Lead {
    id: string;
    user_name: string;
    property_title: string;
    status: 'new' | 'contacted' | 'in_progress' | 'closed' | 'lost';
    priority: number;
}

interface LeadPipelineProps {
    leads: Lead[];
}

const statusConfig = {
    new: { label: "New", color: "bg-blue-500", icon: AlertCircle },
    contacted: { label: "Contacted", color: "bg-yellow-500", icon: Phone },
    in_progress: { label: "In Progress", color: "bg-purple-500", icon: Clock },
    closed: { label: "Closed", color: "bg-green-500", icon: CheckCircle2 },
    lost: { label: "Lost", color: "bg-red-500", icon: XCircle },
};

export const LeadPipeline: React.FC<LeadPipelineProps> = ({ leads }) => {
    const columns: (keyof typeof statusConfig)[] = ['new', 'contacted', 'in_progress', 'closed'];

    return (
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
            {columns.map((status) => {
                const columnLeads = leads.filter((l) => l.status === status);
                const config = statusConfig[status];

                return (
                    <div key={status} className="flex-shrink-0 w-80 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${config.color}`} />
                                <h4 className="text-white text-[10px] uppercase font-bold tracking-widest">{config.label}</h4>
                                <span className="bg-white/5 px-2 py-0.5 rounded-full text-[9px] text-white/40 font-bold">{columnLeads.length}</span>
                            </div>
                            <button className="text-white/20 hover:text-white transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="bg-white/5 rounded-[2rem] p-4 min-h-[400px] border border-white/5 space-y-4">
                            {columnLeads.map((lead) => (
                                <motion.div
                                    key={lead.id}
                                    layoutId={lead.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-white text-xs font-bold uppercase tracking-wider">{lead.user_name}</p>
                                            <p className="text-white/40 text-[9px] uppercase tracking-widest truncate max-w-[150px]">{lead.property_title}</p>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`w-1 h-3 rounded-full ${i < lead.priority ? 'bg-secondary' : 'bg-white/10'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-secondary transition-colors">
                                                <MessageSquare className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-secondary transition-colors">
                                                <Phone className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[8px] text-white/40 font-bold uppercase tracking-widest">
                                            Pipeline Lead
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {columnLeads.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-20">
                                    <config.icon className="w-8 h-8 text-white" />
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-white">No {config.label} leads</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
