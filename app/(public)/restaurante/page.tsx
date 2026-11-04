import type {Metadata} from 'next';
import {VenuePage} from '@/components/public/venue/venue-page';
import {getPublicVenue} from '@/lib/public-content';
export const metadata:Metadata={title:'Restaurante Los Faroles | Gastronomía'};
export default async function RestaurantePage(){return <VenuePage venue={await getPublicVenue('restaurante')}/>}
