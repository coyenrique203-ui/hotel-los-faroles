import '@/styles/social-publications.css';
import {LoaderCircle} from 'lucide-react';

export default function AdminLoading(){
 return <div style={{minHeight:'65vh',display:'grid',placeItems:'center',background:'#f7f8f5',padding:24}}>
  <div role="status" aria-live="polite" style={{display:'flex',alignItems:'center',flexDirection:'column',gap:16,color:'#315746'}}>
   <LoaderCircle style={{animation:"upload-spin 1.3s linear infinite"}} size={43}/>
   <strong style={{fontSize:19}}>Preparando el panel...</strong>
   <span style={{fontSize:14,color:'#829187'}}>Un momento, por favor.</span>
  </div>
 </div>;
}
