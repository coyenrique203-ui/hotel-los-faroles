import Link from 'next/link';
export function SiteFooter(){return <footer><div className="footer-grid">
  <div className="footer-brand"><b>✣</b><strong>LOS FAROLES</strong><small>HOTELS & EXPERIENCES</small><p>Una manera especial de descubrir Guatemala.</p></div>
  <div><h4>EXPLORAR</h4><Link href="/coban">Hotel Cobán</Link><Link href="/antigua">Hotel Antigua</Link><Link href="/restaurante">Restaurante</Link><Link href="/eventos">Eventos</Link></div>
  <div><h4>DESTINOS</h4><Link href="/coban">Cobán, Alta Verapaz</Link><Link href="/antigua">Antigua Guatemala</Link></div>
  <div><h4>CONÉCTATE</h4><p>Próximamente: información oficial de contacto y ubicación.</p></div></div>
  <div className="footer-line"><span>© {new Date().getFullYear()} HOTEL LOS FAROLES</span><span>PROPUESTA VISUAL · IMÁGENES DE DEMOSTRACIÓN</span><Link href="/">VOLVER AL INICIO ↑</Link></div></footer>}
