import {NextResponse} from 'next/server';
import {getPublicReservationConfig} from '@/lib/public-reservations';

export async function GET(){
 const [coban,antigua]=await Promise.all([
  getPublicReservationConfig('coban'),getPublicReservationConfig('antigua'),
 ]);
 return NextResponse.json([
  {label:'Cobán, Alta Verapaz',name:'Hotel Los Faroles Cobán',config:coban},
  {label:'Antigua Guatemala',name:'Hotel Los Faroles Antigua',config:antigua},
 ],{headers:{'Cache-Control':'no-store'}});
}
