import{a as J,b as Q}from"./chunk-SI7CO4VP.js";import{b as D}from"./chunk-JAWPO7FD.js";import{e as v}from"./chunk-N3ET5YJZ.js";import{a as B,b as A}from"./chunk-LXDXREIX.js";import{b as Z}from"./chunk-PJRECGUK.js";import{Ac as o1,Bb as z,Cb as Y,Db as j,Dc as t1,Eb as X,Fb as N,Qc as y,Xc as e1,b as V,cc as H,db as x,f as P,fb as g,gb as u,lb as K,sa as G}from"./chunk-6VFX2JNU.js";import{v as W}from"./chunk-LUKOAFYK.js";import{b as $}from"./chunk-O77QQVYU.js";import{x as b}from"./chunk-35EEQS33.js";import{d as q}from"./chunk-XFWXZVUM.js";import{a as l}from"./chunk-D2ACMGPV.js";import{a as F,b as s,k as c}from"./chunk-NORECDYR.js";import{g as _}from"./chunk-RQERJHUS.js";import{d as O,h as i,j as preactH,k as Fragment,o as r}from"./chunk-NUN3A7RC.js";r();i();var k={shouldShowBookmarkFeatureHint:"SHOULD_SHOW_BOOKMARK_FEATURE_HINT",shouldShowChatGPTPlayer:"SHOULD_SHOW_CHATGPT_PLAYER",shouldPlayButtonHint:"SHOULD_SHOW_PLAY_BUTTON_HINT"},n1=$("once-off-flags",{getInitialState:async()=>({SHOULD_SHOW_BOOKMARK_FEATURE_HINT:!0,SHOULD_SHOW_CHATGPT_PLAYER:!0,SHOULD_SHOW_PLAY_BUTTON_HINT:[]})}),$1=async o=>{let t=await n1.get(o);return o===k.shouldPlayButtonHint?Array.isArray(t)?t:[]:!!t},i1=async(o,t)=>{if(o===k.shouldPlayButtonHint&&!Array.isArray(t))throw new Error("shouldPlayButtonHint must be a string array");if(o!==k.shouldPlayButtonHint&&typeof t!="boolean")throw new Error(`${o} must be a boolean value`);return n1.set(o,t)};r();i();var C1=O(_());r();i();var r1=o=>preactH(l,{width:"20",height:"20",viewBox:"0 0 20 20",fill:"currentColor",...o,xmlns:"http://www.w3.org/2000/svg"},preactH("g",{"clip-path":"url(#clip0_20782_8472)"},preactH("circle",{cx:"10",cy:"10",r:"10",fill:"transparent",stroke:"currentColor"}),preactH("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M11.5 5.83334C11.1318 5.83334 10.8333 6.13182 10.8333 6.50001V13.5C10.8333 13.8682 11.1318 14.1667 11.5 14.1667H12.6667C13.0349 14.1667 13.3333 13.8682 13.3333 13.5V6.50001C13.3333 6.13182 13.0349 5.83334 12.6667 5.83334H11.5ZM7.33341 5.83335C6.96522 5.83335 6.66675 6.13183 6.66675 6.50002V13.5C6.66675 13.8682 6.96522 14.1667 7.33341 14.1667H8.50008C8.86827 14.1667 9.16675 13.8682 9.16675 13.5V6.50002C9.16675 6.13183 8.86827 5.83335 8.50008 5.83335H7.33341Z",className:"icon-background-fill",fill:"currentColor"})),preactH("defs",null,preactH("clipPath",{id:"clip0_20782_8472"},preactH("rect",{width:"20",height:"20",fill:"currentColor"})))),l1=o=>preactH(l,{xmlns:"http://www.w3.org/2000/svg",width:"20px",height:"20px",viewBox:"0 0 20 20",...o},preactH("g",{"clip-path":"url(#clip0_20782_8469)"},preactH("circle",{cx:"10",cy:"10",r:"10",fill:"transparent",stroke:"currentColor","stroke-width":"1.66667"}),preactH("path",{d:"M13.75 9.2783C14.3056 9.59905 14.3056 10.4009 13.75 10.7217L8.75002 13.6084C8.19447 13.9292 7.50002 13.5282 7.50002 12.8867L7.50002 7.11323C7.50002 6.47173 8.19447 6.07079 8.75002 6.39154L13.75 9.2783Z",fill:"currentColor"})),preactH("defs",null,preactH("clipPath",{id:"clip0_20782_8469"},preactH("rect",{width:"20",height:"20",fill:"white"}))));r();i();var I=O(_());var M=o=>async(...t)=>{let e=await P();y(e)?o?.(...t):W("toggle-force-login")};function Q1(o){let t=(0,I.useRef)(o);return t.current=o,(0,I.useCallback)((...n)=>M(t.current)(...n),[])}r();i();var C=O(_());r();i();var a1=o=>preactH(l,{className:"icon--save",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",...o},preactH("path",{d:"M6.735 20.68c.484 0 .78-.25 1.492-.906l3.422-3.243c.156-.148.258-.187.351-.187.102 0 .203.039.36.187l3.742 3.555c.375.352.68.594 1.164.594.664 0 1.203-.414 1.203-1.328V5.992c0-1.734-.914-2.671-2.64-2.671h-7.65c-1.726 0-2.647.937-2.647 2.671v13.36c0 .914.546 1.328 1.203 1.328zm.773-2.75c-.094.086-.187.039-.187-.078V6.149c0-.672.343-1.04 1.054-1.04h7.258c.711 0 1.055.368 1.055 1.04v11.703c0 .117-.094.164-.188.078l-3.593-3.328c-.29-.266-.579-.422-.907-.422-.32 0-.61.148-.906.422z"})),s1=o=>preactH(l,{className:"icon--save",viewBox:"0 0 21 20",xmlns:"http://www.w3.org/2000/svg",...o},preactH("g",{"clip-path":"url(#clip0_17880_17248)"},preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M16.5 1C17.0523 1 17.5 1.44772 17.5 2V4H19.5C20.0523 4 20.5 4.44772 20.5 5C20.5 5.55228 20.0523 6 19.5 6H17.5V8C17.5 8.55228 17.0523 9 16.5 9C15.9477 9 15.5 8.55228 15.5 8V6H13.5C12.9477 6 12.5 5.55228 12.5 5C12.5 4.44771 12.9477 4 13.5 4H15.5V2C15.5 1.44772 15.9477 1 16.5 1ZM6.16667 4C5.79848 4 5.5 4.29848 5.5 4.66667L5.50003 15.7589L9.99613 13.1362C10.3075 12.9546 10.6925 12.9546 11.0039 13.1362L15.5 15.7589V12C15.5 11.4477 15.9477 11 16.5 11C17.0523 11 17.5 11.4477 17.5 12V17.5C17.5 17.858 17.3086 18.1888 16.9981 18.3671C16.6876 18.5454 16.3054 18.5442 15.9961 18.3637L10.5 15.1577L5.00391 18.3637C4.69462 18.5442 4.31247 18.5454 4.00198 18.3671C3.69148 18.1888 3.50004 17.858 3.50004 17.5L3.5 4.66667C3.5 3.19391 4.6939 2 6.16667 2H10.5C11.0523 2 11.5 2.44772 11.5 3C11.5 3.55228 11.0523 4 10.5 4H6.16667Z",fill:"#F1F4F9"})),preactH("defs",null,preactH("clipPath",{id:"clip0_17880_17248"},preactH("rect",{width:"20",height:"20",fill:"white",transform:"translate(0.5)"})))),E=o=>preactH(l,{xmlns:"http://www.w3.org/2000/svg",style:{display:"block",shapeRendering:"auto",animationPlayState:"running",animationDelay:"0s"},viewBox:"0 0 100 100",preserveAspectRatio:"xMidYMid",...o},preactH("circle",{cx:"50",cy:"50",fill:"none",stroke:"currentColor",strokeWidth:"9",r:"35",strokeDasharray:"164.93361431346415 56.97787143782138",style:{animationPlayState:"running",animationDelay:"0s"}},preactH("animateTransform",{attributeName:"transform",type:"rotate",repeatCount:"indefinite",dur:"1s",values:"0 50 50;360 50 50",keyTimes:"0;1",style:{animationPlayState:"running",animationDelay:"0s"}}))),d1=o=>preactH(l,{className:"icon--saved",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",...o},preactH("path",{d:"M0 0h24v24H0z",fill:"none"}),preactH("path",{d:"M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"})),c1=o=>preactH(l,{className:"icon--saved",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 21 20",...o},preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M6.16667 2C4.6939 2 3.5 3.19391 3.5 4.66667L3.50004 17.5C3.50004 17.858 3.69148 18.1888 4.00198 18.3671C4.31247 18.5454 4.69462 18.5442 5.00391 18.3637L10.5 15.1577L15.9961 18.3637C16.3054 18.5442 16.6876 18.5454 16.9981 18.3671C17.3086 18.1888 17.5 17.858 17.5 17.5L17.5 4.66666C17.5 3.1939 16.3061 2 14.8333 2H6.16667ZM14.6912 7.09895C15.0817 6.70843 15.0817 6.07526 14.6912 5.68474C14.3007 5.29421 13.6675 5.29421 13.277 5.68474L9.49105 9.47068L7.72322 7.70284C7.3327 7.31232 6.69953 7.31232 6.30901 7.70284C5.91848 8.09337 5.91848 8.72653 6.30901 9.11706L8.78395 11.592C8.97148 11.7795 9.22584 11.8849 9.49105 11.8849C9.75627 11.8849 10.0106 11.7795 10.1982 11.592L14.6912 7.09895Z",fill:"#23ae75"})),u1=o=>preactH(l,{className:"icon--saved",width:"24",height:"14",viewBox:"0 0 24 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",...o},preactH("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M5.22696 4.65836L5.80398 3.89919C6.06556 3.55503 6.49573 3.39327 6.91279 3.48223C7.23571 3.5511 7.44294 3.87484 7.37564 4.20532C7.37007 4.23267 7.36267 4.2596 7.35353 4.28593C6.87417 5.66174 6.72157 6.57045 6.89573 7.01206C7.6127 6.1402 11.2755 0.455032 12.4331 0.185163C12.8196 0.0950629 13.2043 0.342673 13.2923 0.738235C13.3221 0.872059 13.3147 1.01175 13.2709 1.14147C12.177 4.37839 11.7139 6.33566 11.8815 7.01328C12.4592 6.18133 13.3173 5.06161 14.4558 3.6541C14.8834 3.1254 15.5657 2.88848 16.2194 3.04165C16.7942 3.17634 17.1535 3.76244 17.022 4.35074C17.0211 4.3546 17.0203 4.35847 17.0193 4.36233C16.6232 6.04859 16.4763 7.03515 16.5788 7.32206C16.624 7.28683 16.6699 7.25069 16.7166 7.21365C17.2387 6.79887 17.8925 6.59673 18.5517 6.64625L23.6666 7.03037L20.2778 7.42475C19.3318 7.53486 18.4652 8.01931 17.8636 8.77458L17.0526 9.7925C16.7871 10.1258 16.3792 10.3052 15.9603 10.2729C15.544 10.2408 15.1999 9.92834 15.1193 9.50924C14.9213 8.47977 14.8895 7.26461 15.0242 5.86379C14.0066 7.41982 13.1237 9.65766 12.3755 12.5773C12.2469 13.0794 11.8036 13.4294 11.2964 13.4294C10.8122 13.4294 10.4155 13.0357 10.4006 12.5403L10.1764 5.07467L8.00769 9.4487C7.78198 9.9039 7.28535 10.1468 6.79748 10.0406C6.28062 9.92812 5.85305 9.55844 5.65833 9.05571L5.41532 8.42828C5.07145 7.54049 4.29536 6.90431 3.37375 6.75476C2.36025 6.5903 1.34675 6.42584 0.333252 6.26139L2.59077 6.09798C3.62933 6.0228 4.58772 5.49943 5.22696 4.65836Z",fill:"#2137FC"}));var p1=o=>{V("/library/open",{url:o})};var S1=()=>{window.open(F.speechifyWebApp.baseUrl,"_blank")},T1=async o=>{let t=await N();if(!t||t==="saving")return;if(t==="saved"){if(b()){let n=await X();p1(`speechify://speechify.page.link/record/${n}`)}else S1();return}if(H())return;let e=await j();e&&(await P1(),t1({timeBeforeSave:e.timeBeforeSave,triggeredFrom:o||"Heading Player"}))};async function P1(){let o=await Y(window.location.href),{SavedToMobileNotification:t}=await import("./SavedToMobile-Q4BCAEJR.js");e1({id:"saved-to-library",timeSensitive:!0,priority:151,duration:b()?5e3:0,showOnMobile:b(),wrapperPadding:"0px",render:b()?({dismiss:e})=>preactH(Fragment,null,preactH(D,{onClick:()=>{e(),p1("speechify://speechify.page.link/library")}},preactH("span",null,"Saved to library. Tap to open in app"))):({id:e,dismiss:n})=>preactH(t,{id:e,savedInfo:o,removeNotification:n})})}function m1(o){let[t,e]=(0,C.useState)("unsaved");(0,C.useEffect)(()=>{N().then(e)},[]),(0,C.useEffect)(()=>z.on("change",({status:a})=>e(a)),[]);let n=async()=>{let a=await P();if(!await y(a)){Z.emit("check",{source:"import"});return}T1(o),o1("extension_import_tabs_click_bookmark_icon",{source:o}).catch(console.error),i1("SHOULD_SHOW_BOOKMARK_FEATURE_HINT",!1)},d=b()?u1:d1,p=(0,C.useMemo)(()=>t==="unsaved"?a1:t==="saving"?E:t==="saved"?d:A,[t]),m=(0,C.useMemo)(()=>t==="unsaved"?s1:t==="saving"?E:t==="saved"?c1:A,[t]);return{saveToMobileStatus:t,saveToMobile:n,SaveToMobileIcon:p,SaveToMobilePillIcon:m}}r();i();var Ao=o=>preactH(l,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"red",...o},preactH("path",{d:"M9.99996 18.3414C14.5615 18.3414 18.3333 14.5696 18.3333 10.008C18.3333 5.43842 14.5535 1.66666 9.9919 1.66666C5.43033 1.66666 1.66663 5.43842 1.66663 10.008C1.66663 14.5696 5.43839 18.3414 9.99996 18.3414ZM9.99996 16.6731C6.30073 16.6731 3.3349 13.6992 3.3349 10.008C3.3349 6.30882 6.29267 3.33494 9.9919 3.33494C13.6911 3.33494 16.665 6.30882 16.6731 10.008C16.6731 13.6992 13.6992 16.6731 9.99996 16.6731ZM9.9919 11.362C10.4352 11.362 10.6931 11.1122 10.7011 10.6447L10.8301 6.7682C10.8381 6.2927 10.4835 5.95421 9.98384 5.95421C9.48416 5.95421 9.14567 6.28465 9.15373 6.76014L9.26656 10.6528C9.28268 11.1122 9.54058 11.362 9.9919 11.362ZM9.9919 14.0377C10.5158 14.0377 10.9429 13.6589 10.9429 13.1512C10.9429 12.6354 10.5238 12.2647 9.9919 12.2647C9.46804 12.2647 9.0409 12.6434 9.0409 13.1512C9.0409 13.6589 9.4761 14.0377 9.9919 14.0377Z"})),L=o=>preactH(l,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 25 24",fill:"none",...o},preactH("path",{d:"M13.8662 13.0551C13.8352 13.9559 13.3537 14.4374 12.4994 14.4374C11.6296 14.4374 11.1326 13.9404 11.1015 13.0551L10.8841 5.56872C10.853 4.65234 11.5209 4 12.4839 4C13.4469 4 14.1303 4.66787 14.0992 5.58425L13.8662 13.0551Z",fill:"currentColor"}),preactH("path",{d:"M14.3322 17.87C14.3322 18.864 13.509 19.594 12.4994 19.594C11.5054 19.594 10.6667 18.8485 10.6667 17.87C10.6667 16.8915 11.4898 16.1615 12.4994 16.1615C13.509 16.1615 14.3322 16.8915 14.3322 17.87Z",fill:"currentColor"}));r();i();function S({isPlaying:o,isLoading:t,isLoadingFailed:e}){return e?L:t?B:o?Q:J}r();i();var y1=o=>preactH(l,{viewBox:"0 0 20 18",fill:"currentColor",xmlns:"http://www.w3.org/2000/svg",...o},preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M1.29194 12.3983C2.11916 11.5946 3.24111 11.1431 4.41097 11.1431H11.4685C12.6384 11.1431 13.7603 11.5946 14.5875 12.3983C15.4148 13.202 15.8795 14.2921 15.8795 15.4287V17.143C15.8795 17.6164 15.4845 18.0001 14.9973 18.0001C14.5101 18.0001 14.1151 17.6164 14.1151 17.143V15.4287C14.1151 14.7467 13.8363 14.0927 13.3399 13.6105C12.8436 13.1282 12.1704 12.8573 11.4685 12.8573H4.41097C3.70905 12.8573 3.03588 13.1282 2.53955 13.6105C2.04322 14.0927 1.76439 14.7467 1.76439 15.4287V17.143C1.76439 17.6164 1.36942 18.0001 0.882194 18.0001C0.394972 18.0001 0 17.6164 0 17.143V15.4287C0 14.2921 0.464726 13.202 1.29194 12.3983Z"}),preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M7.93831 2.57241C6.47665 2.57241 5.29173 3.72366 5.29173 5.1438C5.29173 6.56394 6.47665 7.71519 7.93831 7.71519C9.39998 7.71519 10.5849 6.56394 10.5849 5.1438C10.5849 3.72366 9.39998 2.57241 7.93831 2.57241ZM3.52734 5.1438C3.52734 2.7769 5.5022 0.858154 7.93831 0.858154C10.3744 0.858154 12.3493 2.7769 12.3493 5.1438C12.3493 7.5107 10.3744 9.42945 7.93831 9.42945C5.5022 9.42945 3.52734 7.5107 3.52734 5.1438Z"}),preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M13.9655 1.50193C14.3101 1.16725 14.8687 1.16734 15.2131 1.50212C15.9715 2.23918 16.3976 3.23872 16.3976 4.28093C16.3976 5.32314 15.9715 6.32268 15.2131 7.05975C14.8687 7.39453 14.3101 7.39461 13.9655 7.05993C13.6209 6.72525 13.6209 6.18255 13.9653 5.84777C14.3929 5.43217 14.6332 4.86858 14.6332 4.28093C14.6332 3.69328 14.3929 3.12969 13.9653 2.7141C13.6209 2.37932 13.6209 1.83661 13.9655 1.50193Z"}),preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M17.0202 0.250956C17.3648 -0.0837235 17.9233 -0.0836416 18.2678 0.251139C19.3771 1.32923 20.0003 2.79123 20.0003 4.31565C20.0003 5.84007 19.3771 7.30207 18.2678 8.38016C17.9233 8.71494 17.3648 8.71502 17.0202 8.38034C16.6756 8.04566 16.6755 7.50296 17.02 7.16818C17.7985 6.41156 18.2359 5.38551 18.2359 4.31565C18.2359 3.24579 17.7985 2.21974 17.02 1.46312C16.6755 1.12834 16.6756 0.585636 17.0202 0.250956Z"})),Wo=o=>preactH(l,{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",...o},preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M13.8601 2.11321C13.6913 1.94443 13.4624 1.84961 13.2237 1.84961H6.77553C6.53684 1.84961 6.30792 1.94443 6.13913 2.11321L2.11321 6.13913C1.94443 6.30792 1.84961 6.53684 1.84961 6.77553V13.2237C1.84961 13.4624 1.94443 13.6913 2.11321 13.8601L6.13913 17.886C6.30792 18.0548 6.53684 18.1496 6.77553 18.1496H13.2237C13.4624 18.1496 13.6913 18.0548 13.8601 17.886L17.886 13.8601C18.0548 13.6913 18.1496 13.4624 18.1496 13.2237V6.77553C18.1496 6.53684 18.0548 6.30792 17.886 6.13913L13.8601 2.11321ZM12.8509 3.64961L16.3496 7.14832V12.8509L12.8509 16.3496H7.14832L3.64961 12.8509V7.14832L7.14832 3.64961H12.8509ZM8.94631 6.14197C8.90198 5.53023 9.38633 5.00952 9.99968 5.00952C10.613 5.00952 11.0974 5.53023 11.0531 6.14197L10.7021 10.9863C10.6754 11.3545 10.3689 11.6396 9.99968 11.6396C9.63049 11.6396 9.32397 11.3545 9.29729 10.9863L8.94631 6.14197ZM9.99959 14.9989C10.6071 14.9989 11.0996 14.5064 11.0996 13.8989C11.0996 13.2914 10.6071 12.7989 9.99959 12.7989C9.39208 12.7989 8.89959 13.2914 8.89959 13.8989C8.89959 14.5064 9.39208 14.9989 9.99959 14.9989Z",fill:"#EB3830"}));r();i();r();i();var g1=o=>preactH(l,{"aria-label":g("PLAY_BUTTON"),"data-testid":u.PLAY_BUTTON,xmlns:"http://www.w3.org/2000/svg",fill:"none",width:"16",height:"16",viewBox:"0 0 16 16",...o},preactH("g",{clipPath:"url(#clip0_19_169)"},preactH("circle",{cx:"8",cy:"8",r:"7.2",stroke:"#454746",strokeWidth:"1.6"}),preactH("path",{d:"M10.95 7.39386C11.4167 7.66329 11.4167 8.33686 10.95 8.60629L7.05005 10.858C6.58338 11.1274 6.00005 10.7906 6.00005 10.2517L6.00005 5.74841C6.00005 5.20955 6.58338 4.87276 7.05005 5.14219L10.95 7.39386Z",fill:"#454746"})),preactH("defs",null,preactH("clipPath",{id:"clip0_19_169"},preactH("rect",{width:"16",height:"16",fill:"white"})))),x1=o=>preactH(l,{"aria-label":g("PAUSE_BUTTON"),"data-testid":u.PAUSE_BUTTON,className:"icon--pressed",role:"presentation",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 16 16",width:"16",height:"16",fill:"none",...o},preactH("g",{clipPath:"url(#clip0_19_151)"},preactH("circle",{cx:"8",cy:"8",r:"7.2",stroke:"#454746",strokeWidth:"1.6"}),preactH("path",{d:"M5 5.7C5 5.3134 5.3134 5 5.7 5H6.3C6.6866 5 7 5.3134 7 5.7V10.3C7 10.6866 6.6866 11 6.3 11H5.7C5.3134 11 5 10.6866 5 10.3V5.7Z",fill:"#454746"}),preactH("path",{d:"M9 5.7C9 5.3134 9.3134 5 9.7 5H10.3C10.6866 5 11 5.3134 11 5.7V10.3C11 10.6866 10.6866 11 10.3 11H9.7C9.3134 11 9 10.6866 9 10.3V5.7Z",fill:"#454746"})),preactH("defs",null,preactH("clipPath",{id:"clip0_19_151"},preactH("rect",{width:"16",height:"16",fill:"white"})))),f1=o=>preactH(l,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",width:"16",height:"16",fill:"none",...o},preactH("circle",{cx:"12",cy:"12",r:"10",stroke:"#454746",strokeWidth:"2"}),preactH("path",{d:"M13.8662 13.0551C13.8352 13.9559 13.3537 14.4374 12.4994 14.4374C11.6296 14.4374 11.1326 13.9404 11.1015 13.0551L10.8841 5.56872C10.853 4.65234 11.5209 4 12.4839 4C13.4469 4 14.1303 4.66787 14.0992 5.58425L13.8662 13.0551Z",fill:"#454746"}),preactH("path",{d:"M14.3322 17.87C14.3322 18.864 13.509 19.594 12.4994 19.594C11.5054 19.594 10.6667 18.8485 10.6667 17.87C10.6667 16.8915 11.4898 16.1615 12.4994 16.1615C13.509 16.1615 14.3322 16.8915 14.3322 17.87Z",fill:"#454746"}));function R({isPlaying:o,isLoading:t,isLoadingFailed:e}){return e?f1:t?B:o?x1:g1}var T=c(x)`
  background-color: ${({background:o})=>o??s.sfPrimCta};
  color: ${({color:o})=>o??s.icnTxtPrim};
  width: ${({size:o})=>o??"20px"};
  height: ${({size:o})=>o??"20px"};
  cursor: pointer;
  border-radius: 50%;
  box-shadow: ${({boxShadow:o})=>o??"rgba(109, 117, 141, 0.2) 0px 0px 2px"};

  // Reset button styles
  padding: ${({padding:o})=>o??"0"};
  margin: ${({margin:o})=>o??"0"};
  padding: ${({padding:o})=>o??"0"};
  outline: none;
  border: none;

  ${({outlined:o,outlinedColor:t=s.brdrPrimCta,borderWidth:e="2px"})=>o&&`
    border: ${e} solid ${t};
    background: transparent;
    color: ${t};
    opacity: 1;
  `}
`.withComponent("button");T.defaultProps={xAlign:!0,yAlign:!0};var It=({isPlaying:o,isLoading:t,isLoadingFailed:e,onClick:n,outlined:d=!1,iconSize:p="14px",...m})=>{let a=S({isPlaying:o,isLoading:t,isLoadingFailed:e}),f=g(o?"PAUSE_BUTTON":"PLAY_BUTTON"),h=o?u.PAUSE_BUTTON:u.PLAY_BUTTON;return preactH(T,{"aria-label":f,"data-testid":h,color:s.icnTxtPrim,outlined:d,onClick:n,...m},preactH(a,{size:p}))},L1=c(x)`
  align-items: center;
  justify-content: center;
  width: ${({size:o})=>o??"28px"};
  height: ${({size:o})=>o??"28px"};
  cursor: pointer;
  border-radius: 4px;

  // Reset button styles
  padding: ${({padding:o})=>o??"0"};
  margin: ${({margin:o})=>o??"0"};
  padding: ${({padding:o})=>o??"0"};
  outline: none;
  border: none;
  background-color: transparent;
  background: transparent;

  &:hover {
    background-color: #f2f2f2;
  }

  &:active {
    background-color: #e4e4e4;
  }
`.withComponent("button"),Lt=({isPlaying:o,isLoading:t,isLoadingFailed:e,onClick:n,...d})=>{let p=R({isPlaying:o,isLoading:t,isLoadingFailed:e}),m=g(o?"PAUSE_BUTTON":"PLAY_BUTTON"),a=o?u.PAUSE_BUTTON:u.PLAY_BUTTON;return preactH(L1,{"aria-label":m,"data-testid":a,onClick:n,...d},preactH(p,null))},h1=c(x)`
  color: ${({color:o})=>o??s.icnTxtPrim};
  width: ${({size:o})=>o??"20px"};
  height: ${({size:o})=>o??"20px"};
  cursor: pointer;
  border-radius: 50%;
  box-shadow: ${({boxShadow:o})=>o??"rgba(109, 117, 141, 0.2) 0px 0px 2px"};

  // Reset button styles
  padding: ${({padding:o})=>o??"0"};
  margin: ${({margin:o})=>o??"0"};
  padding: ${({padding:o})=>o??"0"};
  outline: none;
  border: none;

  ${({outlined:o,outlinedColor:t,borderWidth:e="2px",background:n})=>o&&`
    border: ${e} solid ${t};
    background: ${n};
    color: ${t};
    opacity: 1;
  `}
`.withComponent("button");h1.defaultProps={xAlign:!0,yAlign:!0};function O1({isPlaying:o,isLoading:t,isLoadingFailed:e}){return e?L:t?B:o?r1:l1}var Ot=({isPlaying:o,isLoading:t,isLoadingFailed:e,outlined:n=!1,...d})=>{let p=O1({isPlaying:o,isLoading:t,isLoadingFailed:e}),m=g(o?"PAUSE_BUTTON":"PLAY_BUTTON"),a=o?u.PAUSE_BUTTON:u.PLAY_BUTTON;return preactH(h1,{"aria-label":m,"data-testid":a,outlined:n,...d},preactH(p,null))},_t=c(x)`
  background-color: ${({background:o})=>o??s.brdrPrimInv8010};
  color: ${({color:o})=>o??s.icnTxtPrim};
  border-radius: 32px 0px 0px 32px;
  margin-right: -100%;
  box-shadow: ${({boxShadow:o})=>o??"rgba(109, 117, 141, 0.2) 0px 0px 2px"};
  padding: ${({padding:o})=>o??"8px"};
  margin-left: ${({showClose:o})=>o?"-138px":"-89px"};
  margin-top: -13px;
  justify-content: center;
  align-items: center;
  position: fixed;
  // Reset button styles
  outline: none;
  border: none;
  display: inline-flex;
`.withComponent("div"),_1=c(x)`
  border-radius: 999999px;
  justify-content: center;
  align-items: center;
  position: fixed;
  // Reset button styles
  outline: none;
  border: ${({color:o})=>o};
  display: inline-flex;
`.withComponent("div"),A1=({isPlaying:o,isLoading:t,isLoadingFailed:e,color:n,hoverColor:d,children:p,...m})=>{let a=m.showTooltip,f=S({isPlaying:o,isLoading:t,isLoadingFailed:e}),h=g(o?"PAUSE_BUTTON":"PLAY_BUTTON"),w=o?u.PAUSE_BUTTON:u.PLAY_BUTTON;return preactH(_1,{background:"#F8FAFC",color:a?`2px solid ${d}`:`2px solid ${n}`},preactH(T,{size:"17.5px","aria-label":h,"data-testid":w,color:a?d:n,...m},preactH(f,{size:"12px"}),p))},N1=c(x)`
  background-color: ${s.bgPrimW100};
  color: ${s.icnTxtPrim};
  border-radius: 32px;
  margin-right: -100%;
  box-shadow: 0px 0px 5px 0px rgba(106, 120, 252, 0.01), 0px 0px 4px 0px rgba(106, 120, 252, 0.07),
    0px 0px 4px 0px rgba(106, 120, 252, 0.25), 0px 0px 3px 0px rgba(106, 120, 252, 0.43),
    0px 0px 2px 0px rgba(106, 120, 252, 0.49), 0px 0px 0px 0px rgba(106, 120, 252, 0.5);
  padding: 4px ${({showClose:o})=>o?"4px":"12px"} 4px 4px;
  justify-content: center;
  align-items: center;
  position: fixed;
  margin-left: -89px;

  // Reset button styles
  cursor: pointer;
  outline: none;
  border: none;
  display: inline-flex;
`.withComponent("div"),k1=c.button`
  display: flex;
  background: #2d2d2f;
  border: unset;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 6px;
  outline: unset;
  padding: 0;

  & > svg path {
    fill: #9899a6;
    height: 20px !important;
    width: 20px !important;
  }

  &:hover {
    background: #2d2d2f;
    & > svg path {
      fill: #ffffff;
    }
  }
`,At=({isPlaying:o,isLoading:t,isLoadingFailed:e,onExit:n,onClick:d,...p})=>{let[m,a]=(0,C1.useState)(!1),f=S({isPlaying:o,isLoading:t,isLoadingFailed:e}),h=g(o?"KINDLE_PAUSE_BUTTON":"KINDLE_PLAY_BUTTON"),w=o?u.KINDLE_PAUSE_BUTTON:u.KINDLE_PLAY_BUTTON;return preactH(N1,{showClose:m&&!t,onMouseEnter:()=>a(!0),onMouseLeave:()=>a(!1),tabIndex:-1},preactH(T,{size:"32px","aria-label":h,"data-testid":w,background:s.sfPrimCta,color:s.icnTxtPrim,margin:"0 6px 0px 0px",padding:"8px",onClick:d,...p},preactH(f,{size:"26px"})),preactH(K,{"aria-label":g("KINDLE_LISTEN_TEXT"),"data-testid":u.KINDLE_LISTEN_TEXT,color:s.icnTxtPrim,fixedWidthNumbers:!0,onClick:d},"Listen"),m&&!t?preactH(k1,{"aria-label":g("KINDLE_POWER_BUTTON"),"data-testid":u.KINDLE_POWER_BUTTON,onClick:n},preactH(q,null)):null)},M1=({background:o,children:t,fill:e,iconSize:n,logEventOnClick:d,source:p,...m})=>{let{saveToMobile:a,SaveToMobileIcon:f,SaveToMobilePillIcon:h}=m1(p);return preactH(T,{onClick:M(w=>{G(a)(w),d&&d()}),background:o??"transparent",...m},p==="Pill Player"||p==="PDF"?preactH(h,{size:n,fill:e}):preactH(f,{size:n,fill:e}),t)},U=c(x)`
  background-color: ${({background:o})=>o??"transparent"};
  cursor: pointer;
  border-radius: 50%;
  color: ${({color:o})=>o??s.icnTxtPrim};

  width: ${({size:o,width:t})=>t??o??"30px"};
  height: ${({size:o,height:t})=>t??o??"30px"};
  min-width: ${({size:o,width:t})=>t??o??"30px"};
  min-height: ${({size:o,height:t})=>t??o??"30px"};

  ${({noPadding:o})=>o&&"padding: 0;"}

  // Reset button styles
  outline: none;
  border: none;
`.withComponent("button");U.defaultProps={xAlign:!0,yAlign:!0};var b1=c(x)`
  // Reset button styles
  outline: none;
  border: none;

  background-color: ${({background:o,secondary:t})=>t?"transparent":o??s.sfPrimCta};
  padding: ${({padding:o})=>o??"8px 16px"};
  cursor: pointer;
  border-radius: ${({borderRadius:o})=>o??"8px"};
  box-shadow: rgba(109, 117, 141, 0.2) 0 0 2px;
  color: ${({color:o,secondary:t,background:e})=>t?e??s.sfPrimCta:o??s.icnTxtPrim};
  ${({secondary:o,background:t})=>o&&`border: 2px solid ${t??s.sfPrimCta}`};

  // For a tag
  text-decoration: none;
  box-sizing: border-box;
`.withComponent("button"),B1=c(b1)`
  border-radius: 20px;

  margin: 0;
  padding: 8px 12px;

  font-size: 12px;
  height: 40px; // Fixed height necessary for animations
  width: 100%;
`,E1=({children:o,...t})=>preactH(B1,{...t},o);B1.defaultProps={xAlign:!0,yAlign:!0};var R1=c(U)`
  padding: 0;
  border-radius: unset;

  ${({noResponsive:o})=>!o&&`
  > svg {
    width: auto;
    height: 100%;
  }
  `}
`;var Nt=c(E1)`
  display: ${({expanded:o})=>o?"flex":"none"};
`,U1=({children:o,...t})=>preactH(R1,{...t},o),kt=c(b1)`
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px 4px 6px;
  gap: 4px;

  width: 144px;
  height: 38px;

  border: 1px solid ${s.brdrBlue};
  border-radius: 4px;
`,w1=c(U)`
  border-radius: 5px;
  padding: 1px;
`;w1.defaultProps={width:"38px",height:"26px",xAlign:!0,yAlign:!0};var Mt=c(w1)`
  width: 24px;
  min-width: 24px;
  height: 24px;
  min-height: 24px;
  padding: 0;
`,Et=v(M1),Rt=v(A1),Ut=v(U1);export{M as a,Q1 as b,$1 as c,i1 as d,m1 as e,Ao as f,L as g,y1 as h,Wo as i,T as j,It as k,Lt as l,Ot as m,At as n,M1 as o,U as p,b1 as q,E1 as r,U1 as s,Rt as t};
//# sourceMappingURL=chunk-LBZ34ZL2.js.map
