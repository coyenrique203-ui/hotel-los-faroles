import 'server-only';
import {createClient} from '@/lib/supabase/server';
import type {AdminProfile} from '@/lib/auth/require-admin';
import {getSedesForAdmin,type Sede} from '@/lib/admin/sedes';

export type GalleryImage={
 id:number;sede_id:number|null;titulo:string|null;texto_alternativo:string|null;
 nombre_archivo:string;clave_r2:string;url_publica:string;
 destacada:boolean;publicada:boolean;orden:number;
};

export async function getGaleria(admin:AdminProfile,sedeId:number,sedesCargadas?:Sede[]){
 const started=performance.now();
 const sedes=sedesCargadas??await getSedesForAdmin(admin);
 if(!sedes.some(s=>s.id===sedeId))return {sedes,imagenes:[] as GalleryImage[],allowed:false};
 const db=await createClient();
 const {data,error}=await db.from('imagenes')
  .select('id,sede_id,titulo,texto_alternativo,nombre_archivo,clave_r2,url_publica,destacada,publicada,orden')
  .eq('sede_id',sedeId).order('orden',{ascending:true}).order('id',{ascending:false});
 if(process.env.ADMIN_PERF_TIMINGS==='1'){
  console.info(`[rendimiento-admin] galeria sede=${sedeId} total=${Math.round(performance.now()-started)}ms`);
 }
 if(error)throw new Error('No fue posible cargar las imágenes. Ejecuta la política SQL para imágenes.');
 return {sedes,imagenes:(data??[]) as GalleryImage[],allowed:true};
}
