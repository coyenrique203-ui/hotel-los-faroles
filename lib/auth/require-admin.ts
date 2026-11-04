import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type AdminProfile = {
  id: string;
  nombre: string;
  rol: 'general' | 'sede';
  activo: boolean;
};

export async function getAdminProfile(): Promise<AdminProfile | null> {
  const started=performance.now();
  let authenticationMs=0;
  let profileMs=0;
  try {
  const supabase = await createClient();
  // No confiar en getSession() para tomar decisiones de autorización.
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  authenticationMs=performance.now()-started;
  if (authError || !user) return null;

  const profileStarted=performance.now();
  const { data, error } = await supabase
    .from('perfiles_admin')
    .select('id, nombre, rol, activo')
    .eq('id', user.id)
    .maybeSingle();
  profileMs=performance.now()-profileStarted;

  if (error || !data?.activo || !['general', 'sede'].includes(data.rol)) return null;
  return data as AdminProfile;
  } finally {
    if(process.env.ADMIN_PERF_TIMINGS==='1'){
      console.info(`[rendimiento-admin] autenticacion=${Math.round(authenticationMs)}ms perfil=${Math.round(profileMs)}ms total=${Math.round(performance.now()-started)}ms`);
    }
  }
}

export async function requireAdmin() {
  const admin = await getAdminProfile();
  if (!admin) redirect('/admin/login');
  return admin;
}
