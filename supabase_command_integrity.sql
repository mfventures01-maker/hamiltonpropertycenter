-- HPC COMMAND INTEGRITY + ABUSE PROTECTION LAYER

-- Lock standard security paths
SET search_path = public;

-- Utility: Rate Limit Check
CREATE OR REPLACE FUNCTION public.check_admin_rate_limit(p_admin_id uuid)
RETURNS boolean AS $$
DECLARE
  v_count int;
BEGIN
  SELECT count(*) INTO v_count
  FROM public.audit_log_entries
  WHERE admin_id = p_admin_id
  AND created_at > (now() - interval '1 minute');

  RETURN v_count < 15;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 1. admin_approve_property
CREATE OR REPLACE FUNCTION public.admin_approve_property(p_property_id uuid)
RETURNS json AS $$
DECLARE
  v_admin_id uuid := auth.uid();
  v_affected_rows int;
  v_current_status text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') THEN
    RETURN json_build_object('success', false, 'code', 'UNAUTHORIZED', 'message', 'Admin privileges required');
  END IF;

  IF NOT public.check_admin_rate_limit(v_admin_id) THEN
    RETURN json_build_object('success', false, 'code', 'RATE_LIMITED', 'message', 'Too many requests. Please wait.');
  END IF;

  SELECT status INTO v_current_status FROM public.properties WHERE id = p_property_id FOR UPDATE;

  IF v_current_status IS NULL THEN
    RETURN json_build_object('success', false, 'code', 'NOT_FOUND', 'message', 'Property not found');
  END IF;

  IF v_current_status = 'active' THEN
    RETURN json_build_object('success', false, 'code', 'ALREADY_APPROVED', 'message', 'Property is already active');
  END IF;

  UPDATE public.properties SET status = 'active' WHERE id = p_property_id AND status != 'active';
  GET DIAGNOSTICS v_affected_rows = ROW_COUNT;

  IF v_affected_rows > 0 THEN
    INSERT INTO public.audit_log_entries (admin_id, action, entity, entity_id, metadata)
    VALUES (v_admin_id, 'APPROVE_PROPERTY', 'properties', p_property_id, jsonb_build_object('previous_state', v_current_status, 'new_state', 'active'));
    RETURN json_build_object('success', true, 'code', 'PROPERTY_APPROVED', 'message', 'Property approved successfully', 'entity_id', p_property_id);
  END IF;

  RETURN json_build_object('success', false, 'code', 'COMMAND_FAILED', 'message', 'Command execution failed');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. admin_reject_property
