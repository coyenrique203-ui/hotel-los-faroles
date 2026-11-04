import {AwsClient} from 'aws4fetch';

export function getR2(){
 // Los accesos estáticos evitan problemas con la sustitución de process.env
 // en los runtimes de desarrollo basados en Vite/Vinext.
 const accountId=process.env.R2_ACCOUNT_ID?.trim();
 const bucket=process.env.R2_BUCKET?.trim();
 const accessKeyId=process.env.R2_ACCESS_KEY_ID?.trim();
 const secretAccessKey=process.env.R2_SECRET_ACCESS_KEY?.trim();
 const baseUrl=process.env.R2_PUBLIC_URL?.trim().replace(/\/+$/,'');
 if(!accountId||!bucket||!accessKeyId||!secretAccessKey||!baseUrl||!baseUrl.startsWith('https://'))return null;
 const client=new AwsClient({service:'s3',region:'auto',accessKeyId,secretAccessKey});
 const endpoint=`https://${accountId}.r2.cloudflarestorage.com`;
 const objectPath=(key:string)=>key.split('/').map(encodeURIComponent).join('/');
 return {
  publicUrl:(key:string)=>`${baseUrl}/${objectPath(key)}`,
  async upload(key:string,body:Uint8Array,contentType:string){
   const uploadBody=Uint8Array.from(body).buffer;
   const response=await client.fetch(`${endpoint}/${bucket}/${objectPath(key)}`,{
    method:'PUT',headers:{'Content-Type':contentType,'Cache-Control':'public, max-age=86400'},body:uploadBody,
   });
   if(!response.ok)throw new Error(`R2 upload: HTTP ${response.status}`);
  },
  async remove(key:string){
   const response=await client.fetch(`${endpoint}/${bucket}/${objectPath(key)}`,{method:'DELETE'});
   if(!response.ok&&response.status!==404)throw new Error(`R2 delete: HTTP ${response.status}`);
  },
 };
}
