import{b as We}from"./chunk-M5NV5XMO.js";import{a as ge,c as Lt,d as vn,e as kt}from"./chunk-PBN5LLAA.js";import{a as ft}from"./chunk-MADPDA6U.js";import{a as xt}from"./chunk-FEYPXFJ6.js";import{a as Ve}from"./chunk-FJMP4XPS.js";import{a as gt}from"./chunk-QEP7SRH7.js";import{c as $}from"./chunk-TVWAVI6A.js";import{c as we}from"./chunk-CVF2X5Y4.js";import{d as ut}from"./chunk-N3ET5YJZ.js";import{$a as X,Ac as fe,B as Qe,C as He,D as E,F as et,G as _e,Ga as _,Gb as ht,H as Ne,Hb as bt,I as Y,Ib as Ct,Ic as $e,J as tt,Jb as yt,Jc as vt,K as ye,Kc as St,Lc as wt,M as ot,Mc as Vt,Oc as Pt,Q as nt,X as ve,Y as it,Z as rt,a as Cn,aa as st,b as pe,db as I,fb as J,g as Xe,ga as lt,gb as Se,l as Be,lb as ue,pb as pt,sa as at}from"./chunk-6VFX2JNU.js";import{a as ce,k as de,n as Je}from"./chunk-LUKOAFYK.js";import{g as dt,j as mt}from"./chunk-XFWXZVUM.js";import{a as N}from"./chunk-D2ACMGPV.js";import{b as P,k as o,m as ct}from"./chunk-NORECDYR.js";import{a as j,b as G,d as Z,e as me,f as yn,g as v}from"./chunk-RQERJHUS.js";import{d as C,f as browser,h as s,j as preactH,k as Fragment,o as l}from"./chunk-NUN3A7RC.js";l();s();var Rt,wn=200,Vn=.05,Pn=[{min:.5,max:1,time:3},{min:1.1,max:1.5,time:4},{min:1.6,max:2,time:5},{min:2.1,max:2.5,time:10},{min:2.6,max:3,time:20},{min:3.1,max:3.5,time:20},{min:3.6,max:4,time:25},{min:4.1,max:4.5,time:25}],Ln=600,kn=e=>Math.round(e/50)*50,Rn=e=>Math.round(e*10)/10,Fe=e=>{let t=Rn(e),n=Pn.find(a=>t>=a.min&&t<=a.max);if(!n)return Ln;let i=wn*t,r=Math.round(i*n.time);return kn(r)};async function mr(){Rt?.(),Rt=ht.on("consumed",async()=>{let{autoSpeedUp:e,playbackSpeed:t}=await nt(),n=await Pt();if(!e||!n)return;let i=Fe(t);n>=i&&await En(t)})}var En=async e=>ve(e+Vn,ce,!0);l();s();var rn=C(Cn());l();s();var It=C(v());var Tn=o.div`
  align-items: flex-start;
  align-self: stretch;
  background: #2d2d2f;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
`,At=o.div`
  border-radius: 9999px;
  background: #1e1e1f;
  display: flex;
  padding: 2px;
  align-items: center;
  gap: 10px;
`,In=o(At)`
  transform: rotate(180deg);
`,Et=o.div`
  align-items: center;
  align-self: stretch;
  color: #fff;
  display: flex;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  gap: 4px;
  letter-spacing: 0.14px;
  line-height: 20px;
`;function Tt(){return preactH("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16",fill:"none"},preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3.96625 4.75971C4.25915 4.46682 4.73402 4.46682 5.02691 4.75971L7.80632 7.53912C7.94697 7.67977 8.02599 7.87054 8.02599 8.06945C8.02599 8.26836 7.94697 8.45913 7.80632 8.59978L5.02691 11.3792C4.73402 11.6721 4.25914 11.6721 3.96625 11.3792C3.67336 11.0863 3.67336 10.6114 3.96625 10.3185L6.21533 8.06944L3.96625 5.82037C3.67336 5.52748 3.67336 5.0526 3.96625 4.75971ZM8.51499 4.75971C8.80788 4.46682 9.28276 4.46682 9.57565 4.75971L12.3551 7.53912C12.4957 7.67977 12.5747 7.87054 12.5747 8.06945C12.5747 8.26836 12.4957 8.45913 12.3551 8.59978L9.57565 11.3792C9.28275 11.6721 8.80788 11.6721 8.51499 11.3792C8.22209 11.0863 8.2221 10.6114 8.51499 10.3185L10.7641 8.06945L8.51499 5.82037C8.2221 5.52748 8.2221 5.0526 8.51499 4.75971Z",fill:"white"}))}function Ue(){return(0,It.useEffect)(()=>{rt()},[]),preactH(I,{padding:"12px",xAlign:!0,column:!0,separation:"8px",style:{paddingTop:0}},preactH(Tn,null,preactH(Et,null,"Use"," ",preactH(At,null,preactH(Tt,null))," ","to skip forward."),preactH(Et,null,"Use"," ",preactH(In,null,preactH(Tt,null))," ","to skip backward.")))}l();s();var Q=C(v());var Dn=o(I)`
  align-items: center;
  border-radius: 12px;
  border: 1.5px dashed #3c3c3e;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  justify-content: center;
  padding: 12px 16px;
  width: 100%;
  max-width: 100%;

  &:hover {
    border-color: #8894fe;

    span {
      color: #8894fe;
    }

    svg {
      path {
        fill: #8894fe;
      }
    }
  }

  &:active {
    opacity: 0.5;
  }
`,Mn=o(pt)`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;

  &:hover {
    opacity: 0.75;
  }

  &:active {
    opacity: 0.5;
  }
`,Bn=()=>{let e=(0,Q.useCallback)(()=>{xe("/"),xt("broken-site-menu")},[]);return preactH(Dn,{xAlign:!0,column:!0,separation:"4px",onClick:e},preactH(mt,null),preactH(ue,{fontSize:"14px",medium:!0},"Capture and listen"))};function ze({onReport:e}){let{reportedDomains:t}=_(),n=(0,Q.useMemo)(()=>t?.includes(Be()),[t]),i=(0,Q.useCallback)(()=>{xe("/")},[]),r=(0,Q.useCallback)(()=>{n||(fe("extension_usage_broken_site_reported"),lt(Be()),e?.()),i()},[n]);return preactH(I,{padding:"12px",xAlign:!0,column:!0,separation:"8px"},preactH(Bn,null),preactH(I,{xAlign:!0,column:!0,separation:"16px"},preactH(ue,{align:"center",fontSize:"14px",color:"#9899A6"},"Take a screenshot of a",preactH("br",null),"selected area and listen to it."),preactH(Mn,{onClick:r},n?"Site reported":"Still not working? Report Site")))}l();s();var A=C(v()),vo=C(de());l();s();var Pe=C(v());l();s();var Dt=o.div`
  align-items: flex-start;
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 0px 40px 24px 40px;
`,Mt=o.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 0px;
  justify-content: flex-end;
  padding: 2px;
  width: 32px;

  .react-switch-bg {
    background: ${({checked:e})=>e?"radial-gradient(263.4% 263.4% at -38.15% -15%, #ea6aff 22.4%, #6b78fc 66.49%) !important":"initial"};
  }

  .react-switch-handle {
    background: ${P.icnTxtWhite} !important;
  }
`,Bt=o.div`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  flex-shrink: 0;
  gap: 4px;
  width: 216px;
`,_t=o.div`
  align-self: stretch;
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.14px;
  line-height: 20px;
`,Nt=o.div`
  align-self: stretch;
  color: #afb9c8;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.12px;
  line-height: 16px;
`;var _n=({isLocked:e})=>{let{autoSpeedUp:t,playbackSpeed:n}=_(),i=(0,Pe.useMemo)(()=>{if(e)return"You reached your speed limit";let a=(n||1.1)*200;return`Adds 10 wpm every ${(Fe(n||1.1)/a).toFixed(0)} minutes`},[e,n]),r=(0,Pe.useCallback)(()=>st(!t),[t]);return preactH(Dt,null,preactH(Bt,null,preactH(_t,null,"Increase speed automatically"),preactH(Nt,null,i)),preactH(Mt,{checked:!!t},preactH(gt,{"aria-label":J("AUTOMATIC_PLAYBACK_SPEED_UP_SWITCH"),"data-testid":Se.AUTOMATIC_PLAYBACK_SPEED_UP_SWITCH,checked:t,disabled:e,onChange:r})))},Wt=_n;l();s();l();s();var Ft=()=>preactH("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16",fill:"none"},preactH("g",{"clip-path":"url(#clip0_20322_3343)"},preactH("rect",{width:"16",height:"16",rx:"8",fill:"#1E1E1E"}),preactH("circle",{cx:"8.00006",cy:"8.00006",r:"6.02545",fill:"#1E1E1E"}),preactH("path",{d:"M7.2 5.5V7H8.8V5.5C8.8 5.05817 8.44183 4.7 8 4.7C7.55817 4.7 7.2 5.05817 7.2 5.5Z",fill:"#AFB9C8"}),preactH("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.7 7H6V5.5C6 4.39543 6.89543 3.5 8 3.5C9.10457 3.5 10 4.39543 10 5.5V7H10.3C10.9627 7 11.5 7.53726 11.5 8.2V10.7371C11.5 11.3999 10.9627 11.9371 10.3 11.9371H5.7C5.03726 11.9371 4.5 11.3999 4.5 10.7371V8.2C4.5 7.53726 5.03726 7 5.7 7Z",fill:"#AFB9C8"})),preactH("defs",null,preactH("clipPath",{id:"clip0_20322_3343"},preactH("rect",{width:"16",height:"16",rx:"8",fill:"white"})))),Ut=()=>preactH("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},preactH("g",{id:"icons/20"},preactH("path",{id:"Vector",d:"M9 9H3C2.44772 9 2 9.44772 2 10C2 10.5523 2.44772 11 3 11H9H11H17C17.5523 11 18 10.5523 18 10C18 9.44772 17.5523 9 17 9H11H9Z",fill:"#AFB9C8"}))),zt=()=>preactH("svg",{width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},preactH("g",{id:"icons/20"},preactH("path",{id:"Vector","fill-rule":"evenodd","clip-rule":"evenodd",d:"M11 3C11 2.44772 10.5523 2 10 2C9.44772 2 9 2.44772 9 3V9H3C2.44772 9 2 9.44772 2 10C2 10.5523 2.44772 11 3 11H9V17C9 17.5523 9.44772 18 10 18C10.5523 18 11 17.5523 11 17V11H17C17.5523 11 18 10.5523 18 10C18 9.44772 17.5523 9 17 9H11V3Z",fill:"#AFB9C8"}))),Ot=()=>preactH("svg",{width:"21",height:"20",viewBox:"0 0 21 20",fill:"none",xmlns:"http://www.w3.org/2000/svg"},preactH("g",null,preactH("path",{id:"Vector",d:"M14.3717 5.87813L15.5717 7.07813L11.505 11.1448L8.76336 8.40313C8.43836 8.07813 7.91336 8.07813 7.58836 8.40313L2.58835 13.4115C2.26335 13.7365 2.26335 14.2615 2.58835 14.5865C2.91335 14.9115 3.43835 14.9115 3.76335 14.5865L8.17169 10.1698L10.9134 12.9115C11.2384 13.2365 11.7634 13.2365 12.0884 12.9115L16.7467 8.26147L17.9467 9.46147C18.205 9.7198 18.655 9.53647 18.655 9.1698V5.58647C18.6634 5.35313 18.48 5.1698 18.2467 5.1698H14.6717C14.2967 5.1698 14.1134 5.6198 14.3717 5.87813Z",fill:"#30D158"})));l();s();var jt=o.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
`,Gt=o.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  flex-direction: column;
  gap: 32px;
  justify-content: center;
  padding: 24px 20px;
`,Oe=o.button`
  align-items: flex-start;
  background: ${({disabled:e})=>e?"#828282":"#111112"};
  border: none;
  border-radius: 8px;
  cursor: ${({disabled:e})=>e?"not-allowed":"pointer"};
  display: flex;
  gap: 0px;
  opacity: ${({disabled:e})=>e?.3:1};
  padding: 8px;

  &:hover {
    background: ${({disabled:e})=>e?"#828282":"transparent"};
  }
`,Zt=o.div`
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: center;
`,qt=o.div`
  color: #fff;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 32px;
  text-align: center;
  width: 80px;
`,Kt=o.div`
  align-self: stretch;
  color: #afb9c8;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.12px;
  line-height: 16px;
  text-align: center;
`,Yt=o.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  gap: 4px;
  justify-content: center;
`,Xt=o.div`
  display: flex;
  align-items: center;
  align-self: stretch;
  flex-direction: column;
  gap: 4px;
`,Jt=o.div`
  align-items: center;
  background: #1e5028;
  border-radius: 4px;
  color: #30d158;
  display: flex;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  gap: 4px;
  justify-content: center;
  letter-spacing: 0.12px;
  line-height: 16px;
  padding: 2px 8px;
  text-align: center;
`,Qt=o.div`
  height: 24px;
`,Ht=o.div`
  align-items: center;
  align-self: stretch;
  color: #fff;
  display: flex;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  gap: 4px;
  justify-content: center;
  letter-spacing: 0.16px;
  line-height: 24px;
  text-align: center;
`,eo=o.div`
  align-items: flex-start;
  align-self: stretch;
  color: #afb9c8;
  display: flex;
  flex: 1 0 0;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  justify-content: center;
  letter-spacing: 0.12px;
  line-height: 16px;
  text-align: center;
`;var Nn=(e,t)=>{let n=(t-e)/e*100;return n>=0?Math.round(n):0},$n=e=>{let t={Slow:[.4,1],Normal:[1,1.5],Fast:[1.5,3],"Speed Reader":[3,4.6]};for(let[n,[i,r]]of Object.entries(t))if(e>=i&&e<r)return n;return"Invalid Speed"},Wn=({baseWPM:e,maxPlaybackSpeed:t,minPlaybackSpeed:n,onDecrement:i,onIncrement:r,playbackSpeed:a})=>{let p=X.useTime(),m=p.isLoading===!0?0:p.totalEstimatedDuration,x=Je("short")(m),c=Qe(a),f=Nn(e,c);return preactH(Gt,null,preactH(Xt,null,preactH(Ht,null,$n(a)),preactH(Kt,null,"Duration: ~",x)),preactH(jt,null,f>0?preactH(Jt,null,preactH(Ot,null),f,"% productivity boost"):preactH(Qt,null),preactH(Zt,null,preactH(Oe,{disabled:a===n,onClick:i},preactH(Ut,null)),preactH(qt,{"data-testid":Se.PLAYBACK_SPEED_PANEL_SPEED_VALUE},a.toFixed(1),"x"),preactH(Oe,{disabled:a===t,onClick:r},preactH(zt,null))),preactH(eo,null,c," words per minute")),preactH(Yt,null))},to=Wn;l();s();var k=C(v()),he=C(de());l();s();var ke=C(v()),xo=C(de());l();s();var fo=C(v());l();s();var Le=C(v());var oo=o.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 348px;
`,no=o.div`
  align-items: flex-start;
  background: #1e1e1e;
  display: flex;
  flex-direction: column;
  width: 348px;
`,io=({children:e,enabled:t=!0,text:n,showOnRight:i=!1,visible:r=!0,...a})=>{let{onMouseEnter:p,onMouseLeave:m,showTooltip:x}=ut(),[c,f]=(0,Le.useState)(!1),u=()=>f(!0);return(0,Le.useEffect)(()=>{c&&setTimeout(()=>{f(!1)},500)},[c]),preactH(Un,{onClick:u,onMouseLeave:m,onMouseEnter:p,...a,visible:r},x&&!c&&n&&t&&preactH(Fn,{showOnRight:i},n),e)},Fn=o.div`
  background: #fff;
  border-radius: 6px;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.32);
  color: #1e1e1e;
  font-size: 12px;
  ${({showOnRight:e=!1})=>e?"left: 50px;":"right: 48px"};
  line-height: 16px;
  padding: 4px 8px;
  position: absolute;
  text-align: center;
  top: 20%;
  width: max-content;
  max-width: 200px;
`,Un=o.div`
  position: relative;
  opacity: ${({visible:e})=>e?1:0};
  ${({visible:e})=>!e&&"pointer-events: none;"}
  transition: opacity 0.15s ease-in-out;
`;l();s();var ro=o.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
  padding: 20px;
`,so=o.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  inset: 0;
  justify-content: center;
  pointer-events: none;
  position: absolute;
`,lo=o.div`
  border-radius: 6px;
  cursor: pointer;
  gap: 2px;
  height: 270px;
  position: relative;
  width: 44px;

  &:focus {
    outline: none;
  }
`,ao=o.div`
  background: ${({autoSpeedUp:e})=>e?"radial-gradient(263.4% 263.4% at -38.15% -15%, #ea6aff 22.4%, #6b78fc 66.49%)":"#6b78fc"};
  border-radius: 8px;
  bottom: 0px;
  height: ${({clampedPercent:e})=>e}%;
  padding: 4px;
  pointer-events: none;
  position: absolute;
  width: 36px;
`,co=o.div`
  background-color: ${P.icnTxtWhite};
  border-radius: 3px;
  cursor: grab;
  padding-bottom: 3px;
  padding-top: 3px;
`,po=o.div`
  align-items: center;
  background-color: ${({isLocked:e})=>e?"#373737":"#111112"};
  display: flex;
  flex-direction: column-reverse;
  flex-grow: 1;
  height: 54px;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 4px 8px;
  position: relative;
`,mo=o.div`
  align-items: center;
  cursor: ${({isLocked:e})=>e?"not-allowed":"pointer"};
  display: flex;
  height: 6px;
  justify-content: center;
  position: relative;
  width: 100%;
`,uo=o.div`
  background-color: ${({isLocked:e})=>e?"#8791A0":"#373737"};
  border-radius: 9999px;
  height: 2px;
  opacity: ${({isLocked:e})=>e?.5:1};
  width: ${({stepIndex:e})=>e===3?"28px":"18px"};

  ${({disableHover:e,isLocked:t})=>!t&&!e&&`
    &:hover {
      background-color: #5f9bf0;
    }
  `}
`;var zn=fo.default.memo(({steps:e,isLocked:t,style:n})=>preactH(io,{text:"Upgrade to Premium to listen faster than 300WPM",enabled:t},preactH(po,{isLocked:t,style:n},e.map((i,r)=>preactH(mo,{"aria-label":`Set speed to ${i} words per minute`,isLocked:t,key:`speed-picker-step-${i}`},preactH(uo,{stepIndex:r,isLocked:t}))),t&&preactH(so,null,preactH(Ft,null))))),go=zn;var On=(e,t)=>{let n=(t-e)/10;return Array.from({length:8},(i,r)=>(0,xo.round)(e+n*(r+1),2))},jn=ke.default.memo(({isLocked:e,sectionRanges:t})=>{let n=(0,ke.useMemo)(()=>t.map(i=>On(i.min,i.max)),[t]);return preactH("div",{style:{display:"flex",flexDirection:"column-reverse",height:"100%",gap:"-2px",position:"relative"}},n.map((i,r)=>preactH(go,{key:`speed-picker-section-${r}`,isLocked:e&&r>=2,steps:i,style:{borderTopLeftRadius:r===n.length-1?"8px":"0",borderTopRightRadius:r===n.length-1?"8px":"0",borderBottomLeftRadius:r===0?"8px":"0",borderBottomRightRadius:r===0?"8px":"0"}})))}),ho=jn;var M=[{min:.5,max:1},{min:1,max:1.5},{min:1.5,max:3},{min:3,max:4.5}],Gn=e=>{let t=M.find(m=>e>=m.min&&e<=m.max);if(!t)return e<=M[0].min?0:100;let{min:n,max:i}=t,r=M.indexOf(t),a=100/M.length*r,p=(e-n)/(i-n)*(100/M.length);return a+p},Zn=(e,t)=>{let n=e.length,i=100/n,r=(0,he.clamp)(Math.floor(t/i),0,n-1);if(r===n-1){let{min:x,max:c}=e[r];return x+(t-i*(n-1))/i*(c-x)}let{min:a,max:p}=e[r],m=t%i;return a+m/i*(p-a)},qn=({isLocked:e=!1,onLockedInteraction:t=()=>{},onMouseMove:n,onPlaybackSpeedChange:i,playbackSpeed:r})=>{let{autoSpeedUp:a}=_(),p=(0,k.useRef)(!1),m=(0,k.useRef)(null),x=(0,k.useRef)(null),c=(0,k.useMemo)(()=>Gn(r),[r]),f=(0,k.useMemo)(()=>(0,he.clamp)(c,6,e?50:100),[e,c]);(0,k.useLayoutEffect)(()=>{m.current&&(x.current=m.current.getBoundingClientRect())},[]);let u=(0,k.useCallback)(y=>{if(x.current){let L=x.current.height,U=y-x.current.top,q=(0,he.clamp)((L-U)/L*100,0,100),V=M.length,S=(0,he.clamp)(Math.floor(q/(100/V)),0,V-1);if(e&&S>=V-2){t();return}let D=Zn(M,q),re=Math.round(D*40)/40;p.current?n?.(re):i(re)}},[e,t,n]),h=(0,k.useCallback)(y=>{p.current&&u(y)},[u]);(0,k.useEffect)(()=>{let y=U=>{h(U.clientY)},L=()=>{p.current=!1};return window.addEventListener("pointermove",y,{passive:!0}),window.addEventListener("pointerup",L,{passive:!0}),()=>{window.removeEventListener("pointermove",y),window.removeEventListener("pointerup",L)}},[h]);let d=(0,k.useCallback)(y=>{y.preventDefault(),y.stopPropagation(),p.current=!0,m.current?.setPointerCapture(y.pointerId)},[]),b=(0,k.useCallback)(y=>{p.current=!1,m.current?.releasePointerCapture(y.pointerId),u(y.clientY)},[r]);return preactH(ro,null,preactH(lo,{"aria-label":"Playback Speed","aria-valuenow":r,"aria-valuemin":M[0].min,"aria-valuemax":M[M.length-1].max,onPointerDown:d,onPointerUp:b,ref:m,role:"slider",tabIndex:0},preactH(ho,{isLocked:e,sectionRanges:M}),preactH(ao,{autoSpeedUp:!!a,clampedPercent:f},preactH(co,{autoSpeedUp:!!a}))))},bo=qn;l();s();var be=C(v());var Co=e=>{let t=(0,be.useRef)(void 0);(0,be.useEffect)(()=>{(async()=>{let{playbackSpeed:i}=await pe("/user-settings/get");t.current=i,e(i)})()},[]),(0,be.useEffect)(()=>{let n=ot.on("update",i=>{i.playbackSpeed!==t.current&&(e(i.playbackSpeed),t.current=i.playbackSpeed)});return()=>{n()}},[])};var yo=.5,Yn=4.5,Xn=1e3,Jn=()=>{let[e,t]=(0,A.useState)(1);Co(t);let n=Ve(),i=(0,A.useRef)(Date.now()),r=(0,A.useMemo)(()=>n&&vt(n)&&n.status!=="expired"?Yn:ce,[n]),a=(0,A.useMemo)(()=>e>=r,[e,r]),p=(0,A.useCallback)(h=>{let d=(0,vo.clamp)(h,yo,r);ve(d,r),t(d)},[r]),m=()=>{we("speed_picker","increased_listening_speeds")},x=(0,A.useCallback)(h=>{t(h);let d=Date.now();d-i.current>Xn&&(i.current=d,p(h))},[p]),c=(0,A.useCallback)(h=>{p(h)},[p]),f=(0,A.useCallback)(()=>p(e-.1),[e,p]),u=(0,A.useCallback)(()=>p(e+.1),[e,p]);return preactH(Fragment,null,preactH(no,null,preactH(oo,null,preactH(to,{baseWPM:200,maxPlaybackSpeed:r,minPlaybackSpeed:yo,onDecrement:f,onIncrement:u,playbackSpeed:e}),preactH(bo,{isLocked:r===ce,onLockedInteraction:m,onMouseMove:x,onPlaybackSpeedChange:c,playbackSpeed:e}))),preactH(Wt,{isLocked:a}))},So=Jn;l();s();var wo=C(v());var Qn=o(I)`
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
`,Vo=()=>{let{state:e}=X.usePlayingState();return(0,wo.useEffect)(()=>{["playing","buffering"].includes(e)&&(Lo(!1),Po(!0))},[e]),preactH(Qn,{column:!0,xAlign:!0,separation:"32px"},preactH(ue,{align:!0},"This website is unsupported"))};l();s();yn();l();s();var w=C(v());l();s();var ko=e=>preactH(N,{xmlns:"http://www.w3.org/2000/svg",width:"140",height:"140",viewBox:"0 0 140 140",fill:"none",...e},preactH("g",{"clip-path":"url(#clip0_20620_4093)"},preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M0.90002 42.9138C1.97944 27.1559 2.51915 19.2769 10.9755 10.8414C19.4318 2.40579 27.252 1.88942 42.8922 0.856688C50.7115 0.340376 59.7525 0 70 0C80.2475 0 89.2885 0.340376 97.1078 0.856687C112.748 1.88942 120.568 2.40579 129.025 10.8414C137.481 19.2769 138.021 27.1559 139.1 42.9138C139.64 50.8046 140 59.863 140 70C140 79.5518 139.681 88.1461 139.192 95.7081C138.122 112.252 137.587 120.524 129.134 128.997C120.682 137.471 112.352 138.03 95.6931 139.149C88.0563 139.662 79.4427 140 70 140C60.5573 140 51.9437 139.662 44.3069 139.149C27.648 138.03 19.3185 137.471 10.8658 128.997C2.41318 120.524 1.87821 112.252 0.808262 95.7081C0.319199 88.1461 0 79.5518 0 70C0 59.863 0.359505 50.8045 0.90002 42.9138Z",fill:"#141414"}),preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M67.6001 70.3414C77.8396 78.8464 93.035 77.4405 101.54 67.201C110.045 56.9615 108.639 41.7661 98.3998 33.261C88.1603 24.7559 72.9649 26.1619 64.4598 36.4014C55.9547 46.6408 57.3607 61.8363 67.6001 70.3414ZM63.1644 75.6816C76.3532 86.6364 95.9255 84.8255 106.88 71.6367C117.835 58.4479 116.024 38.8756 102.835 27.9208C89.6467 16.9659 70.0744 18.7769 59.1196 31.9657C48.1647 45.1544 49.9757 64.7267 63.1644 75.6816Z",fill:"url(#paint0_linear_20620_4093)"}),preactH("path",{d:"M57.1882 74.6823C58.4356 73.3007 60.5506 73.149 61.9824 74.3383L64.7227 76.6144C66.1459 77.7966 66.3918 79.8873 65.2816 81.3673L43.2707 110.712C40.896 113.878 36.3551 114.412 33.3108 111.883C30.284 109.369 29.9591 104.84 32.596 101.92L57.1882 74.6823Z",fill:"url(#paint1_linear_20620_4093)"}),preactH("path",{d:"M72.9727 41.7734L93.0266 61.8275",stroke:"#424242",strokeWidth:"5.78512",strokeLinecap:"round"}),preactH("path",{d:"M93.0264 41.7734L72.9725 61.8275",stroke:"#424242",strokeWidth:"5.78512",strokeLinecap:"round"})),preactH("defs",null,preactH("linearGradient",{id:"paint0_linear_20620_4093",x1:"54.3173",y1:"130.642",x2:"55.8542",y2:"-9.54324",gradientUnits:"userSpaceOnUse"},preactH("stop",{offset:"0.202777",stopColor:"#353535"}),preactH("stop",{offset:"0.602023",stopColor:"#474747"})),preactH("linearGradient",{id:"paint1_linear_20620_4093",x1:"15.1331",y1:"144.154",x2:"-8.83031",y2:"101.947",gradientUnits:"userSpaceOnUse"},preactH("stop",{offset:"0.202777",stopColor:"#353535"}),preactH("stop",{offset:"0.602023",stopColor:"#474747"})),preactH("clipPath",{id:"clip0_20620_4093"},preactH("rect",{width:"140",height:"140",fill:"white"}))));l();s();var Eo=C(v());l();s();l();s();var Re=e=>preactH(N,{width:"22",height:"22",viewBox:"0 0 22 22",fill:"none",xmlns:"http://www.w3.org/2000/svg",...e},preactH("path",{d:"M11 21.0371C16.5176 21.0371 21.0879 16.4766 21.0879 10.9492C21.0879 5.43164 16.5176 0.861328 10.9902 0.861328C5.47266 0.861328 0.912109 5.43164 0.912109 10.9492C0.912109 16.4766 5.48242 21.0371 11 21.0371ZM9.91602 15.7734C9.54492 15.7734 9.24219 15.6074 8.96875 15.2559L6.57617 12.3457C6.40039 12.1309 6.3125 11.8965 6.3125 11.6523C6.3125 11.1543 6.70312 10.7441 7.21094 10.7441C7.51367 10.7441 7.74805 10.8613 7.99219 11.1738L9.87695 13.5664L13.9199 7.10156C14.125 6.75977 14.3984 6.59375 14.7109 6.59375C15.1992 6.59375 15.6387 6.93555 15.6387 7.44336C15.6387 7.66797 15.5215 7.91211 15.3848 8.12695L10.8145 15.2559C10.5898 15.5879 10.2773 15.7734 9.91602 15.7734Z",fill:"currentColor"}));l();s();var H=e=>preactH(N,{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",...e},preactH("g",{"clip-path":"url(#clip0_20617_6525)"},preactH("rect",{width:"16",height:"16",rx:"8",fill:"#1E1E1E"}),preactH("circle",{cx:"8.00006",cy:"8.00006",r:"6.02545",fill:"#1E1E1E"}),preactH("path",{d:"M7.2 5.5V7H8.8V5.5C8.8 5.05817 8.44183 4.7 8 4.7C7.55817 4.7 7.2 5.05817 7.2 5.5Z",fill:"#AFB9C8"}),preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM5.7 7H6V5.5C6 4.39543 6.89543 3.5 8 3.5C9.10457 3.5 10 4.39543 10 5.5V7H10.3C10.9627 7 11.5 7.53726 11.5 8.2V10.7371C11.5 11.3999 10.9627 11.9371 10.3 11.9371H5.7C5.03726 11.9371 4.5 11.3999 4.5 10.7371V8.2C4.5 7.53726 5.03726 7 5.7 7Z",fill:"#AFB9C8"})),preactH("defs",null,preactH("clipPath",{id:"clip0_20617_6525"},preactH("rect",{width:"16",height:"16",rx:"8",fill:"white"}))));l();s();var Hn=()=>preactH("svg",{xmlns:"http://www.w3.org/2000/svg",width:"40",height:"40",viewBox:"0 0 40 40",fill:"none"},preactH("g",{"clip-path":"url(#clip0_2615_4266)"},preactH("circle",{cx:"20",cy:"20",r:"20",fill:"#36373A",fillOpacity:"0.8"}),preactH("path",{d:"M14 13.9C14 13.1268 14.6268 12.5 15.4 12.5H17.1C17.8732 12.5 18.5 13.1268 18.5 13.9V26.1C18.5 26.8732 17.8732 27.5 17.1 27.5H15.4C14.6268 27.5 14 26.8732 14 26.1V13.9Z",fill:"white"}),preactH("path",{d:"M21.5 13.9C21.5 13.1268 22.1268 12.5 22.9 12.5H24.6C25.3732 12.5 26 13.1268 26 13.9V26.1C26 26.8732 25.3732 27.5 24.6 27.5H22.9C22.1268 27.5 21.5 26.8732 21.5 26.1V13.9Z",fill:"white"})),preactH("defs",null,preactH("clipPath",{id:"clip0_2615_4266"},preactH("rect",{width:"40",height:"40",fill:"white"})))),Ee=Hn;l();s();var ei=o.div`
  position: relative;
  display: inline-block;
  pointer-events: auto;

  span {
    ${({down:e})=>e?"top: 110%":"bottom: 130%"};
    ${({right:e})=>e?"left: 100%; margin-left: -20px;":"left: 154%; margin-left: -87px;"};
    background-color: #fff;
    border-radius: 6px;
    color: #1e1e1e;
    font-size: 12px;
    line-height: 16px;
    opacity: 1;
    padding: 6px 8px;
    position: absolute;
    text-align: center;
    visibility: hidden;
    width: 133px;
    z-index: 21;

    &:after {
      content: '';
      position: absolute;
      ${({down:e})=>e?"bottom: 100%":"top: 100%"};
      ${({right:e})=>e?"left: 5%;":"left: 50%; margin-left: -9px;"};
      border-width: 5px;
      border-style: solid;
      ${({down:e,right:t})=>e?"border-color: transparent transparent #fff transparent;":"border-color: #fff transparent transparent transparent;"};
    }
  }

  :hover span {
    visibility: visible;
  }
`,ee=({title:e,tooltipText:t,down:n=!1,right:i=!1,style:r})=>preactH(ei,{down:n,right:i,onClick:a=>a.preventDefault(),style:r},e,preactH("span",null,t));var ti=o.div`
  background-color: #373737;
  border-radius: 50%;
  color: #6b78fc;
  height: 24px;
  margin: 10px 0 0 100px;
  position: absolute;
  width: 24px;
`,oi=o.div`
  align-items: flex-start;
  background-color: #373737;
  border-radius: 100px;
  border: 1px solid #373737;
  display: flex;
  gap: 10px;
`,ni=o.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
`,je=o.div`
  align-self: stretch;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.12px;
  line-height: 16px;
  text-align: center;
  white-space: nowrap;
`,ii=o.div`
  display: flex;
  align-self: stretch;
  color: #fff;
  flex-direction: column;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  height: 16px;
  justify-content: center;
  letter-spacing: 0.14px;
  line-height: 20px;
  text-align: center;
`,ri=o.div`
  height: 40px;
  margin: 1px;
  padding: 0;
  position: absolute;
  width: 40px;
`,si=e=>e.replace("Microsoft","").trim(),Ro=({checked:e,isPremiumVoiceDisabled:t,isPreviewPlaying:n,item:i})=>{let r=E(i),a=()=>{if(r){if(r.personal)return preactH(ci,null,"Custom");if(r.labels?.includes("ai-enhanced"))return preactH(li,null,"AI Enhanced");if(r.labels?.includes("celebrity"))return preactH(ai,null,"Celebrity")}};return preactH(Fragment,null,preactH(oi,null,preactH($,{alt:"",width:"40px",height:"40px",flag:r?.avatarImage??"US.svg",variant:"circle"}),r?.premium&&t&&preactH(ee,{style:{pointerEvents:"auto",marginLeft:"30px",marginTop:"26px",position:"absolute"},title:preactH(H,null),tooltipText:"Upgrade to Premium to access this voice"})),preactH(ni,null,preactH(ii,null,si(r?.displayName??r?.name??"...")),a()),e&&preactH(ti,null,preactH(Re,null)),e&&n&&preactH(ri,null,preactH(Ee,null)))},li=o(je)`
  color: ${P.icnTxtSuccess};
`,ai=o(je)`
  color: ${P.icnTxtAlert};
`,ci=o(je)`
  color: ${()=>P.icnTxtBlue};
`;var To=o.div`
  align-content: center;
  align-items: center;
  align-self: stretch;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 6px 12px 0 12px;
`,pi=o.div`
  align-items: center;
  background-color: ${({checked:e})=>e?"#283750":"#1e1e1e"};
  border-radius: 12px;
  border: ${({checked:e})=>e?"0.5px solid #6B78FC":"0.5px solid #373737"};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  gap: 6px;
  min-width: 138px;
  outline: ${({checked:e})=>e?"1px solid #6B78FC":"none"};
  padding: 8px 4px;
  position: relative;

  &:hover {
    background-color: ${({checked:e})=>e?"#283750":"#2E2E2E"};
    border-color: ${({checked:e})=>e?"#6B78FC":"#505050"};
  }

  &::after {
    content: '';
    position: absolute;
    left: 10px;
    bottom: 2px;
    height: 2px;
    background-color: #8894fe;
    width: ${({previewPercentagePlayed:e})=>e!==null?`calc(${e}% - ${e/100*15}px)`:"0%"};
    border-radius: 2px;
    transition: width 0.3s ease-in-out;
    display: ${({previewPercentagePlayed:e})=>e!==null&&e>0?"block":"none"};
  }
`,Io=({checked:e,idx:t,item:n,isPremiumVoicesDisabled:i,isPreviewPlaying:r,onClick:a,previewPercentagePlayed:p})=>{let m=(0,Eo.useMemo)(()=>E(n),[n]),x=()=>{a(n)};return preactH(pi,{"aria-selected":e,checked:!!e,isPremiumVoiceDisabled:!!(i&&m?.premium),onClick:x,previewPercentagePlayed:r?p:null},preactH(Ro,{checked:!!e,idx:t,isPreviewPlaying:r,item:n,isPremiumVoiceDisabled:!!(i&&m?.premium)}))};l();s();var Te=C(v());l();s();var z=`
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: #8791a0;
  }

  &::-webkit-scrollbar-button {
    display: none;
  }
`;l();s();var Ao=C(de());var di=o.div`
  align-items: flex-start;
  background-color: #373737;
  border-radius: 100px;
  display: flex;
  gap: 10px;
`,mi=o.div`
  align-items: center;
  border-bottom: 0.5px solid #373737;
  display: flex;
  flex: 1 0 0;
  gap: 8px;
  margin-right: 4px;
  padding: 12px 12px 12px 0px;
`,ui=o.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
`,fi=o.div`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  gap: 4px;
  max-width: 184px;
`,gi=o.div`
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.14px;
  line-height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`,xi=o.div`
  align-items: center;
  align-self: stretch;
  color: #afb9c8;
  display: flex;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.14px;
  line-height: 20px;
`,hi=o.div`
  align-items: flex-start;
  border-radius: 0px;
  display: flex;
  gap: 0px;
  padding: 0px;
  width: 20px;
`,Ge=o.div`
  align-items: flex-start;
  background: #1e1e1e;
  border-radius: 4px;
  color: #6b78fc;
  display: flex;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  gap: 2px;
  letter-spacing: 0.12px;
  line-height: 16px;
  padding: 2px 4px;
`,bi=o.div`
  border-radius: 50%;
  height: 40px;
  margin: 0;
  position: absolute;
  width: 40px;
`,Ci=o(Ge)`
  background-color: ${({isSelected:e})=>e?"#1e1e1e":P.bgSuccess};
  color: ${P.icnTxtSuccess};
`,yi=o(Ge)`
  background-color: ${({isSelected:e})=>e?"#1e1e1e":"#5A4015"};
  color: ${P.icnTxtAlert};
`,vi=o(Ge)`
  background-color: ${({isSelected:e})=>e?"#1E1E1E":"#1F2C3E"};
  color: #6b78fc;
`,Si=e=>e.replace("Microsoft","").trim(),Do=({checked:e,isPremiumVoiceDisabled:t,isPreviewPlaying:n,item:i})=>{let r=i?.language?.split("-")[1]??"US",a=E(i),p=()=>{if(a){if(a.personal)return preactH(vi,{isSelected:e},"Custom");if(a.labels?.includes("ai-enhanced"))return preactH(Ci,{isSelected:e},"AI Enhanced");if(a.labels?.includes("celebrity"))return preactH(yi,{isSelected:e},"Celebrity")}};return preactH(Fragment,null,preactH(di,null,preactH($,{alt:"",width:"40px",height:"40px",flag:a?.avatarImage??"US.svg",variant:"circle"})),a?.premium&&t&&preactH(ee,{right:!0,down:!0,style:{pointerEvents:"auto",marginLeft:"30px",marginTop:"26px",position:"absolute"},title:preactH(H,null),tooltipText:"Upgrade to Premium to access this voice"}),n&&preactH(bi,null,preactH(Ee,null)),preactH(mi,null,preactH(ui,null,preactH(fi,null,preactH(gi,null,Si(a?.displayName??a?.name??"...")),p()),preactH(xi,null,r,a?.gender&&a.gender!=="notSpecified"&&` • ${(0,Ao.capitalize)(a.gender)}`)),preactH(hi,null),e&&preactH(Re,{style:{color:"#6B78FC"}})))};var Mo=o(I)`
  overflow-y: scroll;
  margin: 0 3px 0 12px;
  position: relative;

  ${z}
`,wi=o.div`
  align-items: center;
  align-self: stretch;
  background: ${({checked:e})=>e?"#283750":"#1e1e1e"};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  gap: 0px;
  margin-right: 3px;
  opacity: ${({isFreeVoicesDisabled:e})=>e?.5:1};
  padding-left: 12px;

  &:hover {
    background: ${({checked:e})=>e?"#283750":"#2e2e2e"};
  }
`,Vi=o.div`
  align-items: center;
  display: flex;
  gap: 12px;
  position: relative;
  width: 328px;

  &::after {
    content: '';
    position: absolute;
    left: -11px;
    bottom: 1px;
    height: 3px;
    background-color: #8894fe;
    width: ${({previewPercentagePlayed:e})=>e!==null?`calc(${e}% + ${e/100*11}px)`:"0%"};
    border-radius: 2px;
    transition: width 0.3s ease-in-out;
    display: ${({previewPercentagePlayed:e})=>e!==null&&e>0?"block":"none"};
  }
`,Ie=(0,Te.forwardRef)(({checked:e,idx:t,item:n,isFreeVoicesDisabled:i,isPremiumVoicesDisabled:r,isPreviewPlaying:a,onClick:p,previewPercentagePlayed:m},x)=>{let c=(0,Te.useMemo)(()=>E(n),[n]),f=()=>{p(n)};return preactH(wi,{"aria-selected":e,checked:!!e,isFreeVoicesDisabled:!!i&&!c?.premium,isPremiumVoiceDisabled:!!(r&&c?.premium),onClick:f,ref:e?x:null},preactH(Vi,{previewPercentagePlayed:a?m:null},preactH(Do,{checked:!!e,idx:t,isPreviewPlaying:a,item:n,isPremiumVoiceDisabled:!!(r&&c?.premium)})))});l();s();var $o=C(v());l();s();var _o=C(v());l();s();var Bo=e=>preactH(N,{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",...e},preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M3.52654 2.59846C3.27026 2.34218 2.85474 2.34218 2.59846 2.59846C2.34218 2.85474 2.34218 3.27026 2.59846 3.52654L6.07192 7L2.59846 10.4735C2.34218 10.7297 2.34218 11.1453 2.59846 11.4015C2.85474 11.6578 3.27026 11.6578 3.52654 11.4015L7 7.92808L10.4735 11.4015C10.7297 11.6578 11.1453 11.6578 11.4015 11.4015C11.6578 11.1453 11.6578 10.7297 11.4015 10.4735L7.92808 7L11.4015 3.52654C11.6578 3.27026 11.6578 2.85474 11.4015 2.59846C11.1453 2.34218 10.7297 2.34218 10.4735 2.59846L7 6.07192L3.52654 2.59846Z",fill:"white"}));var Pi=o.div`
  align-items: flex-start;
  background-color: #373737;
  border-radius: 100px;
  border: 1px solid #373737;
  display: flex;
  gap: 10px;
`,Li=o.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  flex-direction: column;
`,ki=o.div`
  color: #afb9c8;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.12px;
  line-height: 16px;
  text-align: center;
`,Ri=o.div`
  align-self: stretch;
  color: #fff;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.14px;
  line-height: 20px;
  text-align: center;
`,Ei=o(Bo)`
  align-items: center;
  background: #8791a0;
  border-radius: 100px;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  gap: 10px;
  margin: -4px 0 0 30px;
  opacity: 0;
  padding: 2px;
  position: absolute;
  transition: opacity 0.2s ease-in-out;
`,Ti=e=>e.replace("Microsoft","").trim(),No=({isPremiumVoiceDisabled:e,item:t,onRemove:n})=>{let[i,r]=(0,_o.useState)(!1),a=t?.language?.split("-")[1]??"US",p=E(t),m=(p?.displayName??p?.name??"...").split(" ")[0],x=c=>{c.stopPropagation(),n()};return preactH(Fragment,null,preactH(Pi,{onMouseEnter:()=>r(!0),onMouseLeave:()=>r(!1)},preactH($,{alt:"",width:"40px",height:"40px",flag:p?.avatarImage??"US.svg",variant:"circle"}),preactH(Ei,{onClick:x,style:{opacity:i?1:0}}),p?.premium&&e&&preactH(ee,{style:{pointerEvents:"auto",marginLeft:"30px",marginTop:"26px",position:"absolute"},title:preactH(H,null),tooltipText:"Upgrade to Premium to access this voice"})),preactH(Li,null,preactH(Ri,null,Ti(m)),preactH(ki,null,a)))};var Wo=o.div`
  align-content: flex-start;
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex-wrap: wrap;
  gap: 24px 4px;
  height: 330px;
  padding: 14px 4px;
  overflow: auto;

  ${z}
`,Ii=o.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  gap: 4px;
  max-width: 80px;
  min-width: 80px;
`,Fo=({idx:e,item:t,isPremiumVoicesDisabled:n,onClick:i,onRemove:r})=>{let a=(0,$o.useMemo)(()=>E(t),[t]),p=()=>{r(t)};return preactH(Ii,{onClick:()=>{i(t)}},preactH(No,{idx:e,item:t,isPremiumVoiceDisabled:!!(n&&a?.premium),onRemove:p}))};l();s();l();s();var F=C(v());var Uo=C(vn());function Ai(e){return(t,...n)=>t.key==="Enter"&&e(t,...n)}var Di=o.div`
  display: flex;
  align-items: center;
  width: 255px;

  > div {
    align-items: flex-start;
    border-radius: 8px;
    border: 1.5px solid #6b78fc;
    display: flex;
    flex-direction: column;
    flex: 1 0 0;
    gap: 8px;
    position: relative;
  }

  input {
    background: url('${browser.runtime.getURL("/images/search-icon.svg")}') no-repeat scroll 9px 9px;
    background-position: 10px center;
    background-size: 16px;
    border: none;
    box-sizing: border-box;
    color: #fff;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    outline: none;
    padding: 6px 26px 6px 40px;
    width: 100%;

    &::placeholder {
      color: #8791a0;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
    }
  }

  > div > div:empty {
    display: none;
  }

  > div > div {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% - 5px);
    background: ${P.bgPrimWB};
    z-index: 5000;
    border: none;
    border-top: none;
    max-height: 400px;
    overflow-y: auto;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
    border-radius: 0px 0px 5px 5px;

    max-height: ${({suggestionsMaxHeight:e})=>e};
    overflow-y: auto;

    ${z}

    > ul {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }

    > ul > li {
      padding: 0;
      > button {
        background: ${P.bgPrimWB};
        color: ${P.icnTxtPrim};

        padding: 12px 28px;
        border: none;
        margin: none;
        outline: none;

        text-align: left;
        cursor: pointer;
        width: 100%;
      }

      &:hover > button,
      &:focus > button,
      &.react-autosuggest__suggestion--highlighted > button {
        background: ${P.bgPrimW100};
      }
    }
  }
`,Mi=o(kt)`
  left: 245px;
  margin-top: 0px;
  position: absolute;
`,zo=({suggestions:e,value:t,placeholder:n,onChange:i,onBlur:r,onFocus:a=()=>{},suggestionsMaxHeight:p,autoFocus:m=!1,...x})=>{let c=(0,F.useMemo)(()=>new ge(e,[]),[e]),[f,u]=(0,F.useState)([]),h=(0,F.useRef)(null);return(0,F.useEffect)(()=>{t===""&&Array.isArray(e)&&u(e)},[t,e]),(0,F.useEffect)(()=>{m&&h.current&&h.current.focus()},[m]),preactH(Di,{suggestionsMaxHeight:p},preactH(Uo.default,{suggestions:f,renderSuggestion:d=>preactH("button",{type:"button",onClick:b=>at(i(d))(b),onKeyDown:Ai(()=>i(d))},d),inputProps:{ref:h,value:t,onChange:(d,{newValue:b,method:y})=>!["down","up"].includes(y)&&typeof i=="function"&&i(b),onBlur:(d,b)=>typeof r=="function"&&r(b?.highlightedSuggestion??""),onFocus:a,placeholder:n,...x},shouldRenderSuggestions:d=>e.indexOf(d)===-1,getSuggestionValue:d=>d,onSuggestionsClearRequested:()=>u([]),onSuggestionsFetchRequested:({value:d,reason:b})=>b!=="suggestions-revealed"&&u(c.search(d).sort((y,L)=>y.toLowerCase().localeCompare(L.toLowerCase())))}),t!==""&&preactH(Mi,{onClick:()=>i("")}))};var Bi=o.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  gap: 8px;
  padding: 5px 12px 5.5px 12px;
`,_i=o.button`
  align-items: center;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #afb9c8;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  gap: 0px;
  justify-content: center;
  letter-spacing: 0.14px;
  line-height: 20px;
  padding: 8px;
`,Oo=({searchValue:e,setSearchValue:t})=>preactH(Bi,null,preactH(zo,{"aria-label":J("VOICE_SEARCH_INPUT"),placeholder:"Search for language, accents",suggestions:[],value:e,onChange:t,suggestionsMaxHeight:"250px",autoFocus:!0}),preactH(_i,{onClick:()=>{t(""),xe("/voices")}},"Cancel"));l();s();var O=C(v());l();s();var te=C(de()),Ze=(e,t)=>{try{let n=new Intl.DisplayNames([t],{type:"language"}).of(e);return n?(0,te.capitalize)(n):e}catch{return e}},jo=e=>Array.from(new Set(e.map(t=>t.language))),qe=e=>{let t=e.split("-")[1];if(t&&!/^\d+$/.test(t))return`${t.toUpperCase()}.svg`},Go=e=>{let t=(0,te.groupBy)(e,n=>n.split("-")[0]);return(0,te.map)(t,(n,i)=>{let r=n.map(a=>qe(a)).flatMap(a=>a?[a]:[]);return{id:i,name:Ze(i,i),flags:r}})};var Ni=o.div`
  align-items: center;
  display: flex;
  flex: 1 0 0;
  gap: 4px;
  justify-content: flex-end;
`,$i=o.div`
  align-items: center;
  align-self: stretch;
  background: #1e1e1e;
  border-radius: 0;
  border-top: 0.5px solid #373737;
  display: flex;
  justify-content: space-between;
  margin-left: 9px;
  margin-right: 9px;
  padding: 12px 12px 4px 12px;
`,Wi=o.div`
  color: #fff;
  flex: 1 0 0;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.14px;
  line-height: 20px;
`,Zo=(0,O.forwardRef)(({disableFreeVoices:e,disablePremiumVoices:t,onVoiceSelection:n,previewingVoice:i,previewPercentagePlayed:r,sectionRefs:a,voices:p},m)=>{let{voice:x}=_(),c=(0,O.useMemo)(()=>{let d=p.map(b=>b.language);return d.length>0?d[0].split("-")[0]:"en"},[p]),f=(0,O.useMemo)(()=>Ze(c,c),[c]),u=(0,O.useMemo)(()=>{let d=p.map(b=>qe(b.language)).flatMap(b=>b?[b]:[]);return Array.from(new Set(d))},[p]),h=(0,O.useCallback)(d=>b=>{a[d]=b},[]);return preactH(I,{column:!0,style:{position:"relative"}},c!=="en"&&preactH($i,{ref:h(c)},preactH(Wi,null,f),preactH(Ni,null,u.map(d=>preactH($,{key:d,flag:d,variant:"rectangle",height:12,alt:d})))),preactH(I,{column:!0},p.map((d,b)=>{let y=x&&Y(d,x);return preactH(Ie,{"aria-label":J("VOICE_SELECT_BUTTON")(d.name),checked:y,isFreeVoicesDisabled:e,isPremiumVoicesDisabled:t,key:Ne(d),id:Ne(d),idx:b,isPreviewPlaying:i?.displayName===d.displayName,item:d,onClick:n.bind(null,d),previewPercentagePlayed:r,ref:m})})))});l();s();var oe=C(v());function qo(e,t){let[n,i]=(0,oe.useState)(),r=(0,oe.useRef)(!1),a=p=>p.name.startsWith("PVL:");return(0,oe.useEffect)(()=>{let p=Ct.subscribe(({history:m})=>{if(e&&r.current){let x=m.map(c=>a(c)&&t.some(f=>c.name===f.name)?c:e.find(f=>Y(c,f))).filter(c=>!!c);i(x)}});return yt().then(()=>{r.current=!0}),p},[e]),n}l();s();var ne=C(v());function Ko(e){let[t,n]=(0,ne.useState)(void 0);return(0,ne.useEffect)(()=>{(async()=>{let i=await ye();n(i)})()},[]),(0,ne.useMemo)(()=>(t?.tabs[0]?.categories[0]?.voices??[]).map(i=>e?.find(a=>Y(a,i))).filter(i=>!!i),[e,t])}l();s();var W=C(v());l();s();var Yo=e=>preactH(N,{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",...e},preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M18.0168 4.59663C18.4073 4.98716 18.4073 5.62033 18.0168 6.01084L8.62378 15.4033C8.43623 15.5908 8.18185 15.6962 7.91662 15.6961C7.65139 15.6961 7.39703 15.5907 7.20951 15.4032L1.98324 10.1758C1.59276 9.78519 1.59283 9.15202 1.9834 8.76154C2.37397 8.37106 3.00713 8.37113 3.39761 8.7617L7.91679 13.2819L16.6026 4.59658C16.9932 4.20607 17.6263 4.20609 18.0168 4.59663Z",fill:"#AFB9C8"}));var Fi=o.div`
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-end;
`,Ui=o.button`
  align-items: center;
  background: #1e1e1e;
  border-radius: 8px;
  border: 1px solid #373737;
  cursor: pointer;
  display: flex;
  gap: 12px;
  padding: 8px 12px;
  width: 100%;
  justify-content: space-between;

  &:hover {
    border-color: #505050;
  }
`,zi=o.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  background: #1e1e1e;
`,Oi=o.div`
  display: flex;
`,ji=o.div`
  position: relative;
`,Gi=o.div`
  display: flex;
  flex-direction: column;
  height: 220px;
  overflow-y: auto;
  padding-right: 3px;

  ${z}
`,Zi=o.div`
  background: #1e1e1e;
  border-radius: 8px;
  border: 1.5px solid #6b78fc;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.32);
  height: 222px;
  margin: -50px 12px 0;
  padding: 5px 3px 4px 4px;
  position: absolute;
  width: 312px;
  z-index: 1;
`,qi=o.svg`
  width: 16px;
  height: 16px;
`,Xo=o.span`
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  flex-grow: 1;
  text-align: left;
`,Ki=o.div`
  align-items: center;
  background: ${({selected:e})=>e?"#283750":"#1e1e1e"};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  padding: 8px 20px 8px 12px;

  &:hover {
    background: ${({selected:e})=>e?"#283750":"#2e2e2e"};
  }
`,Jo=({flags:e})=>preactH(Fi,null,e.map(t=>preactH($,{key:t,flag:t,alt:t,variant:"rectangle",height:12}))),Qo=({languages:e,onLanguageChange:t,selectedLanguageId:n})=>{let i=(0,W.useMemo)(()=>e.find(u=>u.id===n),[n,e]);if(!i)return;let[r,a]=(0,W.useState)(!1),p=(0,W.useRef)(null),m=(0,W.useRef)(null),x=()=>a(!r),c=u=>{a(!1),t(u)};(0,W.useEffect)(()=>{if(r&&p.current&&m.current){let u=p.current.getBoundingClientRect(),d=m.current.getBoundingClientRect().top-u.top+p.current.scrollTop;p.current.scrollTop=d-10}},[r]);let f=(0,W.useMemo)(()=>e.map(u=>{let h=u.id===n;return preactH(Ki,{key:u.id,selected:u.id===n,onClick:()=>c(u.id),ref:h?m:null},h&&preactH(Oi,null,preactH(Yo,null)),preactH(Xo,null,u.name),preactH(Jo,{flags:u.flags}))}),[e,n]);return preactH(ji,null,preactH(zi,null,preactH(Ui,{type:"button","aria-haspopup":"true","aria-expanded":r,onClick:x},preactH(Xo,null,i.name),preactH(Jo,{flags:i.flags}),preactH(qi,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16",fill:"none"},preactH("path",{d:"M13 6L8 11L3 6",stroke:"#AFB9C8",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})))),r&&preactH(Zi,null,preactH(Gi,{ref:p},f)))};l();s();var Ho=C(v());var en=(r=>(r.All="All Voices",r.Custom="Custom",r.Recent="Recent",r.Recommended="Featured",r))(en||{}),Yi=o.div`
  align-items: center;
  background: transparent;
  border-radius: 8px;
  border: none;
  color: #afb9c8;
  cursor: pointer;
  display: flex;
  flex: 1 0 0;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  gap: 0px;
  justify-content: center;
  letter-spacing: 0.14px;
  line-height: 20px;
  overflow: hidden;
  padding: 6px 8px;
  white-space: nowrap;
  z-index: 20;

  &[aria-selected='true'] {
    color: #fff;
  }
`,tn=(0,Ho.forwardRef)(({tab:e,selectedTab:t,setSelectedTab:n},i)=>preactH(Yi,{ref:i,"data-testId":e,role:"presentation",onClick:()=>n(e),"aria-selected":t===e?"true":"false"},en[e]));var Xi=o.div`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  height: 380px;
  width: 348px;
`,Ji=o.div`
  align-items: center;
  align-self: stretch;
  background-color: #2d2d2f;
  display: flex;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 16px;
`,Qi=o.div`
  color: #fff;
  flex: 1 0 0;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.07px;
  line-height: 20px;
`,Hi=o.span`
  color: #8894fe;
  cursor: pointer;
`,er=o.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: 20px;
  height: 330px;
  justify-content: center;

  > div {
    color: #afb9c8;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    letter-spacing: 0.14px;
    line-height: 20px;
    max-width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`,tr=o.div`
  background-color: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.32);
  height: 30px;
  left: ${({left:e})=>e}px;
  position: absolute;
  transition: left 0.3s ease-in-out;
  width: ${({width:e})=>e}px;
  z-index: 10;
`,or=o.div`
  display: flex;
  padding: 3px 12px;
  align-items: flex-start;
`,nr=o.div`
  display: flex;
  align-items: flex-start;
  background: #111112;
  border-radius: 10px;
  flex: 1 0 0;
  padding: 4px;
  position: relative;
`;function on({allVoices:e,disablePremiumVoices:t,hasClientVoices:n,onRecentVoiceRemove:i,onVoiceSelection:r,personalVoices:a,previewingVoice:p,previewPercentagePlayed:m,route:x,searchValue:c,setSearchValue:f,voicesByKey:u}){let{voice:h}=_(),d=qo(e,a)?.filter(g=>g.displayName!==h?.displayName),b=Ko(e).slice(0,6),y=(0,w.useRef)(null),L=(0,w.useRef)(null),U=(0,w.useRef)(!1),q=(0,w.useRef)(!1),V=(0,w.useRef)(),S=(0,w.useRef)({}),D=(0,w.useRef)({}),[re,Ce]=(0,w.useState)("en"),[T,se]=(0,w.useState)("Recent"),De=(0,w.useMemo)(()=>d?.length,[d]),Ke=(0,w.useMemo)(()=>!c&&["Recommended"].includes(T),[c,T]),an=(0,w.useMemo)(()=>{let g=jo(e);return Go(g)},[e]);(0,w.useEffect)(()=>{if(T!=="All")return;let g=L.current;if(!g)return;let R=()=>{if(!L.current)return;let B=L.current,le=B.getBoundingClientRect(),ae=[...Object.entries(S.current)].reverse().find(([,K])=>K&&K.getBoundingClientRect().top<=le.top);if(ae){let[K]=ae;Ce(K)}q.current=B.scrollTop>0};return(()=>{if(y.current&&L.current){let B=g.getBoundingClientRect(),le=y.current.getBoundingClientRect(),K=g.scrollTop+(le.top-B.top)-80;g.scrollTo({top:K,behavior:"instant"})}})(),g.addEventListener("scroll",R),()=>{g&&g.removeEventListener("scroll",R)}},[T]),(0,w.useEffect)(()=>{x==="/voices/search"?(V.current=T,se("All")):x==="/voices"&&V.current&&(se(V.current),V.current=void 0)},[x]);let cn=()=>{let R=[{type:"Recommended",condition:!0},{type:"Recent",condition:De},{type:"Custom",condition:a.length>0},{type:"All",condition:!0}],Ye=R.filter(({condition:B})=>B).length;return preactH(or,null,preactH(nr,{role:"tablist","aria-orientation":"horizontal"},R.map(({type:B,condition:le})=>le?preactH(tn,{key:B,ref:ae=>D.current[B]=ae,tab:B,selectedTab:T,setSelectedTab:se}):null),preactH(tr,{left:D.current[T]?.offsetLeft??0,width:316/Ye})))};(0,w.useEffect)(()=>{!U.current&&d&&!De&&(se("Recommended"),U.current=!0)},[De,d,h]);let Me=g=>{if(!h||!g)return!1;if(g.personal){if(h.name===g.name)return!0}else if(h.displayName===g.displayName)return!0;return!1},pn=g=>{Ce(g),g==="en"?L.current?.scrollTo({top:0,behavior:"instant"}):S.current[g]?.scrollIntoView({behavior:"instant"})},dn=g=>{d?.length===1&&se("Recommended"),i(g)},mn=()=>{let g=Lt();if(!g){fe("extension_no_client_voices_notification_shown",{action:"no download url"});return}fe("extension_no_client_voices_notification_shown",{action:"download"}),ct(g)},un=()=>{if(T==="All"&&x!=="/voices/search")return preactH(Qo,{languages:an,onLanguageChange:pn,selectedLanguageId:re})},fn=()=>a.map((g,R)=>preactH(Ie,{checked:Me(g),idx:R,isFreeVoicesDisabled:!n,isPremiumVoicesDisabled:t,isPreviewPlaying:p?.name===g.name,previewPercentagePlayed:m,item:g,key:g.displayName,onClick:r})),gn=()=>d?.map((g,R)=>preactH(Fo,{checked:Me(g),idx:R,isPremiumVoicesDisabled:t,item:g,key:g.displayName,onClick:r,onRemove:dn})),xn=()=>b.map((g,R)=>preactH(Io,{checked:Me(g),idx:R,isPremiumVoicesDisabled:t,isPreviewPlaying:p?.displayName===g.displayName,previewPercentagePlayed:m,item:g,key:g.displayName,onClick:r})),hn=()=>{if(c.length>0||T==="All")return preactH(Fragment,null,Object.entries(u).map(([g,R])=>g!=="Custom"&&preactH(Zo,{key:g,disableFreeVoices:!n,disablePremiumVoices:t,onVoiceSelection:r,previewingVoice:p,previewPercentagePlayed:m,ref:y,sectionRefs:S.current,selectedVoice:h,voices:R})),Object.entries(u).length===0&&preactH(er,null,preactH(ko,null),preactH("div",null,"No results found for ",c)));switch(T){case"Custom":return fn();case"Recent":return gn();case"Recommended":return xn()}},bn=()=>{let g=T==="Recent"?Wo:Ke?To:Mo,R=T==="Recent"?{}:{column:!Ke};return preactH(g,{key:`${T}-${c}`,...R,ref:L},hn())};return preactH(Xi,null,x==="/voices/search"&&preactH(Oo,{searchValue:c,setSearchValue:f}),x!=="/voices/search"&&cn(),!n&&T==="All"&&preactH(Ji,null,preactH(dt,null),preactH(Qi,null,"No voices available on your device.",preactH("br",null),preactH(Hi,{onClick:mn},"Download a language pack")," ","to enable speech.")),un(),bn())}var nn=e=>e.normalize("NFD").replace(/[\u0300-\u036f]/g,""),ir=()=>{let[e,t]=j([]),[n,i]=j([]),[r,a]=j();G(()=>{let c=async()=>{let[u,h]=await Promise.all([ye(),et()]);t(h);let d=u.tabs.find(b=>b.displayName==="All");d&&a(d)},f=async()=>{let u=await tt({forceRefetch:!0});i(u)};c(),f()},[]),G(()=>{let c=bt.on("updated",({personalVoiceList:f})=>{i(f)});return()=>c()});let p=Z(()=>r?.categories??[],[r]),m=Z(()=>r?.categories?.flatMap(c=>{let f=e.filter(u=>c.localVoices.languages.includes(u.language.split("-")[0]));return[...c.voices,...f].map(u=>({...u,category:c.displayName}))})??[],[r]),x=me(c=>{let f=p.find(h=>h.displayName===c)??null;if(!f)return[];let u=e.filter(h=>f.localVoices.languages.includes(h.language.split("-")[0]));return[...f.voices,...u].map(h=>({...h,category:f.displayName}))},[p]);return{categories:p,allVoices:m,getVoicesForCategory:x,personalVoices:n}},rr=(e,t)=>{let[n,i]=j(0),[r,a]=j(),p=me((c,f)=>pe("/tts/get-audio",{voice:c,ssml:f}),[]);return G(()=>{(e==="playing"||e==="buffering"||e==="errored")&&(i(0),a(void 0))},[e]),G(()=>{let c=()=>{i(100),a(void 0)};return t&&t.addEventListener("ended",c),()=>{t&&t.removeEventListener("ended",c)}},[t]),G(()=>{if(!t)return;let c=()=>{if(t.duration){let f=t.currentTime/t.duration*100;i(f)}else i(0)};return t.addEventListener("timeupdate",c),()=>{t.removeEventListener("timeupdate",c)}},[t]),{percentagePlayed:n,playPreview:c=>{if(t&&(t.pause(),i(0),a(void 0)),!t)return;if(c.previewAudio){t.src=c.previewAudio,t.play().then(()=>a(c));return}if(c.engine!==He)return p(c,`<speak>${_e(c)}</speak>`).then(({audioData:u})=>{t.src=u,t.play().then(()=>a(c))});let f=new SpeechSynthesisUtterance(_e(c));f.voice=speechSynthesis.getVoices().find(u=>u.name?.toLowerCase()===c.name?.toLowerCase())??null,speechSynthesis.cancel(),setTimeout(()=>{speechSynthesis.speak(f),a(c)},250)},previewingVoice:r,stopPreview:()=>{t?t.pause():speechSynthesis.cancel(),i(0),a(void 0)}}};function Ae({audioPlayer:e,hasClientVoices:t,route:n}){let[i,r]=j(""),a=Ve(),{allVoices:p,personalVoices:m}=ir(),x=Z(()=>{if(!Array.isArray(p)||!Array.isArray(m))return new ge([],[]);let V=[...p.map(S=>({...S,normalizedDisplayName:nn(S.displayName)})),...m.map(S=>({...S,category:"Custom",normalizedDisplayName:nn(S.displayName)}))];return new ge(V,["displayName","normalizedDisplayName","category"])},[p,m]),c=Z(()=>lr(x,i),[i,x]),f=Z(()=>a&&$e(a),[a]),u=X.getPlayingState(),{percentagePlayed:h,playPreview:d,previewingVoice:b,stopPreview:y}=rr(u,e);G(()=>()=>{y()},[]);let L=me(V=>{pe("/user-settings/remove-voice-from-history",{voice:V})},[]),U=me(async V=>{let S=E(V),D=await Xe();if(!(Vt(D)&&S.premium)){if(!$e(D)&&S.premium){if(St(D)||D.status==="expired")return await ft(!0),we("popup_voice_switch","premium_voices");if(wt(D)){let Ce=new Date(D.currentBatchExpiresAt*1e3).toLocaleDateString("en-US",{month:"long",day:"numeric"});return We(`You are out of your 450k premium words for this month, you'll get access to more on ${Ce}`,{})}}u!=="playing"&&(b?y():d(S)),S.labels?.includes("beta")&&We("This voice is still in beta which might lead to longer load times in some instance.",{duration:8e3}),await it(V,{isUserSelection:!0})}},[f,b,u]),q=Z(()=>{let V={};return Object.keys(c).forEach(S=>{V[S]=f?c[S]:sr(c[S])}),V},[c,f]);return preactH(on,{allVoices:p,disablePremiumVoices:!f,hasClientVoices:t,onRecentVoiceRemove:L,onVoiceSelection:U,personalVoices:m,previewingVoice:b,previewPercentagePlayed:h,route:n,searchValue:i,setSearchValue:r,voicesByKey:q})}function sr(e){let t=e.map(E),n=t.filter(r=>r.premium);return[...t.filter(r=>!r.premium),...n]}function lr(e,t){let n={};return e.search(t).forEach(i=>{n[i.category]??=[],n[i.category].push(i)}),n}var sn={route:"/",defaultRoute:"/",collapseState:"collapsed",allowCollapse:!0,isPlayerMinimized:!1},ie=new rn.Store({...sn});function Xp(){ie.set(()=>({...sn}))}function xe(e){ie.set(()=>({route:e}))}var ln={"/pillreport":{name:"Report",render:ze},"/featureprompt/skipsentences":{name:"How to Skip Sentences?",render:Ue},"/speed":{name:"Select Speed",render:So},"/unsupported":{name:"Unsupported Website",render:Vo},"/voices":{name:"Select Voice",render:Ae},"/voices/search":{name:"Select Voice",render:Ae}};function Jp(e){return ln[e]?.render}function Qp(e){return ln[e]??{}}function Po(e){ie.get().allowCollapseModified||ie.set(()=>({allowCollapse:e,collapseState:"expanded"}))}function Lo(e){ie.get().allowCollapseModified||ie.set(()=>({hidePlayerPill:e}))}export{mr as a,ie as b,Xp as c,xe as d,Jp as e,Qp as f};
//# sourceMappingURL=chunk-Z4JSAUZD.js.map
