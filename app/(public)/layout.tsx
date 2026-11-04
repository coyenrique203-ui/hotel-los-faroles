import {SiteHeader} from '@/components/public/site-header';
import {SiteFooter} from '@/components/public/site-footer';
import {getPublishedEstablishments} from '@/lib/public-establishments';
export default async function PublicLayout({children}:{children:React.ReactNode}){
 const establishments=await getPublishedEstablishments();
 return <><SiteHeader establishments={establishments.map(s=>({slug:s.slug,nombre:s.nombre}))}/>{children}<SiteFooter/></>;
}
