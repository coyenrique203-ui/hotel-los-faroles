import type {Metadata} from 'next';
import {VenuePage} from '@/components/public/venue/venue-page';
import {getPublicVenue} from '@/lib/public-content';
export const metadata:Metadata={title:'Hotel Los Faroles Cobán | Alta Verapaz'};
export default async function CobanPage(){return <VenuePage venue={await getPublicVenue('coban')}/>}
