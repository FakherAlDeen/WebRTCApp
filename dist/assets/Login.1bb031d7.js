import{U as c,r as i,n as f,o as d,c as p,a as e,t as g,d as m,q as v,v as _,b as k,s as h,e as C,F as y,w as S,g as L,x as V}from"./index.35e50974.js";const U={class:"avatar placeholder"},A={class:"bg-neutral-focus text-neutral-content rounded-full w-1/3 mx-auto mt-20"},B={key:0,class:"text-3xl"},G=e("p",{class:"text-lg text-gray-500 font-light mt-4 text-center"},"Please Sign in",-1),D={key:0,class:"text-red-500 absolute text-center top-1/3 w-full"},H=e("span",{class:"mr-2"},[e("svg",{width:"24px",height:"24px",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg","enable-background":"new 0 0 24 24"},[e("path",{d:"M17,2H7C5.3,2,4,3.3,4,5v6h8.6l-2.3-2.3c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l4,4c0.4,0.4,0.4,1,0,1.4c0,0,0,0,0,0l-4,4c-0.4,0.4-1,0.4-1.4,0c-0.4-0.4-0.4-1,0-1.4l2.3-2.3H4v6c0,1.7,1.3,3,3,3h10c1.7,0,3-1.3,3-3V5C20,3.3,18.7,2,17,2z"})])],-1),I=e("span",null," Sign in ",-1),M=[H,I],N=e("span",null," Log In as a guest ",-1),q=[N],z={class:"card-actions self-center rounded-3xl text-center"},E={__name:"Login",setup(F){c().pageImIn="Login";const n=i(""),a=i(""),o=i(""),r=c(),x=s=>{const t=V(s.credential);console.log(s),console.log(t),c().Set_Credent_Google(t)};async function w(){if(n.value==""||a.value==""){o.value="Complete the reqiured fields";return}let s={username:n.value.toLowerCase(),password:a.value};r.Login(s),console.log("MSG",s),S(()=>r.ServerAns,(t,u)=>{console.log("Watch props.selected function called with args:",t,u),o.value=t}),o.value=r.ServerAns}async function b(){c().loginAsAguest()}return(s,t)=>{const u=f("GoogleLogin");return d(),p(y,null,[e("div",U,[e("div",A,[n.value!=""?(d(),p("span",B,g(n.value.slice(0,2).toUpperCase()),1)):m("",!0)])]),G,o.value!=null||o.value!=""?(d(),p("p",D,g(o.value),1)):m("",!0),v(e("input",{type:"text",placeholder:"username",class:"input input-bordered m-5 my-2 mt-32 p-5","onUpdate:modelValue":t[0]||(t[0]=l=>n.value=l)},null,512),[[_,n.value]]),v(e("input",{type:"password",placeholder:"Password",class:"input input-bordered m-5 my-2 p-5","onUpdate:modelValue":t[1]||(t[1]=l=>a.value=l)},null,512),[[_,a.value]]),e("a",{onClick:t[2]||(t[2]=l=>k(L).push("/signup")),class:"text-sky-500 text-center"},"don't have an account wanna make one?"),e("button",{class:h(["btn btn-ghost m-5 mt-24",{}]),onClick:w},M),e("button",{class:h(["btn btn-ghost m-5 mt-1 mb-1",{}]),onClick:b},q),e("div",z,[C(u,{class:"w-full rounded-3xl",callback:x})])],64)}}};export{E as default};