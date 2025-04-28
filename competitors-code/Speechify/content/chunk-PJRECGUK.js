import{$a as R,Qc as v,Wc as r,Xc as S,Yc as w,_a as h,d as O,e as I,f as g,gb as C}from"./chunk-6VFX2JNU.js";import{r as u,v as m}from"./chunk-LUKOAFYK.js";import{a as f,k as t,l as x}from"./chunk-NORECDYR.js";import{g as J}from"./chunk-RQERJHUS.js";import{d as H,f as browser,h as o,j as preactH,o as i}from"./chunk-NUN3A7RC.js";i();o();i();o();var z=H(J());i();o();var N="speechify-global-notifications",d=e=>{let s=document.getElementById(N)?.shadowRoot;if(s){let l=s.querySelectorAll(".scrollable");for(let a of l)if(e.composedPath().some($=>$===a))return}e.preventDefault()},L=()=>{let e=document.getElementById(N);e&&e.shadowRoot?(window.addEventListener("wheel",d,{passive:!1}),window.addEventListener("touchmove",d,{passive:!1})):setTimeout(L,100)},y=e=>{let n=window.open(e,"_blank","noopener noreferrer");n&&(n.opener=null)},A=()=>{window.removeEventListener("wheel",d),window.removeEventListener("touchmove",d)};i();o();var k=t.div`
  align-items: center;
  background-color: rgba(5, 7, 11, 0.5);
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 2147483645;
`,M=t.div`
  align-items: center;
  background: #111112;
  border-radius: 12px;
  display: inline-flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 436px;
  justify-content: center;
  padding: 20px 88px;
  position: relative;
`,P=t.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 16px;
  cursor: pointer;
`,_=t.div`
  width: 380px;
  display: flex;
  flex-direction: column;
  align-items: center;
`,G=t.div`
  align-items: center;
  background: #4759f7;
  border-radius: 13px;
  display: flex;
  gap: 10px;
  justify-content: center;
  padding: 4px;
  margin-bottom: 24px;
`,T=t.div`
  align-self: stretch;
  color: #fff;
  font-size: 36px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: -0.72px;
  line-height: 44px;
  margin-bottom: 8px;
  text-align: center;
`,F=t.div`
  align-self: stretch;
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: -0.08px;
  line-height: 24px;
  margin-bottom: 24px;
  text-align: center;
`,B=t.div`
  align-items: center;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: 16px;
`,U=t.button`
  align-items: center;
  align-self: stretch;
  background: #fff;
  border-radius: 12px;
  border: none;
  color: #000;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  gap: 0px;
  height: 48px;
  justify-content: center;
  letter-spacing: -0.08px;
  line-height: 24px;
  padding: 12px 36px;
`,W=t.div`
  align-items: center;
  align-self: stretch;
  color: #fff;
  display: flex;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  gap: 4px;
  justify-content: center;
  letter-spacing: -0.07px;
  line-height: 20px;
`,j=t.div`
  align-items: center;
  border-radius: 10px;
  color: #8894fe;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  gap: 0px;
  justify-content: center;
  letter-spacing: -0.07px;
  line-height: 20px;
  padding: 0px;
