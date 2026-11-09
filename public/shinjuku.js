const shinjukuDialog=document.querySelector('#ai-dialog');
document.querySelector('#open-shinjuku-evidence').addEventListener('click',()=>shinjukuDialog.showModal());
shinjukuDialog.querySelector('.close').addEventListener('click',()=>shinjukuDialog.close());
shinjukuDialog.addEventListener('click',event=>{if(event.target===shinjukuDialog){const b=shinjukuDialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)shinjukuDialog.close();}});
