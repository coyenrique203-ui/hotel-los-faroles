import {notFound} from 'next/navigation';
import {createHash} from 'node:crypto';
import {createPublicClient} from '@/lib/supabase/public';
import {GuestReviewForm} from '@/components/public/guest-review-form';

export const dynamic='force-dynamic';
export const metadata={robots:{index:false,follow:false}};

export default async function ReviewInvitationPage({params}:{params:Promise<{token:string}>}){
 const {token}=await params;
 if(!/^[a-f0-9]{64}$/.test(token))notFound();
 const hash=createHash('sha256').update(token).digest('hex');
 let invitation:{nombre_huesped:string;nombre_sede:string;estado:string}|null=null;
 try{
  const {data,error}=await createPublicClient().rpc('consultar_invitacion_resena',{p_hash:hash});
  if(!error)invitation=data?.[0]??null;
 }catch{/* Mostrar estado no disponible sin revelar detalles internos. */}
 return <main className="guest-review-page"><div className="guest-review-brand">✣ LOS FAROLES <small>HOTELES & EXPERIENCIAS</small></div>{invitation?.estado==='valido'?<GuestReviewForm token={token} nombre={invitation.nombre_huesped} hotel={invitation.nombre_sede}/>:<div className="guest-review-result"><h1>Enlace no disponible</h1><p>Este enlace pudo vencer, ya fue utilizado o todavía no está habilitado. Comunícate con el hotel si necesitas ayuda.</p></div>}</main>;
}
