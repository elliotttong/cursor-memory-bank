import{a as D}from"./chunk-ACZR26GY.js";import{a as d}from"./chunk-TVWAVI6A.js";import{s as x}from"./chunk-LBZ34ZL2.js";import"./chunk-SI7CO4VP.js";import"./chunk-JAWPO7FD.js";import"./chunk-N3ET5YJZ.js";import"./chunk-LXDXREIX.js";import"./chunk-PJRECGUK.js";import{Ac as s,Wc as l,Xc as h,b as c,c as f,db as m,f as g,lb as u}from"./chunk-6VFX2JNU.js";import"./chunk-LUKOAFYK.js";import"./chunk-O77QQVYU.js";import"./chunk-35EEQS33.js";import"./chunk-BGIN6QNH.js";import"./chunk-UQBFOPQH.js";import"./chunk-6HLOLWYC.js";import"./chunk-XFWXZVUM.js";import"./chunk-D2ACMGPV.js";import{b as r,k as i}from"./chunk-NORECDYR.js";import"./chunk-RQERJHUS.js";import{f as browser,h as e,j as preactH,o as n}from"./chunk-NUN3A7RC.js";n();e();n();e();var y=f(async(t,o)=>c("/lms/get-integration-credential",{userId:t,provider:o}));n();e();function C(t,o){return t.getFullYear()===o.getFullYear()&&t.getMonth()===o.getMonth()&&t.getDate()===o.getDate()}n();e();var A=i(m)`
  width: 512px;
  height: 48px;
  position: fixed;
  top: 64px !important;
  left: 50%;
  pointer-events: auto;
  transform: translateX(-50%);
  display: inline-flex;
  padding: 8px 24px 8px 8px;
  align-items: center;
  gap: 8px;
  border-radius: 12px;
  box-sizing: border-box;
  background: ${r.bgPrimWB};
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.04), 0px 2px 6px 0px rgba(0, 0, 0, 0.04),
    0px 16px 24px 0px rgba(0, 0, 0, 0.06);
  @keyframes slide-down {
    from {
      transform: translate(-50%, -100%);
    }
    to {
      transform: translate(-50%, 0);
    }
  }
  animation: slide-down 0.25s ease-out;
`,I=i(u)`
  font-family: 'ABCDiatype';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.14px;
  color: #ffffff;
`,_=i(x)`
  position: absolute;
  top: 16px;
  right: 8px;
  width: 12px;
  height: 12px;
  min-width: 12px;
  min-height: 12px;
  svg {
    width: 10px;
    height: 10px;
    min-width: 12px;
  }
`,T=i("a")`
  display: flex;
  width: 74px !importat;
  height: 24px;
  padding: 8px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  font-family: 'ABCDiatype';
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px; /* 133.333% */
  letter-spacing: 0.12px;
  border-radius: 4px;
  box-sizing: border-box;
  background: ${r.sfActElectricBlue};
  &:hover {
    background: '#9BA3FF';
  }
  &:active {
    background: '#6870CC';
  }
`,E=i(d)`
  width: 32px;
  height: 32px;
  padding: 4px;
  box-sizing: border-box;
  align-items: flex-start;
  border-radius: 50px;
  background: #283750;
`,v=({dismiss:t})=>{let o=async()=>{let{"notif-analytics":{"canvas-upsell":a={}}={}}=await browser.storage.local.get(["notif-analytics"]);await browser.storage.local.set({"notif-analytics":{"canvas-upsell":{...a,lastDisplayedAt:new Date().getTime(),dismissedCount:(a.dismissedCount||0)+1}}}),s("extension_canvas_upsell_dismissed"),l("canvas-notification"),t()};return preactH(A,null,preactH(E,{src:"logo.svg",alt:"Speechify Logo"}),preactH(I,null,"Connect Canvas to Speechify and listen to your readings"),preactH(T,{onClick:()=>{s("extension_canvas_upsell_synced"),l("canvas-notification")},target:"_blank",rel:"noopener noreferrer",href:"https://app.speechify.com/settings?tab=Integrations&integration=canvas"},"Sync now"),preactH(_,null,preactH(D,{color:r.brdrPrimInv8010,onClick:o})))};var k=()=>document.querySelector(".ic-app-header__logomark")&&document.querySelector(".ic-app-header__menu-list");async function M(){let{"notif-analytics":{"canvas-upsell":t={}}={}}=await browser.storage.local.get(["notif-analytics"]);if(!!!k())return;let p=await g(),a=await y(p.uid,"lms.canvas"),w=C(new Date,new Date(t.lastDisplayedAt||0)),S=t.dismissedCount>=3;!a&&!w&&!S&&h({id:"canvas-notification",priority:151,duration:200,showOnMobile:!1,global:!0,allowPointerActions:!0,render:({dismiss:N})=>preactH(v,{dismiss:N})})}var pt=M;export{pt as default};
//# sourceMappingURL=init-LQWHWGPL.js.map
