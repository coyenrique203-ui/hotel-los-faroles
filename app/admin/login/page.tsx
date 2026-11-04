import Link from 'next/link';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/login-form';
import { getAdminProfile } from '@/lib/auth/require-admin';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Acceso administrativo | Hotel Los Faroles', robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (await getAdminProfile()) redirect('/admin');
  return <main className="login-page"><div className="login-art"><div className="login-art-overlay"/><Link href="/" className="login-brand"><span>✣</span> LOS FAROLES</Link><div className="login-art-copy"><span>HOTELS & EXPERIENCES</span><h1>La hospitalidad<br/><em>está en los detalles.</em></h1><p>El espacio desde donde cuidamos cada experiencia.</p></div><small>Fotografía ilustrativa</small></div><div className="login-panel"><Link href="/" className="login-back">← VOLVER AL SITIO</Link><div className="login-card"><span className="eyebrow">PANEL ADMINISTRATIVO</span><h2>Bienvenido<br/><em>de nuevo.</em></h2><p>Ingresa con las credenciales asignadas a tu cuenta administrativa.</p><LoginForm/></div><p className="login-copyright">© HOTEL LOS FAROLES · ACCESO PRIVADO</p></div></main>;
}
