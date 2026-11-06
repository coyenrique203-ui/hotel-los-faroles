'use client';
import {useEffect} from 'react';

export function AdminFeedback(){
 useEffect(()=>{
  const root=document.querySelector('.admin-content');
  if(!root)return;
  const seen=new WeakSet<Element>();
  const timers=new Set<ReturnType<typeof setTimeout>>();
  const register=()=>{
   root.querySelectorAll('.sede-success,.sede-error').forEach(element=>{
    if(seen.has(element))return;
    seen.add(element);
    element.classList.add('admin-feedback-notice');
    const duration=element.classList.contains('sede-error')?7500:4500;
    const timer=setTimeout(()=>{element.classList.add('admin-feedback-hide');timers.delete(timer);},duration);
    timers.add(timer);
   });
  };
  register();
  const observer=new MutationObserver(register);
  observer.observe(root,{childList:true,subtree:true});
  return ()=>{observer.disconnect();timers.forEach(clearTimeout);};
 },[]);
 return null;
}
