import {EstablishmentEditor} from '@/components/admin/sedes/establishment-editor';
export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{status?:string;tab?:string}>}){
 const {id}=await params;
 const {status,tab}=await searchParams;
 return <EstablishmentEditor id={Number(id)} kind="eventos" status={status} tab={tab}/>;
}
