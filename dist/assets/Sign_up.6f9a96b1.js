import{U as g,r as s,o as d,c as m,a as e,t as h,d as _,q as o,v as u,s as y,F as k,A as C,w as U,g as S,_ as V}from"./index.35e50974.js";const F=e("img",{class:"w-6 mr-1",src:V},null,-1),B=[F],L={class:"avatar placeholder"},z={class:"bg-neutral-focus text-neutral-content rounded-full w-1/3 mx-auto mt-20"},q={key:0,class:"text-3xl"},A=e("p",{class:"text-lg text-gray-500 font-light mt-4 text-center"},"Fill the field to sign up",-1),D={key:0,class:"text-red-500 absolute text-center top-64 w-full"},E=e("span",{class:"mr-2"},[e("svg",{width:"24px",height:"24px",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg","enable-background":"new 0 0 24 24"},[e("path",{d:"M17,2H7C5.3,2,4,3.3,4,5v6h8.6l-2.3-2.3c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l4,4c0.4,0.4,0.4,1,0,1.4c0,0,0,0,0,0l-4,4c-0.4,0.4-1,0.4-1.4,0c-0.4-0.4-0.4-1,0-1.4l2.3-2.3H4v6c0,1.7,1.3,3,3,3h10c1.7,0,3-1.3,3-3V5C20,3.3,18.7,2,17,2z"})])],-1),H=e("span",null," Sign Up ",-1),I=[E,H],P={__name:"Sign_up",setup(M){g().pageImIn="Signup";const r=s(""),p=s(""),i=s(""),a=s(""),c=s(""),x=s(!1),n=s("");function w(){if(r.value==""||p.value==""||a.value==""||i.value==""||c.value==""||!x){n.value="Complete the reqiured fields",console.log("kys");return}let v={id:C(),email:r.value,username:a.value.toLowerCase(),Fname:i.value,Lname:c.value,password:p.value};const t=g();t.Signup_auth(v,!1),U(()=>t.ServerAns,(l,f)=>{console.log("Watch props.selected function called with args:",l,f),n.value=l})}function b(){S.push("/login")}return(v,t)=>(d(),m(k,null,[e("button",{class:"btn btn-circle btn-ghost absolute z-40 top-5 left-5",onClick:b},B),e("div",L,[e("div",z,[a.value!=""?(d(),m("span",q,h(a.value.slice(0,2).toUpperCase()),1)):_("",!0)])]),A,n.value!=null||n.value!=""?(d(),m("p",D,h(n.value),1)):_("",!0),o(e("input",{type:"text",placeholder:"username",class:"input input-bordered m-5 my-2 mt-16 p-5","onUpdate:modelValue":t[0]||(t[0]=l=>a.value=l)},null,512),[[u,a.value]]),o(e("input",{type:"text",placeholder:"Email",class:"input input-bordered m-5 my-2 p-5","onUpdate:modelValue":t[1]||(t[1]=l=>r.value=l)},null,512),[[u,r.value]]),o(e("input",{type:"text",placeholder:"First name",class:"input input-bordered m-5 my-2 p-5","onUpdate:modelValue":t[2]||(t[2]=l=>i.value=l)},null,512),[[u,i.value]]),o(e("input",{type:"text",placeholder:"Last name",class:"input input-bordered m-5 my-2 p-5","onUpdate:modelValue":t[3]||(t[3]=l=>c.value=l)},null,512),[[u,c.value]]),o(e("input",{type:"password",placeholder:"Password",class:"input input-bordered m-5 my-2 p-5","onUpdate:modelValue":t[4]||(t[4]=l=>p.value=l)},null,512),[[u,p.value]]),e("button",{class:y(["btn btn-ghost m-5 mt-24",{}]),onClick:w},I)],64))}};export{P as default};
