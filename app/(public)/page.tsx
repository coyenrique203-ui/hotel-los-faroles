import {HomeHero} from '@/components/public/home/home-hero';
import {BookingSearch} from '@/components/public/booking-search';
import {HomeDestinations} from '@/components/public/home/home-destinations';
import {HomeExperience} from '@/components/public/home/home-experience';
import {getPublicVenues} from '@/lib/public-content';
import {getHomeCover} from '@/lib/portada-principal';
export default async function Home(){const [venues,cover]=await Promise.all([getPublicVenues(),getHomeCover()]);return <main><div className="home-stage"><HomeHero coban={venues.coban} videoUrl={cover.video_url}/><BookingSearch/></div><HomeDestinations venues={venues}/><HomeExperience restaurante={venues.restaurante} eventos={venues.eventos} coban={venues.coban}/></main>}
