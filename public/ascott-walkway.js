const walkwayDialog=document.querySelector('#ai-dialog');
document.querySelector('#open-walkway-evidence').addEventListener('click',()=>walkwayDialog.showModal());
walkwayDialog.querySelector('.close').addEventListener('click',()=>walkwayDialog.close());
walkwayDialog.addEventListener('click',event=>{if(event.target===walkwayDialog){const bounds=walkwayDialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)walkwayDialog.close();}});
