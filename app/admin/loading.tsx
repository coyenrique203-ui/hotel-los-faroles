import '@/styles/social-publications.css';
import {LoaderCircle} from 'lucide-react';

export default function AdminLoading(){
 return <div style={{minHeight:'65vh',display:'grid',placeItems:'center',background:'#f5f6f8',padding:24}}>
  <div role="status" aria-live="polite" style={{display:'flex',alignItems:'center',flexDirection:'column',gap:16,color:'#334e6c'}}>
   <LoaderCircle style={{animation:"upload-spin 1.3s linear infinite"}} size={43}/>
   <strong style={{fontSize:19}}>Preparando el panel...</strong>
   <span style={{fontSize:14,color:'#5f87b4'}}>Un momento, por favor.</span>
  </div>
 </div>;
}
