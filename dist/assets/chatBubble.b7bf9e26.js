import{_ as n}from"./_plugin-vue_export-helper.cdc0426e.js";import{r as l,o as s,c as a,t as o,a as m,s as c}from"./index.35e50974.js";const r={key:0,class:"absolute left-5 font-extralight"},i={key:1,class:"absolute right-9 top-1 font-extralight"},_={__name:"chatBubble",props:{msg:{type:String},me:{type:Boolean},name:{type:String}},setup(e){const t=e;return l(),(p,f)=>(s(),a("div",{class:c(["flex",{me:t.me,them:!t.me}])},[e.me?(s(),a("p",i,o("Me:"))):(s(),a("p",r,o(e.name+":"),1)),m("h3",{class:c(["rounded-lg py-2 px-4 font-semibold mt-6 inline-block",{fromMe:t.me,fromthem:!t.me}])},o(e.msg),3)],2))}},u=n(_,[["__scopeId","data-v-3cce62fc"]]);export{u as C};