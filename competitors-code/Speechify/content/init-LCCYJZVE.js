import{a as si}from"./chunk-UPOJKPU4.js";import{a as hi}from"./chunk-ACZR26GY.js";import{a as ni}from"./chunk-M5NV5XMO.js";import{b as fe}from"./chunk-FEYPXFJ6.js";import"./chunk-BVP7ZEFD.js";import"./chunk-FJMP4XPS.js";import"./chunk-BRU4RAVQ.js";import"./chunk-QEP7SRH7.js";import"./chunk-OFYWCEWM.js";import"./chunk-TVWAVI6A.js";import"./chunk-CVF2X5Y4.js";import"./chunk-BD5GYQVX.js";import"./chunk-LBZ34ZL2.js";import"./chunk-SI7CO4VP.js";import"./chunk-JAWPO7FD.js";import"./chunk-N3ET5YJZ.js";import"./chunk-LXDXREIX.js";import{b as oi}from"./chunk-XP57BQDH.js";import"./chunk-VYK2SFTV.js";import"./chunk-MQX2TL35.js";import"./chunk-SWWFND36.js";import"./chunk-PJRECGUK.js";import{$a as kt,Ga as Je,T as Fe,V as Qe,_a as Ht,_b as ai,ab as de,cb as ti,la as Ke}from"./chunk-6VFX2JNU.js";import"./chunk-LUKOAFYK.js";import"./chunk-O77QQVYU.js";import"./chunk-35EEQS33.js";import{i as cr}from"./chunk-BGIN6QNH.js";import"./chunk-UQBFOPQH.js";import{d as pe}from"./chunk-6HLOLWYC.js";import"./chunk-XFWXZVUM.js";import{a as ri}from"./chunk-D2ACMGPV.js";import{c as ei,g as ii,k as Bt}from"./chunk-NORECDYR.js";import{a as Yt,b as Xt,c as Wt,d as je,e as $e,f as Ge,g as qe}from"./chunk-RQERJHUS.js";import{b as Ze,d as ce,h as Q,j as preactH,l as le,n as hr,o as K}from"./chunk-NUN3A7RC.js";var ci=Ze((ue,ge)=>{K();Q();(function(u,v){typeof ue=="object"&&typeof ge<"u"?ge.exports=v():typeof define=="function"&&define.amd?define(v):(u=typeof globalThis<"u"?globalThis:u||self,u.Cropper=v())})(ue,function(){"use strict";function u(r,t){var i=Object.keys(r);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(r);t&&(e=e.filter(function(n){return Object.getOwnPropertyDescriptor(r,n).enumerable})),i.push.apply(i,e)}return i}function v(r){for(var t=1;t<arguments.length;t++){var i=arguments[t]!=null?arguments[t]:{};t%2?u(Object(i),!0).forEach(function(e){V(r,e,i[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(i)):u(Object(i)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(i,e))})}return r}function g(r){"@babel/helpers - typeof";return typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?g=function(t){return typeof t}:g=function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},g(r)}function x(r,t){if(!(r instanceof t))throw new TypeError("Cannot call a class as a function")}function D(r,t){for(var i=0;i<t.length;i++){var e=t[i];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(r,e.key,e)}}function S(r,t,i){return t&&D(r.prototype,t),i&&D(r,i),r}function V(r,t,i){return t in r?Object.defineProperty(r,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):r[t]=i,r}function U(r){return J(r)||N(r)||L(r)||Z()}function J(r){if(Array.isArray(r))return $(r)}function N(r){if(typeof Symbol<"u"&&r[Symbol.iterator]!=null||r["@@iterator"]!=null)return Array.from(r)}function L(r,t){if(r){if(typeof r=="string")return $(r,t);var i=Object.prototype.toString.call(r).slice(8,-1);if(i==="Object"&&r.constructor&&(i=r.constructor.name),i==="Map"||i==="Set")return Array.from(r);if(i==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i))return $(r,t)}}function $(r,t){(t==null||t>r.length)&&(t=r.length);for(var i=0,e=new Array(t);i<t;i++)e[i]=r[i];return e}function Z(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var R=typeof window<"u"&&typeof window.document<"u",C=R?window:{},et=R&&C.document.documentElement?"ontouchstart"in C.document.documentElement:!1,it=R?"PointerEvent"in C:!1,y="cropper",ft="all",ut="crop",nt="move",G="zoom",_="e",P="w",rt="s",ct="n",Tt="ne",Ot="nw",St="se",Nt="sw",qt="".concat(y,"-crop"),ve="".concat(y,"-disabled"),Y="".concat(y,"-hidden"),we="".concat(y,"-hide"),Di="".concat(y,"-invisible"),zt="".concat(y,"-modal"),Ft="".concat(y,"-move"),Lt="".concat(y,"Action"),_t="".concat(y,"Preview"),Qt="crop",be="move",Ce="none",Kt="crop",Jt="cropend",te="cropmove",ee="cropstart",xe="dblclick",Ti=et?"touchstart":"mousedown",Oi=et?"touchmove":"mousemove",Si=et?"touchend touchcancel":"mouseup",ye=it?"pointerdown":Ti,Me=it?"pointermove":Oi,Ee=it?"pointerup pointercancel":Si,De="ready",Te="resize",Oe="wheel",ie="zoom",Se="image/jpeg",Ni=/^e|w|s|n|se|sw|ne|nw|all|crop|move|zoom$/,Li=/^data:/,Ri=/^data:image\/jpeg;base64,/,Ai=/^img|canvas$/i,Ne=200,Le=100,Re={viewMode:0,dragMode:Qt,initialAspectRatio:NaN,aspectRatio:NaN,data:null,preview:"",responsive:!0,restore:!0,checkCrossOrigin:!0,checkOrientation:!0,modal:!0,guides:!0,center:!0,highlight:!0,background:!0,autoCrop:!0,autoCropArea:.8,movable:!0,rotatable:!0,scalable:!0,zoomable:!0,zoomOnTouch:!0,zoomOnWheel:!0,wheelZoomRatio:.1,cropBoxMovable:!0,cropBoxResizable:!0,toggleDragModeOnDblclick:!0,minCanvasWidth:0,minCanvasHeight:0,minCropBoxWidth:0,minCropBoxHeight:0,minContainerWidth:Ne,minContainerHeight:Le,ready:null,cropstart:null,cropmove:null,cropend:null,crop:null,zoom:null},Hi='<div class="cropper-container" touch-action="none"><div class="cropper-wrap-box"><div class="cropper-canvas"></div></div><div class="cropper-drag-box"></div><div class="cropper-crop-box"><span class="cropper-view-box"></span><span class="cropper-dashed dashed-h"></span><span class="cropper-dashed dashed-v"></span><span class="cropper-center"></span><span class="cropper-face"></span><span class="cropper-line line-e" data-cropper-action="e"></span><span class="cropper-line line-n" data-cropper-action="n"></span><span class="cropper-line line-w" data-cropper-action="w"></span><span class="cropper-line line-s" data-cropper-action="s"></span><span class="cropper-point point-e" data-cropper-action="e"></span><span class="cropper-point point-n" data-cropper-action="n"></span><span class="cropper-point point-w" data-cropper-action="w"></span><span class="cropper-point point-s" data-cropper-action="s"></span><span class="cropper-point point-ne" data-cropper-action="ne"></span><span class="cropper-point point-nw" data-cropper-action="nw"></span><span class="cropper-point point-sw" data-cropper-action="sw"></span><span class="cropper-point point-se" data-cropper-action="se"></span></div></div>',ki=Number.isNaN||C.isNaN;function m(r){return typeof r=="number"&&!ki(r)}var Ae=function(t){return t>0&&t<1/0};function re(r){return typeof r>"u"}function gt(r){return g(r)==="object"&&r!==null}var Bi=Object.prototype.hasOwnProperty;function bt(r){if(!gt(r))return!1;try{var t=r.constructor,i=t.prototype;return t&&i&&Bi.call(i,"isPrototypeOf")}catch{return!1}}function X(r){return typeof r=="function"}var Ii=Array.prototype.slice;function He(r){return Array.from?Array.from(r):Ii.call(r)}function A(r,t){return r&&X(t)&&(Array.isArray(r)||m(r.length)?He(r).forEach(function(i,e){t.call(r,i,e,r)}):gt(r)&&Object.keys(r).forEach(function(i){t.call(r,r[i],i,r)})),r}var T=Object.assign||function(t){for(var i=arguments.length,e=new Array(i>1?i-1:0),n=1;n<i;n++)e[n-1]=arguments[n];return gt(t)&&e.length>0&&e.forEach(function(a){gt(a)&&Object.keys(a).forEach(function(o){t[o]=a[o]})}),t},zi=/\.\d*(?:0|9){12}\d*$/;function Ct(r){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:1e11;return zi.test(r)?Math.round(r*t)/t:r}var _i=/^width|height|left|top|marginLeft|marginTop$/;function lt(r,t){var i=r.style;A(t,function(e,n){_i.test(n)&&m(e)&&(e="".concat(e,"px")),i[n]=e})}function Vi(r,t){return r.classList?r.classList.contains(t):r.className.indexOf(t)>-1}function I(r,t){if(t){if(m(r.length)){A(r,function(e){I(e,t)});return}if(r.classList){r.classList.add(t);return}var i=r.className.trim();i?i.indexOf(t)<0&&(r.className="".concat(i," ").concat(t)):r.className=t}}function at(r,t){if(t){if(m(r.length)){A(r,function(i){at(i,t)});return}if(r.classList){r.classList.remove(t);return}r.className.indexOf(t)>=0&&(r.className=r.className.replace(t,""))}}function xt(r,t,i){if(t){if(m(r.length)){A(r,function(e){xt(e,t,i)});return}i?I(r,t):at(r,t)}}var Pi=/([a-z\d])([A-Z])/g;function ae(r){return r.replace(Pi,"$1-$2").toLowerCase()}function oe(r,t){return gt(r[t])?r[t]:r.dataset?r.dataset[t]:r.getAttribute("data-".concat(ae(t)))}function Rt(r,t,i){gt(i)?r[t]=i:r.dataset?r.dataset[t]=i:r.setAttribute("data-".concat(ae(t)),i)}function Yi(r,t){if(gt(r[t]))try{delete r[t]}catch{r[t]=void 0}else if(r.dataset)try{delete r.dataset[t]}catch{r.dataset[t]=void 0}else r.removeAttribute("data-".concat(ae(t)))}var ke=/\s\s*/,Be=function(){var r=!1;if(R){var t=!1,i=function(){},e=Object.defineProperty({},"once",{get:function(){return r=!0,t},set:function(a){t=a}});C.addEventListener("test",i,e),C.removeEventListener("test",i,e)}return r}();function tt(r,t,i){var e=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{},n=i;t.trim().split(ke).forEach(function(a){if(!Be){var o=r.listeners;o&&o[a]&&o[a][i]&&(n=o[a][i],delete o[a][i],Object.keys(o[a]).length===0&&delete o[a],Object.keys(o).length===0&&delete r.listeners)}r.removeEventListener(a,n,e)})}function q(r,t,i){var e=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{},n=i;t.trim().split(ke).forEach(function(a){if(e.once&&!Be){var o=r.listeners,s=o===void 0?{}:o;n=function(){delete s[a][i],r.removeEventListener(a,n,e);for(var l=arguments.length,h=new Array(l),c=0;c<l;c++)h[c]=arguments[c];i.apply(r,h)},s[a]||(s[a]={}),s[a][i]&&r.removeEventListener(a,s[a][i],e),s[a][i]=n,r.listeners=s}r.addEventListener(a,n,e)})}function yt(r,t,i){var e;return X(Event)&&X(CustomEvent)?e=new CustomEvent(t,{detail:i,bubbles:!0,cancelable:!0}):(e=document.createEvent("CustomEvent"),e.initCustomEvent(t,!0,!0,i)),r.dispatchEvent(e)}function Ie(r){var t=r.getBoundingClientRect();return{left:t.left+(window.pageXOffset-document.documentElement.clientLeft),top:t.top+(window.pageYOffset-document.documentElement.clientTop)}}var ne=C.location,Xi=/^(\w+:)\/\/([^:/?#]*):?(\d*)/i;function ze(r){var t=r.match(Xi);return t!==null&&(t[1]!==ne.protocol||t[2]!==ne.hostname||t[3]!==ne.port)}function _e(r){var t="timestamp=".concat(new Date().getTime());return r+(r.indexOf("?")===-1?"?":"&")+t}function At(r){var t=r.rotate,i=r.scaleX,e=r.scaleY,n=r.translateX,a=r.translateY,o=[];m(n)&&n!==0&&o.push("translateX(".concat(n,"px)")),m(a)&&a!==0&&o.push("translateY(".concat(a,"px)")),m(t)&&t!==0&&o.push("rotate(".concat(t,"deg)")),m(i)&&i!==1&&o.push("scaleX(".concat(i,")")),m(e)&&e!==1&&o.push("scaleY(".concat(e,")"));var s=o.length?o.join(" "):"none";return{WebkitTransform:s,msTransform:s,transform:s}}function Wi(r){var t=v({},r),i=0;return A(r,function(e,n){delete t[n],A(t,function(a){var o=Math.abs(e.startX-a.startX),s=Math.abs(e.startY-a.startY),d=Math.abs(e.endX-a.endX),l=Math.abs(e.endY-a.endY),h=Math.sqrt(o*o+s*s),c=Math.sqrt(d*d+l*l),p=(c-h)/h;Math.abs(p)>Math.abs(i)&&(i=p)})}),i}function Vt(r,t){var i=r.pageX,e=r.pageY,n={endX:i,endY:e};return t?n:v({startX:i,startY:e},n)}function Ui(r){var t=0,i=0,e=0;return A(r,function(n){var a=n.startX,o=n.startY;t+=a,i+=o,e+=1}),t/=e,i/=e,{pageX:t,pageY:i}}function pt(r){var t=r.aspectRatio,i=r.height,e=r.width,n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"contain",a=Ae(e),o=Ae(i);if(a&&o){var s=i*t;n==="contain"&&s>e||n==="cover"&&s<e?i=e/t:e=i*t}else a?i=e/t:o&&(e=i*t);return{width:e,height:i}}function Zi(r){var t=r.width,i=r.height,e=r.degree;if(e=Math.abs(e)%180,e===90)return{width:i,height:t};var n=e%90*Math.PI/180,a=Math.sin(n),o=Math.cos(n),s=t*o+i*a,d=t*a+i*o;return e>90?{width:d,height:s}:{width:s,height:d}}function ji(r,t,i,e){var n=t.aspectRatio,a=t.naturalWidth,o=t.naturalHeight,s=t.rotate,d=s===void 0?0:s,l=t.scaleX,h=l===void 0?1:l,c=t.scaleY,p=c===void 0?1:c,b=i.aspectRatio,w=i.naturalWidth,O=i.naturalHeight,M=e.fillColor,k=M===void 0?"transparent":M,z=e.imageSmoothingEnabled,H=z===void 0?!0:z,st=e.imageSmoothingQuality,j=st===void 0?"low":st,f=e.maxWidth,E=f===void 0?1/0:f,B=e.maxHeight,F=B===void 0?1/0:B,ht=e.minWidth,mt=ht===void 0?0:ht,vt=e.minHeight,dt=vt===void 0?0:vt,ot=document.createElement("canvas"),W=ot.getContext("2d"),wt=pt({aspectRatio:b,width:E,height:F}),Pt=pt({aspectRatio:b,width:mt,height:dt},"cover"),se=Math.min(wt.width,Math.max(Pt.width,w)),he=Math.min(wt.height,Math.max(Pt.height,O)),Ye=pt({aspectRatio:n,width:E,height:F}),Xe=pt({aspectRatio:n,width:mt,height:dt},"cover"),We=Math.min(Ye.width,Math.max(Xe.width,a)),Ue=Math.min(Ye.height,Math.max(Xe.height,o)),nr=[-We/2,-Ue/2,We,Ue];return ot.width=Ct(se),ot.height=Ct(he),W.fillStyle=k,W.fillRect(0,0,se,he),W.save(),W.translate(se/2,he/2),W.rotate(d*Math.PI/180),W.scale(h,p),W.imageSmoothingEnabled=H,W.imageSmoothingQuality=j,W.drawImage.apply(W,[r].concat(U(nr.map(function(sr){return Math.floor(Ct(sr))})))),W.restore(),ot}var Ve=String.fromCharCode;function $i(r,t,i){var e="";i+=t;for(var n=t;n<i;n+=1)e+=Ve(r.getUint8(n));return e}var Gi=/^data:.*,/;function qi(r){var t=r.replace(Gi,""),i=atob(t),e=new ArrayBuffer(i.length),n=new Uint8Array(e);return A(n,function(a,o){n[o]=i.charCodeAt(o)}),e}function Fi(r,t){for(var i=[],e=8192,n=new Uint8Array(r);n.length>0;)i.push(Ve.apply(null,He(n.subarray(0,e)))),n=n.subarray(e);return"data:".concat(t,";base64,").concat(btoa(i.join("")))}function Qi(r){var t=new DataView(r),i;try{var e,n,a;if(t.getUint8(0)===255&&t.getUint8(1)===216)for(var o=t.byteLength,s=2;s+1<o;){if(t.getUint8(s)===255&&t.getUint8(s+1)===225){n=s;break}s+=1}if(n){var d=n+4,l=n+10;if($i(t,d,4)==="Exif"){var h=t.getUint16(l);if(e=h===18761,(e||h===19789)&&t.getUint16(l+2,e)===42){var c=t.getUint32(l+4,e);c>=8&&(a=l+c)}}}if(a){var p=t.getUint16(a,e),b,w;for(w=0;w<p;w+=1)if(b=a+w*12+2,t.getUint16(b,e)===274){b+=8,i=t.getUint16(b,e),t.setUint16(b,1,e);break}}}catch{i=1}return i}function Ki(r){var t=0,i=1,e=1;switch(r){case 2:i=-1;break;case 3:t=-180;break;case 4:e=-1;break;case 5:t=90,e=-1;break;case 6:t=90;break;case 7:t=90,i=-1;break;case 8:t=-90;break}return{rotate:t,scaleX:i,scaleY:e}}var Ji={render:function(){this.initContainer(),this.initCanvas(),this.initCropBox(),this.renderCanvas(),this.cropped&&this.renderCropBox()},initContainer:function(){var t=this.element,i=this.options,e=this.container,n=this.cropper,a=Number(i.minContainerWidth),o=Number(i.minContainerHeight);I(n,Y),at(t,Y);var s={width:Math.max(e.offsetWidth,a>=0?a:Ne),height:Math.max(e.offsetHeight,o>=0?o:Le)};this.containerData=s,lt(n,{width:s.width,height:s.height}),I(t,Y),at(n,Y)},initCanvas:function(){var t=this.containerData,i=this.imageData,e=this.options.viewMode,n=Math.abs(i.rotate)%180===90,a=n?i.naturalHeight:i.naturalWidth,o=n?i.naturalWidth:i.naturalHeight,s=a/o,d=t.width,l=t.height;t.height*s>t.width?e===3?d=t.height*s:l=t.width/s:e===3?l=t.width/s:d=t.height*s;var h={aspectRatio:s,naturalWidth:a,naturalHeight:o,width:d,height:l};this.canvasData=h,this.limited=e===1||e===2,this.limitCanvas(!0,!0),h.width=Math.min(Math.max(h.width,h.minWidth),h.maxWidth),h.height=Math.min(Math.max(h.height,h.minHeight),h.maxHeight),h.left=(t.width-h.width)/2,h.top=(t.height-h.height)/2,h.oldLeft=h.left,h.oldTop=h.top,this.initialCanvasData=T({},h)},limitCanvas:function(t,i){var e=this.options,n=this.containerData,a=this.canvasData,o=this.cropBoxData,s=e.viewMode,d=a.aspectRatio,l=this.cropped&&o;if(t){var h=Number(e.minCanvasWidth)||0,c=Number(e.minCanvasHeight)||0;s>1?(h=Math.max(h,n.width),c=Math.max(c,n.height),s===3&&(c*d>h?h=c*d:c=h/d)):s>0&&(h?h=Math.max(h,l?o.width:0):c?c=Math.max(c,l?o.height:0):l&&(h=o.width,c=o.height,c*d>h?h=c*d:c=h/d));var p=pt({aspectRatio:d,width:h,height:c});h=p.width,c=p.height,a.minWidth=h,a.minHeight=c,a.maxWidth=1/0,a.maxHeight=1/0}if(i)if(s>(l?0:1)){var b=n.width-a.width,w=n.height-a.height;a.minLeft=Math.min(0,b),a.minTop=Math.min(0,w),a.maxLeft=Math.max(0,b),a.maxTop=Math.max(0,w),l&&this.limited&&(a.minLeft=Math.min(o.left,o.left+(o.width-a.width)),a.minTop=Math.min(o.top,o.top+(o.height-a.height)),a.maxLeft=o.left,a.maxTop=o.top,s===2&&(a.width>=n.width&&(a.minLeft=Math.min(0,b),a.maxLeft=Math.max(0,b)),a.height>=n.height&&(a.minTop=Math.min(0,w),a.maxTop=Math.max(0,w))))}else a.minLeft=-a.width,a.minTop=-a.height,a.maxLeft=n.width,a.maxTop=n.height},renderCanvas:function(t,i){var e=this.canvasData,n=this.imageData;if(i){var a=Zi({width:n.naturalWidth*Math.abs(n.scaleX||1),height:n.naturalHeight*Math.abs(n.scaleY||1),degree:n.rotate||0}),o=a.width,s=a.height,d=e.width*(o/e.naturalWidth),l=e.height*(s/e.naturalHeight);e.left-=(d-e.width)/2,e.top-=(l-e.height)/2,e.width=d,e.height=l,e.aspectRatio=o/s,e.naturalWidth=o,e.naturalHeight=s,this.limitCanvas(!0,!1)}(e.width>e.maxWidth||e.width<e.minWidth)&&(e.left=e.oldLeft),(e.height>e.maxHeight||e.height<e.minHeight)&&(e.top=e.oldTop),e.width=Math.min(Math.max(e.width,e.minWidth),e.maxWidth),e.height=Math.min(Math.max(e.height,e.minHeight),e.maxHeight),this.limitCanvas(!1,!0),e.left=Math.min(Math.max(e.left,e.minLeft),e.maxLeft),e.top=Math.min(Math.max(e.top,e.minTop),e.maxTop),e.oldLeft=e.left,e.oldTop=e.top,lt(this.canvas,T({width:e.width,height:e.height},At({translateX:e.left,translateY:e.top}))),this.renderImage(t),this.cropped&&this.limited&&this.limitCropBox(!0,!0)},renderImage:function(t){var i=this.canvasData,e=this.imageData,n=e.naturalWidth*(i.width/i.naturalWidth),a=e.naturalHeight*(i.height/i.naturalHeight);T(e,{width:n,height:a,left:(i.width-n)/2,top:(i.height-a)/2}),lt(this.image,T({width:e.width,height:e.height},At(T({translateX:e.left,translateY:e.top},e)))),t&&this.output()},initCropBox:function(){var t=this.options,i=this.canvasData,e=t.aspectRatio||t.initialAspectRatio,n=Number(t.autoCropArea)||.8,a={width:i.width,height:i.height};e&&(i.height*e>i.width?a.height=a.width/e:a.width=a.height*e),this.cropBoxData=a,this.limitCropBox(!0,!0),a.width=Math.min(Math.max(a.width,a.minWidth),a.maxWidth),a.height=Math.min(Math.max(a.height,a.minHeight),a.maxHeight),a.width=Math.max(a.minWidth,a.width*n),a.height=Math.max(a.minHeight,a.height*n),a.left=i.left+(i.width-a.width)/2,a.top=i.top+(i.height-a.height)/2,a.oldLeft=a.left,a.oldTop=a.top,this.initialCropBoxData=T({},a)},limitCropBox:function(t,i){var e=this.options,n=this.containerData,a=this.canvasData,o=this.cropBoxData,s=this.limited,d=e.aspectRatio;if(t){var l=Number(e.minCropBoxWidth)||0,h=Number(e.minCropBoxHeight)||0,c=s?Math.min(n.width,a.width,a.width+a.left,n.width-a.left):n.width,p=s?Math.min(n.height,a.height,a.height+a.top,n.height-a.top):n.height;l=Math.min(l,n.width),h=Math.min(h,n.height),d&&(l&&h?h*d>l?h=l/d:l=h*d:l?h=l/d:h&&(l=h*d),p*d>c?p=c/d:c=p*d),o.minWidth=Math.min(l,c),o.minHeight=Math.min(h,p),o.maxWidth=c,o.maxHeight=p}i&&(s?(o.minLeft=Math.max(0,a.left),o.minTop=Math.max(0,a.top),o.maxLeft=Math.min(n.width,a.left+a.width)-o.width,o.maxTop=Math.min(n.height,a.top+a.height)-o.height):(o.minLeft=0,o.minTop=0,o.maxLeft=n.width-o.width,o.maxTop=n.height-o.height))},renderCropBox:function(){var t=this.options,i=this.containerData,e=this.cropBoxData;(e.width>e.maxWidth||e.width<e.minWidth)&&(e.left=e.oldLeft),(e.height>e.maxHeight||e.height<e.minHeight)&&(e.top=e.oldTop),e.width=Math.min(Math.max(e.width,e.minWidth),e.maxWidth),e.height=Math.min(Math.max(e.height,e.minHeight),e.maxHeight),this.limitCropBox(!1,!0),e.left=Math.min(Math.max(e.left,e.minLeft),e.maxLeft),e.top=Math.min(Math.max(e.top,e.minTop),e.maxTop),e.oldLeft=e.left,e.oldTop=e.top,t.movable&&t.cropBoxMovable&&Rt(this.face,Lt,e.width>=i.width&&e.height>=i.height?nt:ft),lt(this.cropBox,T({width:e.width,height:e.height},At({translateX:e.left,translateY:e.top}))),this.cropped&&this.limited&&this.limitCanvas(!0,!0),this.disabled||this.output()},output:function(){this.preview(),yt(this.element,Kt,this.getData())}},tr={initPreview:function(){var t=this.element,i=this.crossOrigin,e=this.options.preview,n=i?this.crossOriginUrl:this.url,a=t.alt||"The image to preview",o=document.createElement("img");if(i&&(o.crossOrigin=i),o.src=n,o.alt=a,this.viewBox.appendChild(o),this.viewBoxImage=o,!!e){var s=e;typeof e=="string"?s=t.ownerDocument.querySelectorAll(e):e.querySelector&&(s=[e]),this.previews=s,A(s,function(d){var l=document.createElement("img");Rt(d,_t,{width:d.offsetWidth,height:d.offsetHeight,html:d.innerHTML}),i&&(l.crossOrigin=i),l.src=n,l.alt=a,l.style.cssText='display:block;width:100%;height:auto;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;image-orientation:0deg!important;"',d.innerHTML="",d.appendChild(l)})}},resetPreview:function(){A(this.previews,function(t){var i=oe(t,_t);lt(t,{width:i.width,height:i.height}),t.innerHTML=i.html,Yi(t,_t)})},preview:function(){var t=this.imageData,i=this.canvasData,e=this.cropBoxData,n=e.width,a=e.height,o=t.width,s=t.height,d=e.left-i.left-t.left,l=e.top-i.top-t.top;!this.cropped||this.disabled||(lt(this.viewBoxImage,T({width:o,height:s},At(T({translateX:-d,translateY:-l},t)))),A(this.previews,function(h){var c=oe(h,_t),p=c.width,b=c.height,w=p,O=b,M=1;n&&(M=p/n,O=a*M),a&&O>b&&(M=b/a,w=n*M,O=b),lt(h,{width:w,height:O}),lt(h.getElementsByTagName("img")[0],T({width:o*M,height:s*M},At(T({translateX:-d*M,translateY:-l*M},t))))}))}},er={bind:function(){var t=this.element,i=this.options,e=this.cropper;X(i.cropstart)&&q(t,ee,i.cropstart),X(i.cropmove)&&q(t,te,i.cropmove),X(i.cropend)&&q(t,Jt,i.cropend),X(i.crop)&&q(t,Kt,i.crop),X(i.zoom)&&q(t,ie,i.zoom),q(e,ye,this.onCropStart=this.cropStart.bind(this)),i.zoomable&&i.zoomOnWheel&&q(e,Oe,this.onWheel=this.wheel.bind(this),{passive:!1,capture:!0}),i.toggleDragModeOnDblclick&&q(e,xe,this.onDblclick=this.dblclick.bind(this)),q(t.ownerDocument,Me,this.onCropMove=this.cropMove.bind(this)),q(t.ownerDocument,Ee,this.onCropEnd=this.cropEnd.bind(this)),i.responsive&&q(window,Te,this.onResize=this.resize.bind(this))},unbind:function(){var t=this.element,i=this.options,e=this.cropper;X(i.cropstart)&&tt(t,ee,i.cropstart),X(i.cropmove)&&tt(t,te,i.cropmove),X(i.cropend)&&tt(t,Jt,i.cropend),X(i.crop)&&tt(t,Kt,i.crop),X(i.zoom)&&tt(t,ie,i.zoom),tt(e,ye,this.onCropStart),i.zoomable&&i.zoomOnWheel&&tt(e,Oe,this.onWheel,{passive:!1,capture:!0}),i.toggleDragModeOnDblclick&&tt(e,xe,this.onDblclick),tt(t.ownerDocument,Me,this.onCropMove),tt(t.ownerDocument,Ee,this.onCropEnd),i.responsive&&tt(window,Te,this.onResize)}},ir={resize:function(){if(!this.disabled){var t=this.options,i=this.container,e=this.containerData,n=i.offsetWidth/e.width,a=i.offsetHeight/e.height,o=Math.abs(n-1)>Math.abs(a-1)?n:a;if(o!==1){var s,d;t.restore&&(s=this.getCanvasData(),d=this.getCropBoxData()),this.render(),t.restore&&(this.setCanvasData(A(s,function(l,h){s[h]=l*o})),this.setCropBoxData(A(d,function(l,h){d[h]=l*o})))}}},dblclick:function(){this.disabled||this.options.dragMode===Ce||this.setDragMode(Vi(this.dragBox,qt)?be:Qt)},wheel:function(t){var i=this,e=Number(this.options.wheelZoomRatio)||.1,n=1;this.disabled||(t.preventDefault(),!this.wheeling&&(this.wheeling=!0,setTimeout(function(){i.wheeling=!1},50),t.deltaY?n=t.deltaY>0?1:-1:t.wheelDelta?n=-t.wheelDelta/120:t.detail&&(n=t.detail>0?1:-1),this.zoom(-n*e,t)))},cropStart:function(t){var i=t.buttons,e=t.button;if(!(this.disabled||(t.type==="mousedown"||t.type==="pointerdown"&&t.pointerType==="mouse")&&(m(i)&&i!==1||m(e)&&e!==0||t.ctrlKey))){var n=this.options,a=this.pointers,o;t.changedTouches?A(t.changedTouches,function(s){a[s.identifier]=Vt(s)}):a[t.pointerId||0]=Vt(t),Object.keys(a).length>1&&n.zoomable&&n.zoomOnTouch?o=G:o=oe(t.target,Lt),Ni.test(o)&&yt(this.element,ee,{originalEvent:t,action:o})!==!1&&(t.preventDefault(),this.action=o,this.cropping=!1,o===ut&&(this.cropping=!0,I(this.dragBox,zt)))}},cropMove:function(t){var i=this.action;if(!(this.disabled||!i)){var e=this.pointers;t.preventDefault(),yt(this.element,te,{originalEvent:t,action:i})!==!1&&(t.changedTouches?A(t.changedTouches,function(n){T(e[n.identifier]||{},Vt(n,!0))}):T(e[t.pointerId||0]||{},Vt(t,!0)),this.change(t))}},cropEnd:function(t){if(!this.disabled){var i=this.action,e=this.pointers;t.changedTouches?A(t.changedTouches,function(n){delete e[n.identifier]}):delete e[t.pointerId||0],i&&(t.preventDefault(),Object.keys(e).length||(this.action=""),this.cropping&&(this.cropping=!1,xt(this.dragBox,zt,this.cropped&&this.options.modal)),yt(this.element,Jt,{originalEvent:t,action:i}))}}},rr={change:function(t){var i=this.options,e=this.canvasData,n=this.containerData,a=this.cropBoxData,o=this.pointers,s=this.action,d=i.aspectRatio,l=a.left,h=a.top,c=a.width,p=a.height,b=l+c,w=h+p,O=0,M=0,k=n.width,z=n.height,H=!0,st;!d&&t.shiftKey&&(d=c&&p?c/p:1),this.limited&&(O=a.minLeft,M=a.minTop,k=O+Math.min(n.width,e.width,e.left+e.width),z=M+Math.min(n.height,e.height,e.top+e.height));var j=o[Object.keys(o)[0]],f={x:j.endX-j.startX,y:j.endY-j.startY},E=function(F){switch(F){case _:b+f.x>k&&(f.x=k-b);break;case P:l+f.x<O&&(f.x=O-l);break;case ct:h+f.y<M&&(f.y=M-h);break;case rt:w+f.y>z&&(f.y=z-w);break}};switch(s){case ft:l+=f.x,h+=f.y;break;case _:if(f.x>=0&&(b>=k||d&&(h<=M||w>=z))){H=!1;break}E(_),c+=f.x,c<0&&(s=P,c=-c,l-=c),d&&(p=c/d,h+=(a.height-p)/2);break;case ct:if(f.y<=0&&(h<=M||d&&(l<=O||b>=k))){H=!1;break}E(ct),p-=f.y,h+=f.y,p<0&&(s=rt,p=-p,h-=p),d&&(c=p*d,l+=(a.width-c)/2);break;case P:if(f.x<=0&&(l<=O||d&&(h<=M||w>=z))){H=!1;break}E(P),c-=f.x,l+=f.x,c<0&&(s=_,c=-c,l-=c),d&&(p=c/d,h+=(a.height-p)/2);break;case rt:if(f.y>=0&&(w>=z||d&&(l<=O||b>=k))){H=!1;break}E(rt),p+=f.y,p<0&&(s=ct,p=-p,h-=p),d&&(c=p*d,l+=(a.width-c)/2);break;case Tt:if(d){if(f.y<=0&&(h<=M||b>=k)){H=!1;break}E(ct),p-=f.y,h+=f.y,c=p*d}else E(ct),E(_),f.x>=0?b<k?c+=f.x:f.y<=0&&h<=M&&(H=!1):c+=f.x,f.y<=0?h>M&&(p-=f.y,h+=f.y):(p-=f.y,h+=f.y);c<0&&p<0?(s=Nt,p=-p,c=-c,h-=p,l-=c):c<0?(s=Ot,c=-c,l-=c):p<0&&(s=St,p=-p,h-=p);break;case Ot:if(d){if(f.y<=0&&(h<=M||l<=O)){H=!1;break}E(ct),p-=f.y,h+=f.y,c=p*d,l+=a.width-c}else E(ct),E(P),f.x<=0?l>O?(c-=f.x,l+=f.x):f.y<=0&&h<=M&&(H=!1):(c-=f.x,l+=f.x),f.y<=0?h>M&&(p-=f.y,h+=f.y):(p-=f.y,h+=f.y);c<0&&p<0?(s=St,p=-p,c=-c,h-=p,l-=c):c<0?(s=Tt,c=-c,l-=c):p<0&&(s=Nt,p=-p,h-=p);break;case Nt:if(d){if(f.x<=0&&(l<=O||w>=z)){H=!1;break}E(P),c-=f.x,l+=f.x,p=c/d}else E(rt),E(P),f.x<=0?l>O?(c-=f.x,l+=f.x):f.y>=0&&w>=z&&(H=!1):(c-=f.x,l+=f.x),f.y>=0?w<z&&(p+=f.y):p+=f.y;c<0&&p<0?(s=Tt,p=-p,c=-c,h-=p,l-=c):c<0?(s=St,c=-c,l-=c):p<0&&(s=Ot,p=-p,h-=p);break;case St:if(d){if(f.x>=0&&(b>=k||w>=z)){H=!1;break}E(_),c+=f.x,p=c/d}else E(rt),E(_),f.x>=0?b<k?c+=f.x:f.y>=0&&w>=z&&(H=!1):c+=f.x,f.y>=0?w<z&&(p+=f.y):p+=f.y;c<0&&p<0?(s=Ot,p=-p,c=-c,h-=p,l-=c):c<0?(s=Nt,c=-c,l-=c):p<0&&(s=Tt,p=-p,h-=p);break;case nt:this.move(f.x,f.y),H=!1;break;case G:this.zoom(Wi(o),t),H=!1;break;case ut:if(!f.x||!f.y){H=!1;break}st=Ie(this.cropper),l=j.startX-st.left,h=j.startY-st.top,c=a.minWidth,p=a.minHeight,f.x>0?s=f.y>0?St:Tt:f.x<0&&(l-=c,s=f.y>0?Nt:Ot),f.y<0&&(h-=p),this.cropped||(at(this.cropBox,Y),this.cropped=!0,this.limited&&this.limitCropBox(!0,!0));break}H&&(a.width=c,a.height=p,a.left=l,a.top=h,this.action=s,this.renderCropBox()),A(o,function(B){B.startX=B.endX,B.startY=B.endY})}},ar={crop:function(){return this.ready&&!this.cropped&&!this.disabled&&(this.cropped=!0,this.limitCropBox(!0,!0),this.options.modal&&I(this.dragBox,zt),at(this.cropBox,Y),this.setCropBoxData(this.initialCropBoxData)),this},reset:function(){return this.ready&&!this.disabled&&(this.imageData=T({},this.initialImageData),this.canvasData=T({},this.initialCanvasData),this.cropBoxData=T({},this.initialCropBoxData),this.renderCanvas(),this.cropped&&this.renderCropBox()),this},clear:function(){return this.cropped&&!this.disabled&&(T(this.cropBoxData,{left:0,top:0,width:0,height:0}),this.cropped=!1,this.renderCropBox(),this.limitCanvas(!0,!0),this.renderCanvas(),at(this.dragBox,zt),I(this.cropBox,Y)),this},replace:function(t){var i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;return!this.disabled&&t&&(this.isImg&&(this.element.src=t),i?(this.url=t,this.image.src=t,this.ready&&(this.viewBoxImage.src=t,A(this.previews,function(e){e.getElementsByTagName("img")[0].src=t}))):(this.isImg&&(this.replaced=!0),this.options.data=null,this.uncreate(),this.load(t))),this},enable:function(){return this.ready&&this.disabled&&(this.disabled=!1,at(this.cropper,ve)),this},disable:function(){return this.ready&&!this.disabled&&(this.disabled=!0,I(this.cropper,ve)),this},destroy:function(){var t=this.element;return t[y]?(t[y]=void 0,this.isImg&&this.replaced&&(t.src=this.originalUrl),this.uncreate(),this):this},move:function(t){var i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:t,e=this.canvasData,n=e.left,a=e.top;return this.moveTo(re(t)?t:n+Number(t),re(i)?i:a+Number(i))},moveTo:function(t){var i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:t,e=this.canvasData,n=!1;return t=Number(t),i=Number(i),this.ready&&!this.disabled&&this.options.movable&&(m(t)&&(e.left=t,n=!0),m(i)&&(e.top=i,n=!0),n&&this.renderCanvas(!0)),this},zoom:function(t,i){var e=this.canvasData;return t=Number(t),t<0?t=1/(1-t):t=1+t,this.zoomTo(e.width*t/e.naturalWidth,null,i)},zoomTo:function(t,i,e){var n=this.options,a=this.canvasData,o=a.width,s=a.height,d=a.naturalWidth,l=a.naturalHeight;if(t=Number(t),t>=0&&this.ready&&!this.disabled&&n.zoomable){var h=d*t,c=l*t;if(yt(this.element,ie,{ratio:t,oldRatio:o/d,originalEvent:e})===!1)return this;if(e){var p=this.pointers,b=Ie(this.cropper),w=p&&Object.keys(p).length?Ui(p):{pageX:e.pageX,pageY:e.pageY};a.left-=(h-o)*((w.pageX-b.left-a.left)/o),a.top-=(c-s)*((w.pageY-b.top-a.top)/s)}else bt(i)&&m(i.x)&&m(i.y)?(a.left-=(h-o)*((i.x-a.left)/o),a.top-=(c-s)*((i.y-a.top)/s)):(a.left-=(h-o)/2,a.top-=(c-s)/2);a.width=h,a.height=c,this.renderCanvas(!0)}return this},rotate:function(t){return this.rotateTo((this.imageData.rotate||0)+Number(t))},rotateTo:function(t){return t=Number(t),m(t)&&this.ready&&!this.disabled&&this.options.rotatable&&(this.imageData.rotate=t%360,this.renderCanvas(!0,!0)),this},scaleX:function(t){var i=this.imageData.scaleY;return this.scale(t,m(i)?i:1)},scaleY:function(t){var i=this.imageData.scaleX;return this.scale(m(i)?i:1,t)},scale:function(t){var i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:t,e=this.imageData,n=!1;return t=Number(t),i=Number(i),this.ready&&!this.disabled&&this.options.scalable&&(m(t)&&(e.scaleX=t,n=!0),m(i)&&(e.scaleY=i,n=!0),n&&this.renderCanvas(!0,!0)),this},getData:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1,i=this.options,e=this.imageData,n=this.canvasData,a=this.cropBoxData,o;if(this.ready&&this.cropped){o={x:a.left-n.left,y:a.top-n.top,width:a.width,height:a.height};var s=e.width/e.naturalWidth;if(A(o,function(h,c){o[c]=h/s}),t){var d=Math.round(o.y+o.height),l=Math.round(o.x+o.width);o.x=Math.round(o.x),o.y=Math.round(o.y),o.width=l-o.x,o.height=d-o.y}}else o={x:0,y:0,width:0,height:0};return i.rotatable&&(o.rotate=e.rotate||0),i.scalable&&(o.scaleX=e.scaleX||1,o.scaleY=e.scaleY||1),o},setData:function(t){var i=this.options,e=this.imageData,n=this.canvasData,a={};if(this.ready&&!this.disabled&&bt(t)){var o=!1;i.rotatable&&m(t.rotate)&&t.rotate!==e.rotate&&(e.rotate=t.rotate,o=!0),i.scalable&&(m(t.scaleX)&&t.scaleX!==e.scaleX&&(e.scaleX=t.scaleX,o=!0),m(t.scaleY)&&t.scaleY!==e.scaleY&&(e.scaleY=t.scaleY,o=!0)),o&&this.renderCanvas(!0,!0);var s=e.width/e.naturalWidth;m(t.x)&&(a.left=t.x*s+n.left),m(t.y)&&(a.top=t.y*s+n.top),m(t.width)&&(a.width=t.width*s),m(t.height)&&(a.height=t.height*s),this.setCropBoxData(a)}return this},getContainerData:function(){return this.ready?T({},this.containerData):{}},getImageData:function(){return this.sized?T({},this.imageData):{}},getCanvasData:function(){var t=this.canvasData,i={};return this.ready&&A(["left","top","width","height","naturalWidth","naturalHeight"],function(e){i[e]=t[e]}),i},setCanvasData:function(t){var i=this.canvasData,e=i.aspectRatio;return this.ready&&!this.disabled&&bt(t)&&(m(t.left)&&(i.left=t.left),m(t.top)&&(i.top=t.top),m(t.width)?(i.width=t.width,i.height=t.width/e):m(t.height)&&(i.height=t.height,i.width=t.height*e),this.renderCanvas(!0)),this},getCropBoxData:function(){var t=this.cropBoxData,i;return this.ready&&this.cropped&&(i={left:t.left,top:t.top,width:t.width,height:t.height}),i||{}},setCropBoxData:function(t){var i=this.cropBoxData,e=this.options.aspectRatio,n,a;return this.ready&&this.cropped&&!this.disabled&&bt(t)&&(m(t.left)&&(i.left=t.left),m(t.top)&&(i.top=t.top),m(t.width)&&t.width!==i.width&&(n=!0,i.width=t.width),m(t.height)&&t.height!==i.height&&(a=!0,i.height=t.height),e&&(n?i.height=i.width/e:a&&(i.width=i.height*e)),this.renderCropBox()),this},getCroppedCanvas:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(!this.ready||!window.HTMLCanvasElement)return null;var i=this.canvasData,e=ji(this.image,this.imageData,i,t);if(!this.cropped)return e;var n=this.getData(),a=n.x,o=n.y,s=n.width,d=n.height,l=e.width/Math.floor(i.naturalWidth);l!==1&&(a*=l,o*=l,s*=l,d*=l);var h=s/d,c=pt({aspectRatio:h,width:t.maxWidth||1/0,height:t.maxHeight||1/0}),p=pt({aspectRatio:h,width:t.minWidth||0,height:t.minHeight||0},"cover"),b=pt({aspectRatio:h,width:t.width||(l!==1?e.width:s),height:t.height||(l!==1?e.height:d)}),w=b.width,O=b.height;w=Math.min(c.width,Math.max(p.width,w)),O=Math.min(c.height,Math.max(p.height,O));var M=document.createElement("canvas"),k=M.getContext("2d");M.width=Ct(w),M.height=Ct(O),k.fillStyle=t.fillColor||"transparent",k.fillRect(0,0,w,O);var z=t.imageSmoothingEnabled,H=z===void 0?!0:z,st=t.imageSmoothingQuality;k.imageSmoothingEnabled=H,st&&(k.imageSmoothingQuality=st);var j=e.width,f=e.height,E=a,B=o,F,ht,mt,vt,dt,ot;E<=-s||E>j?(E=0,F=0,mt=0,dt=0):E<=0?(mt=-E,E=0,F=Math.min(j,s+E),dt=F):E<=j&&(mt=0,F=Math.min(s,j-E),dt=F),F<=0||B<=-d||B>f?(B=0,ht=0,vt=0,ot=0):B<=0?(vt=-B,B=0,ht=Math.min(f,d+B),ot=ht):B<=f&&(vt=0,ht=Math.min(d,f-B),ot=ht);var W=[E,B,F,ht];if(dt>0&&ot>0){var wt=w/s;W.push(mt*wt,vt*wt,dt*wt,ot*wt)}return k.drawImage.apply(k,[e].concat(U(W.map(function(Pt){return Math.floor(Ct(Pt))})))),M},setAspectRatio:function(t){var i=this.options;return!this.disabled&&!re(t)&&(i.aspectRatio=Math.max(0,t)||NaN,this.ready&&(this.initCropBox(),this.cropped&&this.renderCropBox())),this},setDragMode:function(t){var i=this.options,e=this.dragBox,n=this.face;if(this.ready&&!this.disabled){var a=t===Qt,o=i.movable&&t===be;t=a||o?t:Ce,i.dragMode=t,Rt(e,Lt,t),xt(e,qt,a),xt(e,Ft,o),i.cropBoxMovable||(Rt(n,Lt,t),xt(n,qt,a),xt(n,Ft,o))}return this}},or=C.Cropper,Pe=function(){function r(t){var i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};if(x(this,r),!t||!Ai.test(t.tagName))throw new Error("The first argument is required and must be an <img> or <canvas> element.");this.element=t,this.options=T({},Re,bt(i)&&i),this.cropped=!1,this.disabled=!1,this.pointers={},this.ready=!1,this.reloading=!1,this.replaced=!1,this.sized=!1,this.sizing=!1,this.init()}return S(r,[{key:"init",value:function(){var i=this.element,e=i.tagName.toLowerCase(),n;if(!i[y]){if(i[y]=this,e==="img"){if(this.isImg=!0,n=i.getAttribute("src")||"",this.originalUrl=n,!n)return;n=i.src}else e==="canvas"&&window.HTMLCanvasElement&&(n=i.toDataURL());this.load(n)}}},{key:"load",value:function(i){var e=this;if(i){this.url=i,this.imageData={};var n=this.element,a=this.options;if(!a.rotatable&&!a.scalable&&(a.checkOrientation=!1),!a.checkOrientation||!window.ArrayBuffer){this.clone();return}if(Li.test(i)){Ri.test(i)?this.read(qi(i)):this.clone();return}var o=new XMLHttpRequest,s=this.clone.bind(this);this.reloading=!0,this.xhr=o,o.onabort=s,o.onerror=s,o.ontimeout=s,o.onprogress=function(){o.getResponseHeader("content-type")!==Se&&o.abort()},o.onload=function(){e.read(o.response)},o.onloadend=function(){e.reloading=!1,e.xhr=null},a.checkCrossOrigin&&ze(i)&&n.crossOrigin&&(i=_e(i)),o.open("GET",i,!0),o.responseType="arraybuffer",o.withCredentials=n.crossOrigin==="use-credentials",o.send()}}},{key:"read",value:function(i){var e=this.options,n=this.imageData,a=Qi(i),o=0,s=1,d=1;if(a>1){this.url=Fi(i,Se);var l=Ki(a);o=l.rotate,s=l.scaleX,d=l.scaleY}e.rotatable&&(n.rotate=o),e.scalable&&(n.scaleX=s,n.scaleY=d),this.clone()}},{key:"clone",value:function(){var i=this.element,e=this.url,n=i.crossOrigin,a=e;this.options.checkCrossOrigin&&ze(e)&&(n||(n="anonymous"),a=_e(e)),this.crossOrigin=n,this.crossOriginUrl=a;var o=document.createElement("img");n&&(o.crossOrigin=n),o.src=a||e,o.alt=i.alt||"The image to crop",this.image=o,o.onload=this.start.bind(this),o.onerror=this.stop.bind(this),I(o,we),i.parentNode.insertBefore(o,i.nextSibling)}},{key:"start",value:function(){var i=this,e=this.image;e.onload=null,e.onerror=null,this.sizing=!0;var n=C.navigator&&/(?:iPad|iPhone|iPod).*?AppleWebKit/i.test(C.navigator.userAgent),a=function(l,h){T(i.imageData,{naturalWidth:l,naturalHeight:h,aspectRatio:l/h}),i.initialImageData=T({},i.imageData),i.sizing=!1,i.sized=!0,i.build()};if(e.naturalWidth&&!n){a(e.naturalWidth,e.naturalHeight);return}var o=document.createElement("img"),s=document.body||document.documentElement;this.sizingImage=o,o.onload=function(){a(o.width,o.height),n||s.removeChild(o)},o.src=e.src,n||(o.style.cssText="left:0;max-height:none!important;max-width:none!important;min-height:0!important;min-width:0!important;opacity:0;position:absolute;top:0;z-index:-1;",s.appendChild(o))}},{key:"stop",value:function(){var i=this.image;i.onload=null,i.onerror=null,i.parentNode.removeChild(i),this.image=null}},{key:"build",value:function(){if(!(!this.sized||this.ready)){var i=this.element,e=this.options,n=this.image,a=i.parentNode,o=document.createElement("div");o.innerHTML=Hi;var s=o.querySelector(".".concat(y,"-container")),d=s.querySelector(".".concat(y,"-canvas")),l=s.querySelector(".".concat(y,"-drag-box")),h=s.querySelector(".".concat(y,"-crop-box")),c=h.querySelector(".".concat(y,"-face"));this.container=a,this.cropper=s,this.canvas=d,this.dragBox=l,this.cropBox=h,this.viewBox=s.querySelector(".".concat(y,"-view-box")),this.face=c,d.appendChild(n),I(i,Y),a.insertBefore(s,i.nextSibling),this.isImg||at(n,we),this.initPreview(),this.bind(),e.initialAspectRatio=Math.max(0,e.initialAspectRatio)||NaN,e.aspectRatio=Math.max(0,e.aspectRatio)||NaN,e.viewMode=Math.max(0,Math.min(3,Math.round(e.viewMode)))||0,I(h,Y),e.guides||I(h.getElementsByClassName("".concat(y,"-dashed")),Y),e.center||I(h.getElementsByClassName("".concat(y,"-center")),Y),e.background&&I(s,"".concat(y,"-bg")),e.highlight||I(c,Di),e.cropBoxMovable&&(I(c,Ft),Rt(c,Lt,ft)),e.cropBoxResizable||(I(h.getElementsByClassName("".concat(y,"-line")),Y),I(h.getElementsByClassName("".concat(y,"-point")),Y)),this.render(),this.ready=!0,this.setDragMode(e.dragMode),e.autoCrop&&this.crop(),this.setData(e.data),X(e.ready)&&q(i,De,e.ready,{once:!0}),yt(i,De)}}},{key:"unbuild",value:function(){this.ready&&(this.ready=!1,this.unbind(),this.resetPreview(),this.cropper.parentNode.removeChild(this.cropper),at(this.element,Y))}},{key:"uncreate",value:function(){this.ready?(this.unbuild(),this.ready=!1,this.cropped=!1):this.sizing?(this.sizingImage.onload=null,this.sizing=!1,this.sized=!1):this.reloading?(this.xhr.onabort=null,this.xhr.abort()):this.image&&this.stop()}}],[{key:"noConflict",value:function(){return window.Cropper=or,r}},{key:"setDefaults",value:function(i){T(Re,bt(i)&&i)}}]),r}();return T(Pe.prototype,Ji,tr,er,ir,rr,ar),Pe})});var fi=Ze(jt=>{"use strict";K();Q();Object.defineProperty(jt,"__esModule",{value:!0});var Mt=qe(),lr=ci();function pi(u){return u&&typeof u=="object"&&"default"in u?u:{default:u}}var Ut=pi(Mt),pr=pi(lr);var Zt=function(){return Zt=Object.assign||function(v){for(var g,x=1,D=arguments.length;x<D;x++){g=arguments[x];for(var S in g)Object.prototype.hasOwnProperty.call(g,S)&&(v[S]=g[S])}return v},Zt.apply(this,arguments)};function li(u,v){var g={};for(var x in u)Object.prototype.hasOwnProperty.call(u,x)&&v.indexOf(x)<0&&(g[x]=u[x]);if(u!=null&&typeof Object.getOwnPropertySymbols=="function")for(var D=0,x=Object.getOwnPropertySymbols(u);D<x.length;D++)v.indexOf(x[D])<0&&Object.prototype.propertyIsEnumerable.call(u,x[D])&&(g[x[D]]=u[x[D]]);return g}var dr=function(u,v){v===void 0&&(v={});var g=v.enable,x=g===void 0?!0:g,D=v.scaleX,S=D===void 0?1:D,V=v.scaleY,U=V===void 0?1:V,J=v.zoomTo,N=J===void 0?0:J,L=v.rotateTo;x?u.enable():u.disable(),u.scaleX(S),u.scaleY(U),L!==void 0&&u.rotateTo(L),N>0&&u.zoomTo(N)},fr=function(){for(var u=[],v=0;v<arguments.length;v++)u[v]=arguments[v];var g=Mt.useRef(null);return Ut.default.useEffect(function(){u.forEach(function(x){x&&(typeof x=="function"?x(g.current):x.current=g.current)})},[u]),g},di=Ut.default.forwardRef(function(u,v){var g=li(u,[]),x=g.dragMode,D=x===void 0?"crop":x,S=g.src,V=g.style,U=g.className,J=g.crossOrigin,N=g.scaleX,L=g.scaleY,$=g.enable,Z=g.zoomTo,R=g.rotateTo,C=g.alt,et=C===void 0?"picture":C,it=g.ready,y=g.onInitialized,ft=li(g,["dragMode","src","style","className","crossOrigin","scaleX","scaleY","enable","zoomTo","rotateTo","alt","ready","onInitialized"]),ut={scaleY:L,scaleX:N,enable:$,zoomTo:Z,rotateTo:R},nt=Mt.useRef(null),G=fr(v,nt);return Mt.useEffect(function(){var _;!((_=G.current)===null||_===void 0)&&_.cropper&&typeof Z=="number"&&G.current.cropper.zoomTo(Z)},[g.zoomTo]),Mt.useEffect(function(){var _;!((_=G.current)===null||_===void 0)&&_.cropper&&typeof S<"u"&&G.current.cropper.reset().clear().replace(S)},[S]),Mt.useEffect(function(){if(G.current!==null){var _=new pr.default(G.current,Zt(Zt({dragMode:D},ft),{ready:function(P){P.currentTarget!==null&&dr(P.currentTarget.cropper,ut),it&&it(P)}}));y&&y(_)}return function(){var P,rt;(rt=(P=G.current)===null||P===void 0?void 0:P.cropper)===null||rt===void 0||rt.destroy()}},[G]),Ut.default.createElement("div",{style:V,className:U},Ut.default.createElement("img",{crossOrigin:J,src:S,alt:et,style:{opacity:0,maxWidth:"100%"},ref:G}))});jt.Cropper=di;jt.default=di});K();Q();hr();Ge();var yi=ce(cr());K();Q();var wi=ce(qe());Ge();var bi=ce(fi());K();Q();var ui=u=>preactH(ri,{xmlns:"http://www.w3.org/2000/svg",width:"32",height:"32",viewBox:"0 0 32 32",fill:"none",...u},preactH("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M29.2315 12.6391L29.1762 5.40519H27.1694C26.5702 5.40519 26.0415 5.01297 25.8678 4.43945L25.4197 2.96001H20.8626L20.299 4.50991C20.1036 5.0474 19.5928 5.40519 19.0209 5.40519H16.7373L16.7925 12.6359C20.9908 13.411 25.0337 13.412 29.2315 12.6391ZM31.952 12.6997C31.9615 13.9435 31.0931 15.0585 29.8272 15.295C25.2328 16.1534 20.792 16.1523 16.1974 15.2919C14.9471 15.0578 14.0826 13.9655 14.0732 12.7367L14.0167 5.34537C14.0055 3.87949 15.1907 2.68519 16.6566 2.68519L18.0683 2.68519L18.3254 1.9779C18.7048 0.934553 19.6964 0.240005 20.8065 0.240005H25.479C26.6423 0.240005 27.6685 1.00139 28.0057 2.11468L28.1785 2.68519H29.2556C30.7057 2.68519 31.8844 3.8549 31.8955 5.30502L31.952 12.6997ZM1.60004 25.6C1.60004 27.3673 3.03273 28.8 4.80004 28.8H9.60004C10.4837 28.8 11.2 28.0837 11.2 27.2C11.2 26.3164 10.4837 25.6 9.60004 25.6H4.80004V20C4.80004 19.1164 4.08369 18.4 3.20004 18.4C2.31638 18.4 1.60004 19.1164 1.60004 20V25.6ZM20.8 27.2C20.8 28.0837 21.5164 28.8 22.4 28.8H27.2C28.9674 28.8 30.4 27.3673 30.4 25.6V21.6C30.4 20.7164 29.6837 20 28.8 20C27.9164 20 27.2 20.7164 27.2 21.6V25.6H22.4C21.5164 25.6 20.8 26.3164 20.8 27.2ZM3.20004 13.6C4.08369 13.6 4.80004 12.8837 4.80004 12V6.40001H8.00004C8.88369 6.40001 9.60004 5.68366 9.60004 4.80001C9.60004 3.91635 8.88369 3.20001 8.00004 3.20001H4.80004C3.03273 3.20001 1.60004 4.6327 1.60004 6.40001V12C1.60004 12.8837 2.31638 13.6 3.20004 13.6ZM23.1688 11.3298C24.6656 11.3298 25.879 10.1164 25.879 8.61958C25.879 7.12278 24.6656 5.90938 23.1688 5.90938C21.672 5.90938 20.4586 7.12278 20.4586 8.61958C20.4586 10.1164 21.672 11.3298 23.1688 11.3298Z",fill:"#9899A6"}));K();Q();var gi=Bt.div`
  .cropper-container {
    direction: ltr;
    font-size: 0;
    line-height: 0;
    position: relative;
    -ms-touch-action: none;
    touch-action: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .cropper-container img {
    display: block;
    height: 100%;
    image-orientation: 0deg;
    max-height: none !important;
    max-width: none !important;
    min-height: 0 !important;
    min-width: 0 !important;
    width: 100%;
  }

  .cropper-wrap-box,
  .cropper-canvas,
  .cropper-drag-box,
  .cropper-crop-box,
  .cropper-modal {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .cropper-wrap-box,
  .cropper-canvas {
    overflow: hidden;
  }

  .cropper-drag-box,
  .cropper-modal {
    cursor: crosshair;
    mix-blend-mode: multiply;
    background-color: #9a9c9e;
  }

  .cropper-view-box {
    display: block;
    height: 100%;
    outline: 1px solid #39f;
    outline-color: rgba(51, 153, 255, 0.75);
    overflow: hidden;
    width: 100%;
  }

  .cropper-dashed {
    border: 0 dashed #eee;
    display: block;
    opacity: 0.5;
    position: absolute;
  }

  .cropper-dashed.dashed-h {
    border-bottom-width: 1px;
    border-top-width: 1px;
    height: calc(100% / 3);
    left: 0;
    top: calc(100% / 3);
    width: 100%;
  }

  .cropper-dashed.dashed-v {
    border-left-width: 1px;
    border-right-width: 1px;
    height: 100%;
    left: calc(100% / 3);
    top: 0;
    width: calc(100% / 3);
  }

  .cropper-center {
    display: block;
    height: 0;
    left: 50%;
    opacity: 0.75;
    position: absolute;
    top: 50%;
    width: 0;
  }

  .cropper-center::before,
  .cropper-center::after {
    background-color: #eee;
    content: ' ';
    display: block;
    position: absolute;
  }

  .cropper-center::before {
    height: 1px;
    left: -3px;
    top: 0;
    width: 7px;
  }

  .cropper-center::after {
    height: 7px;
    left: 0;
    top: -3px;
    width: 1px;
  }

  .cropper-face,
  .cropper-line,
  .cropper-point {
    display: block;
    height: 100%;
    opacity: 0.1;
    position: absolute;
    width: 100%;
  }

  .cropper-face {
    background-color: #fff;
    left: 0;
    top: 0;
  }

  .cropper-line {
    background-color: #39f;
  }

  .cropper-line.line-e {
    cursor: ew-resize;
    right: -3px;
    top: 0;
    width: 5px;
  }

  .cropper-line.line-n {
    cursor: ns-resize;
    height: 5px;
    left: 0;
    top: -3px;
  }

  .cropper-line.line-w {
    cursor: ew-resize;
    left: -3px;
    top: 0;
    width: 5px;
  }

  .cropper-line.line-s {
    bottom: -3px;
    cursor: ns-resize;
    height: 5px;
    left: 0;
  }

  .cropper-point {
    background-color: #39f;
    height: 5px;
    opacity: 0.75;
    width: 5px;
  }

  .cropper-point.point-e {
    cursor: ew-resize;
    margin-top: -3px;
    right: -3px;
    top: 50%;
  }

  .cropper-point.point-n {
    cursor: ns-resize;
    left: 50%;
    margin-left: -3px;
    top: -3px;
  }

  .cropper-point.point-w {
    cursor: ew-resize;
    left: -3px;
    margin-top: -3px;
    top: 50%;
  }

  .cropper-point.point-s {
    bottom: -3px;
    cursor: s-resize;
    left: 50%;
    margin-left: -3px;
  }

  .cropper-point.point-ne {
    cursor: nesw-resize;
    right: -3px;
    top: -3px;
  }

  .cropper-point.point-nw {
    cursor: nwse-resize;
    left: -3px;
    top: -3px;
  }

  .cropper-point.point-sw {
    bottom: -3px;
    cursor: nesw-resize;
    left: -3px;
  }

  .cropper-point.point-se {
    bottom: -3px;
    cursor: nwse-resize;
    right: -3px;
  }

  .cropper-point.point-se::before {
    background-color: #39f;
    bottom: -50%;
    content: ' ';
    display: block;
    height: 200%;
    opacity: 0;
    position: absolute;
    right: -50%;
    width: 200%;
  }

  .cropper-invisible {
    opacity: 0;
  }

  .cropper-hide {
    display: block;
    height: 0;
    position: absolute;
    width: 0;
  }

  .cropper-hidden {
    display: none !important;
  }

  .cropper-move {
    cursor: move;
  }

  .cropper-crop {
    cursor: crosshair;
  }

  .cropper-disabled .cropper-drag-box,
  .cropper-disabled .cropper-face,
  .cropper-disabled .cropper-line,
  .cropper-disabled .cropper-point {
    cursor: not-allowed;
  }
`,mi=Bt.div`
  align-items: center;
  background-color: #111112;
  border-radius: 6px;
  bottom: 40px;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-family: 'ABCDiatype';
  font-size: 14px;
  gap: 6px;
  line-height: 20px;
  padding: 8px 12px;
  position: absolute;
  right: 20px;
  z-index: 9999;

  .esc-key-button {
    align-items: center;
    background: #2d2d2f;
    border-radius: 2px;
    border: 0.5px solid #3c3c3e;
    color: #fff;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    gap: 0px;
    height: 16px;
    justify-content: center;
    letter-spacing: 0.12px;
    line-height: 16px;
    padding: 2px;
    text-align: center;
    width: 26px;
  }
`,vi=Bt.div`
  align-items: center;
  background-color: #111112;
  border-radius: 8px;
  color: #fff;
  display: ${({showHelper:u})=>u?"flex":"none"};
  font-family: 'ABCDiatype';
  left: 0;
  margin: auto;
  max-width: 390px;
  padding-left: 10px;
  position: absolute;
  right: 0;
  top: 60px;
  z-index: 9999;

  .icon-and-text-container {
    align-items: center;
    display: flex;
    padding: 10px 5px;
  }

  .text-container {
    margin-left: 12px;
  }

  h3 {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    margin: 0 0 4px 0;
  }

  p {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.01em;
    line-height: 16px;
    margin: 0px;
    padding: 0px;
  }

  .icon-container {
    align-items: center;
    background-color: #3c3c3e;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    height: 48px;
    width: 48px;

    svg {
      cursor: pointer;
      height: 32px;
      width: 32px;
    }
  }

  .close-icon {
    cursor: pointer;
    height: 14px;
    position: absolute;
    right: 10px;
    top: 10px;
    width: 14px;
  }
`,Lr=Bt.div`
  position: absolute;
  width: ${({width:u})=>u}px;
  height: ${({height:u})=>u}px;
  left: ${({left:u})=>u}px;
  top: ${({top:u})=>u}px;

  border: 1px dashed #778fad;
`;var ur=({src:u,root:v,onSelect:g})=>{let[x,D]=Yt(!0),S=Wt(null);(0,wi.useEffect)(()=>(document.addEventListener("keydown",$),()=>{document.removeEventListener("keydown",$),S?.current?.cropper?.destroy()}),[]);let V=async()=>{D(!1),S?.current?.cropper?.destroy(),fe(),Fe(),xi(),await Qe()},U=()=>{let C=S?.current?.cropper;C?.enable(),C?.clear(),D(!0)},J=()=>{V()},N=async()=>{try{let C=S?.current?.cropper,{top:et=0,left:it=0,width:y=0,height:ft=0}=C?.getCropBoxData()??{},ut=C?.getCroppedCanvas().toDataURL(),nt=C?.getCroppedCanvas();C?.disable(),nt?.width===window.innerWidth&&nt.height===window.innerHeight?await g(ut??"",{top:0,left:0,width:nt.width,height:nt.height},U):await g(ut??"",{top:et,left:it,width:y,height:ft},U)}catch(R){console.error(R)}},L=()=>{D(!1),fe()},$=R=>{(R.key==="Escape"||R.key==="Esc")&&V()},Z=je(()=>ei({key:"crop-emotion-cache",container:v}),[v]);return preactH(ii,{value:Z},preactH(vi,{showHelper:x},preactH("div",{className:"icon-and-text-container"},preactH("div",{className:"icon-container"},preactH(ui,{size:"32px"})),preactH("div",{className:"text-container"},preactH("h3",null,"Listen to the selected area"),preactH("p",null,"Drag your mouse across the area you want to listen to."))),preactH(hi,{className:"close-icon",width:"8px",onClick:J})),preactH(mi,{onClick:J,showHelper:x},"Press",preactH("div",{className:"esc-key-button"},"esc"),"to Exit Screenshot mode"),preactH(gi,null,preactH(bi.default,{src:u,ref:S,style:{height:"100%",width:"100%"},initialAspectRatio:1/1,guides:!1,autoCrop:!1,cropend:N,cropstart:L})))},Ci=ur;var It="speechify-screenshot-mode",me="speechify-screenshot-marker",Dt,Mi="",Ei="",Et=null,$t=null,Gt=u=>u.preventDefault(),gr=()=>{Ht.pause(),kt.getBundleState().currentContent?.metadata.source!=="Screenshot"&&(Et=kt.getBundleState().currentContent,$t=kt.getBundleState().cursor),document.body.style.position="relative",document.body.style.overflow="hidden",document.querySelector(`#${It}`).style.display="block",window.addEventListener("scroll",Gt,{capture:!0}),window.addEventListener("wheel",Gt,{capture:!0})},xi=async()=>{if(document.body.style.position=Mi,document.body.style.overflow=Ei,Et){Et.options?.autoplay&&(Et.options.autoplay=!1),kt.getPlayingState()==="playing"&&Ht.pause(),de(Et,!0);let u=await ti("PLAYABLE_CONTENT_UPDATED",async()=>{$t!==null&&(Ht.seekToCursor(yi.CursorQueryBuilder.fromCursor($t)),$t=null),u()});Et=null}document.querySelector(`#${It}`).style.display="none",window.removeEventListener("scroll",Gt,{capture:!0}),window.removeEventListener("wheel",Gt,{capture:!0})},mr=()=>document.querySelector(".kix-rotatingtilemanager");async function vr(){if(!Dt){let g=document.createElement("div");g.style||pe(new Error(`Error creating div element: ${JSON.stringify(window.location.href,null,2)}`),{context:{from:"initScreenshotMode",site:window.location.href}}),g.id=It,g.style.cssText="position: fixed; top: 0; right: 0; width: 100%; min-height: 100%; z-index: 2147483640; display: none !important;",document.body.appendChild(g),Dt=g.attachShadow({mode:"open"})}let u=document.createElement("div");u.id=`${It}-root`,u.style.width="100%",u.style.height="100%",u.style.position="relative",Dt.appendChild(u);let v=window.getComputedStyle(document.body);return Mi=v.getPropertyValue("position"),Ei=v.getPropertyValue("overflow"),le(preactH(br,{root:u}),u),wr}function wr(){if(!Dt)return;let u=Dt.querySelector(`#${It}-root`);u&&(le(()=>null,u),Dt.removeChild(u))}function br({root:u}){let{screenshotMode:v}=Je(),[g,x]=Yt([]),{enabled:D,visibleTabDataUrl:S,takingScreenshot:V}=v??{},U=Wt(null),J=$e(async(N,L,$)=>{try{U.current=$,si(N,L.width,L.height).then(Ke);let Z=N.replace("data:image/png;base64,",""),R=L.top+document.documentElement.scrollTop;x([R,L.left,L.width,L.height]);let C=await oi(Z,R,L.left);de(C,!0)}catch(Z){console.error(Z),ni("No text detected. Please take another screenshot.",{wrapperPadding:"5px",duration:0})}},[]);return Xt(()=>{let N=Ht.registerHook("PLAYBACK_STATE_CHANGED",async({state:L})=>{L==="ended"&&U.current&&U.current()});return()=>{N()}},[]),Xt(()=>{V&&S&&gr()},[V,S]),Xt(()=>{if(D&&g.length>=3&&!V){document.getElementById(me)?.remove();let N=document.createElement("div"),[L,$,Z,R]=g,C=ai()?mr():document.body;if(!C){pe(new Error("ScreenshotMode: elementToAppendTo is null"));return}let et=C.getBoundingClientRect(),it=C===document.body?0:et.top-C.scrollTop,y=C===document.body?0:et.left;N.id=me,N.setAttribute("style",`
        position: absolute;
        width: ${Z}px;
        height: ${R}px;
        left: ${$-y}px;
        top: ${L-it}px;
        border: 1px dashed #778fad;
        z-index: 2147483640;
        `),C.append(N)}else{let N=document.getElementById(me);N&&N.remove()}},[D,g,V]),S&&V&&D?preactH(Ci,{src:S,root:u,onSelect:J}):null}export{vr as default,wr as destroyScreenshotMode,xi as disableTakingScreenshotMode};
/*! Bundled license information:

cropperjs/dist/cropper.js:
  (*!
   * Cropper.js v1.5.12
   * https://fengyuanchen.github.io/cropperjs
   *
   * Copyright 2015-present Chen Fengyuan
   * Released under the MIT license
   *
   * Date: 2021-06-12T08:00:17.411Z
   *)

react-cropper/dist/react-cropper.umd.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
//# sourceMappingURL=init-LCCYJZVE.js.map
