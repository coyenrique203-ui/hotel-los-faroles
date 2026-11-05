import {notFound,redirect} from 'next/navigation';
import {requireAdmin} from '@/lib/auth/require-admin';
import {getSedeForAdmin} from '@/lib/admin/sedes';
import {EstablishmentEditor} from '@/components/admin/sedes/establishment-editor';

export default async function SedeDetailPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{status?:string;tab?:string}>}){
 const {id}=await params;const numericId=Number(id);
 if(!Number.isSafeInteger(numericId)||numericId<1)notFound();
 const admin=await requireAdmin();
 const sede=await getSedeForAdmin(admin,numericId);
 if(!sede)notFound();
 const {status,tab}=await searchParams;
 if(sede.tipo!=='hotel'){
  const base=sede.tipo==='restaurante'?'/admin/restaurante/':'/admin/eventos/';
  const query=new URLSearchParams();
  if(status)query.set('status',status);
  if(tab)query.set('tab',tab);
  redirect(base+numericId+(query.size?'?'+query.toString():''));
 }
 return <EstablishmentEditor id={numericId} kind="hotel" status={status} tab={tab}/>;
}