`;function E({close:e}){(0,z.useEffect)(()=>(L(),window.addEventListener("keydown",n),()=>{A(),window.removeEventListener("keydown",n)}),[]);let n=c=>{c.key==="Escape"&&a()},s=()=>{y(x(`onboarding/sign-in?extensionId=${browser.runtime.id}&redirect-to=web-app`,f.onboardingUrl))},l=()=>{y(x(`onboarding/?extensionId=${browser.runtime.id}&redirect-to=web-app`,f.onboardingUrl))},a=()=>{e()};return preactH(k,{onClick:c=>{c.target===c.currentTarget&&a()}},preactH(M,null,preactH(P,{onClick:a},preactH("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 20 20",fill:"none"},preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M4.87361 3.45952C4.48309 3.06899 3.84992 3.06899 3.4594 3.45952C3.06887 3.85004 3.06887 4.48321 3.4594 4.87373L8.58562 9.99996L3.4594 15.1262C3.06887 15.5167 3.06887 16.1499 3.4594 16.5404C3.84992 16.9309 4.48309 16.9309 4.87361 16.5404L9.99984 11.4142L15.1261 16.5404C15.5166 16.9309 16.1498 16.9309 16.5403 16.5404C16.9308 16.1499 16.9308 15.5167 16.5403 15.1262L11.4141 9.99996L16.5403 4.87373C16.9308 4.48321 16.9308 3.85004 16.5403 3.45952C16.1498 3.06899 15.5166 3.06899 15.1261 3.45952L9.99984 8.58575L4.87361 3.45952Z",fill:"white"}))),preactH(_,null,preactH(G,null,preactH("svg",{xmlns:"http://www.w3.org/2000/svg",width:"60",height:"60",viewBox:"0 0 60 60",fill:"none"},preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M13.6244 22.4053C15.1497 20.1763 16.4725 19.0741 18.453 19.6864C19.6514 20.0569 20.1433 21.5867 19.6514 23.5063C18.7864 26.8816 18.453 28.819 18.453 31.1249C21.4952 24.7484 27.1191 16.2734 29.5564 13.4229C31.2411 11.4526 33.6559 11.7039 34.5649 12.1433C36.042 12.8574 36.12 14.4057 35.6102 15.8865C32.0829 26.1308 31.9601 31.6022 31.527 36.9177C33.7191 31.0225 36.3844 25.4772 39.603 21.5718C40.9591 19.6986 43.3359 19.1106 44.8371 19.7191C46.3384 20.3276 46.6806 21.7834 46.3384 23.6078C45.4461 28.3653 45.0033 30.5951 45.0033 32.4381C46.6335 31.1912 47.9316 30.1378 50.8993 29.897C53.8669 29.6562 60 30.8377 60 30.8377C60 30.8377 56.4594 31.4393 54.5894 31.8979C50.7556 32.838 49.4168 33.9374 46.9351 37.572C46.214 38.6281 45.0033 39.439 43.6392 39.3358C42.2751 39.2327 41.3593 38.3746 40.9591 37.2157C40.4029 35.605 40.2376 33.1957 40.9591 27.9818C37.4234 33.3611 35.6102 40.6682 33.1876 45.5139C32.5682 46.7529 31.5103 48.1647 30.0767 48.1647C28.643 48.1647 26.7839 47.6087 26.5425 43.3492C25.9243 32.4381 27.9855 23.7553 27.9855 23.7553C23.9707 30.1211 22.6885 33.8317 21.292 35.7667C19.8955 37.7016 18.5404 39.3772 16.892 39.3358C15.2437 39.2945 14.2844 37.4517 14.0758 35.7667C13.8672 34.0816 13.8072 31.9296 14.4164 27.9818C12.8306 29.5676 11.4362 30.6416 8.93904 31.3141C6.44186 31.9866 3.45993 31.5586 0 30.8377C3.45993 30.8377 9.28245 28.7503 13.6244 22.4053Z",fill:"white"}))),preactH(T,null,"Welcome to Speechify"),preactH(F,null,"Listen anywhere with natural",preactH("br",null),"AI voices and more"),preactH(B,null,preactH(U,{"data-testid":C.SIGNUP_SIGNIN_PROMPT,onClick:l},"Create Account"),preactH(W,null,"Already have an account?",preactH(j,{"data-testid":C.LOGIN_SIGNIN_PROMPT,onClick:s},"Log in"))))))}async function Q(){let e=await X();return()=>e()}var D=null,b="",Y=!1,Ae=O({events:["check"]}),K=async e=>{e?r("force-login"):Y&&!e&&(p(),m("destroy",{},"paragraph-player"),m("destroy",{},"sentence-player")),Y=e},X=async()=>{b=location.href;let e=await h.registerHook("BEFORE_PLAY",async()=>{p()});u("browser-action",async()=>{p()},"force-login"),u("toggle-force-login",async()=>{p()},"force-login"),document.addEventListener("visibilitychange",q);let n=I.on("userupdate",async l=>{K(!!v(l))}),s=new MutationObserver(te);return s.observe(document,{subtree:!0,childList:!0}),()=>{document.removeEventListener("visibilitychange",q),s.disconnect(),e(),n()}},p=async()=>{let{currentContent:e}=R.getBundleState();await V()?r("force-login"):(h.pause(),(w()?.current?.id!=="force-login"||D!==e?.metadata.source)&&(ee(),D=e?.metadata.source??null))},ee=async()=>{r("force-login"),r("checklist"),r("salience"),r(),w()?.current?.id!=="force-login"&&S({id:"force-login",priority:151,duration:0,showOnMobile:!1,timeSensitive:!0,wrapperPadding:"0",global:!0,allowPointerActions:!1,render:({dismiss:e})=>preactH(E,{close:e})})},V=async()=>{let e=await g();return v(e)},q=async()=>{g.invalidateCache();let e=await V();K(!!e)},te=async()=>{b!==location.href&&r("force-login"),b=location.href};export{Q as a,Ae as b};
//# sourceMappingURL=chunk-PJRECGUK.js.map
