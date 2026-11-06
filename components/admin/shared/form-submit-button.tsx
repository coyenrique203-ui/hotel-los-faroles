'use client';

import {useFormStatus} from 'react-dom';
import type {ReactNode} from 'react';
import {createPortal} from 'react-dom';

type Props={children:ReactNode;pendingText:string;className?:string;name?:string;value?:string};

export function FormSubmitButton({children,pendingText,className,name,value}:Props){
 const {pending}=useFormStatus();
 return <><button type="submit" name={name} value={value} className={className} disabled={pending} aria-busy={pending}>
  {pending?<><span className="admin-loading-spinner" aria-hidden="true"/>{pendingText}</>:children}
 </button>{pending&&typeof document!=='undefined'&&createPortal(<div className="admin-operation-overlay" role="status" aria-live="polite" aria-busy="true"><div className="admin-operation-panel"><div className="admin-operation-spinner" aria-hidden="true"/><strong>{pendingText}</strong><small>Estamos procesando tu solicitud. Por favor, espera un momento.</small></div></div>,document.body)}</>;
}
