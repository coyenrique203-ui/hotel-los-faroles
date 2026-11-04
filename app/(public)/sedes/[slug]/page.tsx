import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import {VenuePage} from '@/components/public/venue/venue-page';
import {getPublishedEstablishment} from '@/lib/public-establishments';

type Props={params:Promise<{slug:string}>};

export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;
 const venue=await getPublishedEstablishment(slug);
 return {title:venue?`${venue.name} | Los Faroles`:'Establecimiento no disponible | Los Faroles'};
}

export default async function EstablishmentPage({params}:Props){
 const {slug}=await params;
 const venue=await getPublishedEstablishment(slug);
 if(!venue)notFound();
 return <VenuePage venue={venue}/>;
}
