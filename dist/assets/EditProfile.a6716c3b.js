import{U as s,r as u,o as c,c as d,b as m,a as t,s as h,t as _,d as y,q as p,v as f,w as C,g as D}from"./index.35e50974.js";const k="/assets/ill3.dff19969.svg",U={class:"h-full flex flex-col"},I=t("p",{class:"text-3xl font-light mt-10 ml-10 mb-5"},"Profile",-1),L={key:0,class:"bg-base-200 h-full"},E=t("p",{class:"font-light text-2xl p-5 text-center mt-10"},"You gotta have an account to change open your profile details!",-1),F={class:"w-fit m-auto mb-4"},V=t("span",{class:""}," Login ",-1),j=[V],A=t("span",{class:""}," Signup ",-1),S=[A],Y=t("img",{src:k,class:"m-auto w-4/12 mb-0"},null,-1),N={key:1,class:"flex z-0 bg-base-200 h-full"},P={class:"avatar placeholder block mx-10 my-10"},q={class:"bg-gradient-to-tr from-[#4158D0] via-[#C850C0] to-[#FFCC70] text-neutral-content rounded-full w-60"},B={class:"text-5xl"},G={class:"grow"},M=t("h2",{class:"text-3xl font-light self-start mt-10"},"Edit your profile:",-1),$=t("p",{class:"justify-self-start self-start mb-10 text-lg font-light"},"Your Account Details:",-1),z={key:0,class:"text-red-500 absolute top-[13.5%] text-base font-light"},H={class:"form-control mb-3"},T=t("p",{class:"justify-self-start self-start text-lg font-light"},"Your Username:",-1),W={class:"form-control mb-3"},J=t("p",{class:"justify-self-start self-start text-lg font-light"},"Your Email:",-1),K={class:"form-control mb-10"},O=t("p",{class:"justify-self-start self-start text-lg font-light"},"Your Name:",-1),Q={class:"flex w-full justify-start"},R={class:"w-full mt-2 flex"},tt={__name:"EditProfile",setup(X){s().pageImIn="profile";const n=u(),i=u(),o=u(),r=u(),a=u("");s().IsAGuest||(n.value=s().userDetails.email,i.value=s().userDetails.Fname,o.value=s().userDetails.username,r.value=s().userDetails.Lname,s().getNotificationList(),a.value="",console.log(o.value)),console.log(s().IsAGuest);function g(){s().userDetails.email==n.value&&s().userDetails.Fname==i.value&&s().userDetails.Lname==r.value&&s().userDetails.username==o.value&&(a.value="Updated nothing!");let v={email:n.value,username:o.value.toLowerCase(),Fname:i.value,Lname:r.value};const e=s();e.EditProf(v),C(()=>e.ServerAns,(l,w)=>{console.log("Watch props.selected function called with args:",l,w),a.value=l}),a.value=="Done!"}function b(){window.location.replace("https://fakhermeets.13.development.maqsam.com/login")}function x(){window.location.replace("https://fakhermeets.13.development.maqsam.com/signup")}return(v,e)=>(c(),d("div",U,[I,m(s)().IsAGuest?(c(),d("div",L,[E,t("div",F,[t("button",{class:h(["btn btn-accent m-5 my-2",{"btn-active":m(s)().pageImIn=="Meeting"}]),onClick:e[0]||(e[0]=l=>b())},j,2),t("button",{class:h(["btn btn-primary m-5 my-2",{"btn-active":m(s)().pageImIn=="Meeting"}]),onClick:e[1]||(e[1]=l=>x())},S,2)]),Y])):(c(),d("div",N,[t("div",P,[t("div",q,[t("span",B,_(o.value.slice(0,2).toUpperCase()),1)])]),t("div",G,[M,$,a.value!=""?(c(),d("p",z,_(a.value),1)):y("",!0),t("div",H,[T,p(t("input",{type:"text",placeholder:"Username",class:"input input-bordered disabled:text-slate-500 w-1/3","onUpdate:modelValue":e[2]||(e[2]=l=>o.value=l)},null,512),[[f,o.value]])]),t("div",W,[J,p(t("input",{type:"text",placeholder:"Email",class:"input input-bordered disabled:text-slate-500 w-1/3","onUpdate:modelValue":e[3]||(e[3]=l=>n.value=l)},null,512),[[f,n.value]])]),t("div",K,[O,t("div",Q,[p(t("input",{type:"text",placeholder:"First name",class:"input input-bordered disabled:text-slate-500 w-1/3 mr-5","onUpdate:modelValue":e[4]||(e[4]=l=>i.value=l)},null,512),[[f,i.value]]),p(t("input",{type:"text",placeholder:"Last name",class:"input input-bordered disabled:text-slate-500 w-1/3","onUpdate:modelValue":e[5]||(e[5]=l=>r.value=l)},null,512),[[f,r.value]])])]),t("div",R,[t("button",{class:"btn mr-5 w-1/3 font-light text-base",onClick:e[6]||(e[6]=l=>m(D).push("/prifleEdit/ChangePassword"))},"Change your password"),t("button",{class:"btn hover:bg-[hsl(151,58%,50%)] hover:border-[hsl(151,58%,50%)] btn-success w-1/3 font-light text-base",onClick:g},"Done!")])])]))]))}};export{tt as default};