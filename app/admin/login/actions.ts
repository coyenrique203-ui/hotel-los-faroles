'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type LoginState = { error: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Escribe tu correo y contraseña.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'No se pudo iniciar sesión. Revisa tus credenciales.' };

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile, error: profileError } = await supabase
    .from('perfiles_admin')
    .select('activo, rol')
    .eq('id', user?.id ?? '')
    .maybeSingle();

  if (profileError || !profile?.activo || !['general', 'sede'].includes(profile.rol)) {
    await supabase.auth.signOut();
    return { error: 'Esta cuenta no tiene acceso administrativo activo.' };
  }

  redirect('/admin');
}
