import { useState } from 'react';
import { supabase } from '../lib/supabase';

// Maps backend structural codes to specific UI experiences
const TOAST_MAP: Record<string, string> = {
    UNAUTHORIZED: "You are not authorized.",
    RATE_LIMITED: "Too many actions! Please wait.",
    NOT_FOUND: "Record not found.",
    ALREADY_APPROVED: "This listing is already approved.",
    ALREADY_REJECTED: "This listing is already rejected.",
    ALREADY_VERIFIED: "This agent is already verified.",
    ALREADY_SUSPENDED: "User is already suspended.",
    COMMAND_FAILED: "An unexpected error blocked execution."
};

export const useAdminActions = () => {
    const [loading, setLoading] = useState<Record<string, boolean>>({});

    const executeCommand = async (rpcName: string, id: string, entityKey: string) => {
        // Return early if this specific entity is already loading (prevents double click spam instantly)
        if (loading[id]) return null;

        setLoading(prev => ({ ...prev, [id]: true }));
        try {
            const { data, error } = await supabase.rpc(rpcName, { [entityKey]: id });

            if (error) {
                alert("Fatal Error: " + error.message);
                return null;
            }

            const response = data as any;
            if (!response.success) {
                const uiMessage = TOAST_MAP[response.code] || response.message || "Failed.";
                alert(uiMessage);
                return response;
            }

            alert("Success: " + response.message);
            return response;
        } catch (err: any) {
            alert("Network Error: " + err.message);
            return null;
        } finally {
            setLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    return {
        loadingStates: loading,
        approveProperty: (id: string) => executeCommand('admin_approve_property', id, 'p_property_id'),
        rejectProperty: (id: string) => executeCommand('admin_reject_property', id, 'p_property_id'),
        verifyAgent: (id: string) => executeCommand('admin_verify_agent', id, 'p_agent_id'),
        suspendUser: (id: string) => executeCommand('admin_suspend_user', id, 'p_user_id'),
        deleteListing: (id: string) => executeCommand('admin_delete_listing', id, 'p_property_id')
    };
};
