'use client';

import {useFormStatus} from 'react-dom';
import type {ReactNode} from 'react';

type Props={children:ReactNode;pendingText:string;className?:string;name?:string;value?:string};

export function FormSubmitButton({children,pendingText,className,name,value}:Props){
 const {pending}=useFormStatus();
 return <button type="submit" name={name} value={value} className={className} disabled={pending} aria-busy={pending}>
  {pending?<><span className="admin-loading-spinner" aria-hidden="true"/>{pendingText}</>:children}
 </button>;
}
