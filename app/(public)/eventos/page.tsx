import type {Metadata} from 'next';
import {VenuePage} from '@/components/public/venue/venue-page';
import {getPublicVenue} from '@/lib/public-content';
export const metadata:Metadata={title:'Eventos Los Faroles | Próximamente'};
export default async function EventosPage(){return <VenuePage venue={await getPublicVenue('eventos')}/>}
