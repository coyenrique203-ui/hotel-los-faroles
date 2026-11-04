'use client';

import { useActionState } from 'react';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { loginAction } from '@/app/admin/login/actions';

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: '' });
  return <form className="login-form" action={action}>
    <label htmlFor="login-email">CORREO ELECTRÓNICO</label>
    <div className="login-input"><Mail size={18}/><input id="login-email" name="email" type="email" autoComplete="username" placeholder="tu@correo.com" required/></div>
    <label htmlFor="login-password">CONTRASEÑA</label>
    <div className="login-input"><LockKeyhole size={18}/><input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="Tu contraseña" required/></div>
    {state.error && <p className="login-error" role="alert">{state.error}</p>}
    <button className="login-submit" type="submit" disabled={pending}>{pending?'COMPROBANDO ACCESO...':'INGRESAR AL PANEL'} <ArrowRight size={18}/></button>
    <p className="login-footnote">Acceso exclusivo para personal autorizado de Hotel Los Faroles.</p>
  </form>;
}