CREATE OR REPLACE FUNCTION public.admin_reject_property(p_property_id uuid)
RETURNS json AS $$
DECLARE
  v_admin_id uuid := auth.uid();
  v_current_status text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') THEN RETURN json_build_object('success', false, 'code', 'UNAUTHORIZED'); END IF;
  IF NOT public.check_admin_rate_limit(v_admin_id) THEN RETURN json_build_object('success', false, 'code', 'RATE_LIMITED'); END IF;

  SELECT status INTO v_current_status FROM public.properties WHERE id = p_property_id FOR UPDATE;
  IF v_current_status IS NULL THEN RETURN json_build_object('success', false, 'code', 'NOT_FOUND'); END IF;
  IF v_current_status = 'rejected' THEN RETURN json_build_object('success', false, 'code', 'ALREADY_REJECTED'); END IF;

  UPDATE public.properties SET status = 'rejected' WHERE id = p_property_id AND status != 'rejected';
  
  INSERT INTO public.audit_log_entries (admin_id, action, entity, entity_id, metadata)
  VALUES (v_admin_id, 'REJECT_PROPERTY', 'properties', p_property_id, jsonb_build_object('previous_state', v_current_status, 'new_state', 'rejected'));

  RETURN json_build_object('success', true, 'code', 'PROPERTY_REJECTED', 'message', 'Property rejected successfully', 'entity_id', p_property_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3. admin_verify_agent
CREATE OR REPLACE FUNCTION public.admin_verify_agent(p_agent_id uuid)
RETURNS json AS $$
DECLARE
  v_admin_id uuid := auth.uid();
  v_verified boolean;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') THEN RETURN json_build_object('success', false, 'code', 'UNAUTHORIZED'); END IF;
  IF NOT public.check_admin_rate_limit(v_admin_id) THEN RETURN json_build_object('success', false, 'code', 'RATE_LIMITED'); END IF;

  SELECT verified INTO v_verified FROM public.agents WHERE id = p_agent_id FOR UPDATE;
  IF v_verified IS NULL THEN RETURN json_build_object('success', false, 'code', 'NOT_FOUND'); END IF;
  IF v_verified = true THEN RETURN json_build_object('success', false, 'code', 'ALREADY_VERIFIED'); END IF;

  UPDATE public.agents SET verified = true WHERE id = p_agent_id;
  UPDATE public.agent_verification_requests SET status = 'approved' WHERE agent_id = p_agent_id;
  
  INSERT INTO public.audit_log_entries (admin_id, action, entity, entity_id, metadata)
  VALUES (v_admin_id, 'VERIFY_AGENT', 'agents', p_agent_id, jsonb_build_object('previous_state', v_verified, 'new_state', true));

  RETURN json_build_object('success', true, 'code', 'AGENT_VERIFIED', 'message', 'Agent verified securely', 'entity_id', p_agent_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. admin_suspend_user
CREATE OR REPLACE FUNCTION public.admin_suspend_user(p_user_id uuid)
RETURNS json AS $$
DECLARE
  v_admin_id uuid := auth.uid();
  v_current_role text;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') THEN RETURN json_build_object('success', false, 'code', 'UNAUTHORIZED'); END IF;
  IF NOT public.check_admin_rate_limit(v_admin_id) THEN RETURN json_build_object('success', false, 'code', 'RATE_LIMITED'); END IF;

  SELECT role INTO v_current_role FROM public.profiles WHERE id = p_user_id FOR UPDATE;
  IF v_current_role IS NULL THEN RETURN json_build_object('success', false, 'code', 'NOT_FOUND'); END IF;
  IF v_current_role = 'suspended' THEN RETURN json_build_object('success', false, 'code', 'ALREADY_SUSPENDED'); END IF;

  UPDATE public.profiles SET role = 'suspended' WHERE id = p_user_id;

  INSERT INTO public.audit_log_entries (admin_id, action, entity, entity_id, metadata)
  VALUES (v_admin_id, 'SUSPEND_USER', 'profiles', p_user_id, jsonb_build_object('previous_state', v_current_role, 'new_state', 'suspended'));

  RETURN json_build_object('success', true, 'code', 'USER_SUSPENDED', 'message', 'User account suspended', 'entity_id', p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. admin_delete_listing
CREATE OR REPLACE FUNCTION public.admin_delete_listing(p_property_id uuid)
RETURNS json AS $$
DECLARE
  v_admin_id uuid := auth.uid();
  v_exists boolean;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_admin_id AND role = 'admin') THEN RETURN json_build_object('success', false, 'code', 'UNAUTHORIZED'); END IF;
  IF NOT public.check_admin_rate_limit(v_admin_id) THEN RETURN json_build_object('success', false, 'code', 'RATE_LIMITED'); END IF;

  SELECT EXISTS(SELECT 1 FROM public.properties WHERE id = p_property_id) INTO v_exists;
  IF NOT v_exists THEN RETURN json_build_object('success', false, 'code', 'ALREADY_DELETED', 'message', 'File does not exist or already deleted'); END IF;

  DELETE FROM public.properties WHERE id = p_property_id;
  
  INSERT INTO public.audit_log_entries (admin_id, action, entity, entity_id, metadata)
  VALUES (v_admin_id, 'DELETE_LISTING', 'properties', p_property_id, jsonb_build_object('previous_state', 'exists', 'new_state', 'deleted'));

  RETURN json_build_object('success', true, 'code', 'LISTING_DELETED', 'message', 'Listing removed permanently', 'entity_id', p_property_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
