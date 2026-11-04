import type {Metadata} from 'next';
import {VenuePage} from '@/components/public/venue/venue-page';
import {getPublicVenue} from '@/lib/public-content';
export const metadata:Metadata={title:'Hotel Los Faroles Antigua | Antigua Guatemala'};
export default async function AntiguaPage(){return <VenuePage venue={await getPublicVenue('antigua')}/>}
