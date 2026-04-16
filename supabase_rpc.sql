-- HPC Transactional Admin Command Engine RPCs

-- Utility function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. admin_approve_property
CREATE OR REPLACE FUNCTION admin_approve_property(p_property_id uuid)
RETURNS json AS $$
DECLARE
  v_admin_id uuid := auth.uid();
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  UPDATE public.properties SET status = 'active' WHERE id = p_property_id;
  
  INSERT INTO public.audit_log_entries (admin_id, action, entity, entity_id, metadata)
  VALUES (v_admin_id, 'APPROVE_PROPERTY', 'properties', p_property_id, '{"status": "active"}'::jsonb);

  RETURN json_build_object('success', true, 'message', 'Property approved successfully');
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. admin_reject_property
CREATE OR REPLACE FUNCTION admin_reject_property(p_property_id uuid)
RETURNS json AS $$
DECLARE
  v_admin_id uuid := auth.uid();
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  UPDATE public.properties SET status = 'rejected' WHERE id = p_property_id;
  
  INSERT INTO public.audit_log_entries (admin_id, action, entity, entity_id, metadata)
  VALUES (v_admin_id, 'REJECT_PROPERTY', 'properties', p_property_id, '{"status": "rejected"}'::jsonb);

  RETURN json_build_object('success', true, 'message', 'Property rejected successfully');
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. admin_verify_agent
CREATE OR REPLACE FUNCTION admin_verify_agent(p_agent_id uuid)
RETURNS json AS $$
DECLARE
  v_admin_id uuid := auth.uid();
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  UPDATE public.agents SET verified = true WHERE id = p_agent_id;
  UPDATE public.agent_verification_requests SET status = 'approved' WHERE agent_id = p_agent_id;
  
  INSERT INTO public.audit_log_entries (admin_id, action, entity, entity_id, metadata)
  VALUES (v_admin_id, 'VERIFY_AGENT', 'agents', p_agent_id, '{"verified": true}'::jsonb);

  RETURN json_build_object('success', true, 'message', 'Agent verified successfully');
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. admin_suspend_user
CREATE OR REPLACE FUNCTION admin_suspend_user(p_user_id uuid)
RETURNS json AS $$
DECLARE
  v_admin_id uuid := auth.uid();
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Assuming a status or disabled column in profiles. Creating generic metadata update if missing.
  -- You could also disable auth directly using Supabase Admin API if running via Edge Function.
  UPDATE public.profiles SET role = 'suspended' WHERE id = p_user_id;
  
  INSERT INTO public.audit_log_entries (admin_id, action, entity, entity_id, metadata)
  VALUES (v_admin_id, 'SUSPEND_USER', 'profiles', p_user_id, '{"status": "suspended"}'::jsonb);

  RETURN json_build_object('success', true, 'message', 'User suspended successfully');
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. admin_delete_listing
CREATE OR REPLACE FUNCTION admin_delete_listing(p_property_id uuid)
RETURNS json AS $$
DECLARE
  v_admin_id uuid := auth.uid();
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  DELETE FROM public.properties WHERE id = p_property_id;
  
  INSERT INTO public.audit_log_entries (admin_id, action, entity, entity_id, metadata)
  VALUES (v_admin_id, 'DELETE_LISTING', 'properties', p_property_id, '{"deleted": true}'::jsonb);

  RETURN json_build_object('success', true, 'message', 'Listing deleted successfully');
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
