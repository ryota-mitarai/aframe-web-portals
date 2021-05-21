!function(e){"function"==typeof define&&define.amd?define(e):e()}(function(){var e;!function(e){function t(s){if(i[s])return i[s].exports;var n=i[s]={exports:{},id:s,loaded:!1};return e[s].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var i={};t.m=e,t.c=i,t.p="",t(0)}([function(e,t){if("undefined"==typeof AFRAME)throw new Error("Component attempted to register before AFRAME was available.");var i={childList:!0,attributes:!0,subtree:!0};AFRAME.registerComponent("aabb-collider",{schema:{collideNonVisible:{default:!1},debug:{default:!1},enabled:{default:!0},interval:{default:80},objects:{default:""}},init:function(){this.centerDifferenceVec3=new THREE.Vector3,this.clearedIntersectedEls=[],this.closestIntersectedEl=null,this.boundingBox=new THREE.Box3,this.boxCenter=new THREE.Vector3,this.boxHelper=new THREE.BoxHelper,this.boxMax=new THREE.Vector3,this.boxMin=new THREE.Vector3,this.hitClosestClearEventDetail={},this.hitClosestEventDetail={},this.intersectedEls=[],this.objectEls=[],this.newIntersectedEls=[],this.prevCheckTime=void 0,this.previousIntersectedEls=[],this.setDirty=this.setDirty.bind(this),this.observer=new MutationObserver(this.setDirty),this.dirty=!0,this.hitStartEventDetail={intersectedEls:this.newIntersectedEls}},play:function(){this.observer.observe(this.el.sceneEl,i),this.el.sceneEl.addEventListener("object3dset",this.setDirty),this.el.sceneEl.addEventListener("object3dremove",this.setDirty)},remove:function(){this.observer.disconnect(),this.el.sceneEl.removeEventListener("object3dset",this.setDirty),this.el.sceneEl.removeEventListener("object3dremove",this.setDirty)},tick:function(e){var t,i,s,n,r=this.boundingBox,o=this.centerDifferenceVec3,l=this.clearedIntersectedEls,a=this.intersectedEls,c=this.el,d=this.newIntersectedEls,h=this.objectEls,u=this.prevCheckTime,m=this.previousIntersectedEls;if(this.data.enabled&&!(u&&e-u<this.data.interval)){for(this.prevCheckTime=e,this.dirty&&this.refreshObjects(),r.setFromObject(c.object3D),this.boxMin.copy(r.min),this.boxMax.copy(r.max),r.getCenter(this.boxCenter),this.data.debug&&(this.boxHelper.setFromObject(c.object3D),this.boxHelper.parent||c.sceneEl.object3D.add(this.boxHelper)),function(e,t){var i;for(e.length=0,i=0;i<t.length;i++)e[i]=t[i]}(m,a),a.length=0,n=0;n<h.length;n++)h[n]!==this.el&&(this.data.collideNonVisible||h[n].getAttribute("visible")?this.isIntersecting(h[n])&&a.push(h[n]):this.data.debug&&(t=h[n].object3D.boxHelper)&&(c.sceneEl.object3D.remove(t),h[n].object3D.boxHelper=null));for(d.length=0,n=0;n<a.length;n++)-1===m.indexOf(a[n])&&d.push(a[n]);for(l.length=0,n=0;n<m.length;n++)-1===a.indexOf(m[n])&&(m[n].hasAttribute("aabb-collider")||m[n].emit("hitend"),l.push(m[n]));for(n=0;n<d.length;n++)d[n]!==this.el&&(d[n].hasAttribute("aabb-collider")||d[n].emit("hitstart"));for(n=0;n<a.length;n++)a[n]!==this.el&&(o.copy(a[n].object3D.boundingBoxCenter).sub(this.boxCenter),(void 0===i||o.length()<i)&&(i=o.length(),s=a[n]));!a.length&&this.closestIntersectedEl?(this.hitClosestClearEventDetail.el=this.closestIntersectedEl,this.closestIntersectedEl.emit("hitclosestclear"),this.closestIntersectedEl=null,c.emit("hitclosestclear",this.hitClosestClearEventDetail)):s!==this.closestIntersectedEl&&(this.closestIntersectedEl&&(this.hitClosestClearEventDetail.el=this.closestIntersectedEl,this.closestIntersectedEl.emit("hitclosestclear",this.hitClosestClearEventDetail)),s&&(s.emit("hitclosest"),this.closestIntersectedEl=s,this.hitClosestEventDetail.el=s,c.emit("hitclosest",this.hitClosestEventDetail))),l.length&&c.emit("hitend"),d.length&&c.emit("hitstart",this.hitStartEventDetail)}},isIntersecting:function(){var e=new THREE.Box3;return function(t){var i,s;return e.setFromObject(t.object3D),this.data.debug&&(t.object3D.boxHelper||(t.object3D.boxHelper=new THREE.BoxHelper(t.object3D,new THREE.Color(Math.random(),Math.random(),Math.random())),t.sceneEl.object3D.add(t.object3D.boxHelper)),t.object3D.boxHelper.setFromObject(t.object3D)),i=e.min,s=e.max,t.object3D.boundingBoxCenter=t.object3D.boundingBoxCenter||new THREE.Vector3,e.getCenter(t.object3D.boundingBoxCenter),this.boxMin.x<=s.x&&this.boxMax.x>=i.x&&this.boxMin.y<=s.y&&this.boxMax.y>=i.y&&this.boxMin.z<=s.z&&this.boxMax.z>=i.z}}(),setDirty:function(){this.dirty=!0},refreshObjects:function(){var e=this.data;this.objectEls=e.objects?this.el.sceneEl.querySelectorAll(e.objects):this.el.sceneEl.children,this.dirty=!1}})}]),e=function(e){function t(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,i(e,t)}function i(e,t){return(i=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var s=function(e){function i(t){var i;return(i=e.call(this)||this).element=t||document.createElement("div"),i.element.style.position="absolute",i.element.style.pointerEvents="auto",i.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof Element&&null!==e.element.parentNode&&e.element.parentNode.removeChild(e.element)})}),i}return t(i,e),i.prototype.copy=function(t,i){return e.prototype.copy.call(this,t,i),this.element=t.element.cloneNode(!0),this},i}(THREE.Object3D);s.prototype.isCSS3DObject=!0,function(e){function i(t){var i;return(i=e.call(this,t)||this).rotation2D=0,i}return t(i,e),i.prototype.copy=function(t,i){return e.prototype.copy.call(this,t,i),this.rotation2D=t.rotation2D,this},i}(s).prototype.isCSS3DSprite=!0;var n=new THREE.Matrix4,r=new THREE.Matrix4,o=function(){var e,t,i,s,o=this,l={camera:{fov:0,style:""},objects:new WeakMap},a=document.createElement("div");a.style.overflow="hidden",this.domElement=a;var c=document.createElement("div");function d(e){return Math.abs(e)<1e-10?0:e}function h(e){var t=e.elements;return"matrix3d("+d(t[0])+","+d(-t[1])+","+d(t[2])+","+d(t[3])+","+d(t[4])+","+d(-t[5])+","+d(t[6])+","+d(t[7])+","+d(t[8])+","+d(-t[9])+","+d(t[10])+","+d(t[11])+","+d(t[12])+","+d(-t[13])+","+d(t[14])+","+d(t[15])+")"}function u(e){var t=e.elements;return"translate(-50%,-50%)matrix3d("+d(t[0])+","+d(t[1])+","+d(t[2])+","+d(t[3])+","+d(-t[4])+","+d(-t[5])+","+d(-t[6])+","+d(-t[7])+","+d(t[8])+","+d(t[9])+","+d(t[10])+","+d(t[11])+","+d(t[12])+","+d(t[13])+","+d(t[14])+","+d(t[15])+")"}function m(e,t,i,s){if(e.isCSS3DObject){var a;e.onBeforeRender(o,t,i),e.isCSS3DSprite?(n.copy(i.matrixWorldInverse),n.transpose(),0!==e.rotation2D&&n.multiply(r.makeRotationZ(e.rotation2D)),n.copyPosition(e.matrixWorld),n.scale(e.scale),n.elements[3]=0,n.elements[7]=0,n.elements[11]=0,n.elements[15]=1,a=u(n)):a=u(e.matrixWorld);var d=e.element,h=l.objects.get(e);void 0!==h&&h.style===a||(d.style.transform=a,l.objects.set(e,{style:a})),d.style.display=e.visible?"":"none",d.parentNode!==c&&c.appendChild(d),e.onAfterRender(o,t,i)}for(var p=0,b=e.children.length;p<b;p++)m(e.children[p],t,i)}c.style.transformStyle="preserve-3d",c.style.pointerEvents="none",a.appendChild(c),this.getSize=function(){return{width:e,height:t}},this.render=function(e,t){var n,r,o=t.projectionMatrix.elements[5]*s;l.camera.fov!==o&&(a.style.perspective=t.isPerspectiveCamera?o+"px":"",l.camera.fov=o),!0===e.autoUpdate&&e.updateMatrixWorld(),null===t.parent&&t.updateMatrixWorld(),t.isOrthographicCamera&&(n=-(t.right+t.left)/2,r=(t.top+t.bottom)/2);var u=(t.isOrthographicCamera?"scale("+o+")translate("+d(n)+"px,"+d(r)+"px)"+h(t.matrixWorldInverse):"translateZ("+o+"px)"+h(t.matrixWorldInverse))+"translate("+i+"px,"+s+"px)";l.camera.style!==u&&(c.style.transform=u,l.camera.style=u),m(e,e,t)},this.setSize=function(n,r){i=(e=n)/2,s=(t=r)/2,a.style.width=n+"px",a.style.height=r+"px",c.style.width=n+"px",c.style.height=r+"px"}},l=100,a=function(){function e(e,t){this.websurfaceEntity=t,this.enabled=!0,this.cssRenderer=new o,this.domElement=this.cssRenderer.domElement,this.cssCamera=new THREE.PerspectiveCamera(e.fov,e.aspect,e.near*l,e.far*l),this.camera=e,this.cssScene=new THREE.Scene,this.update=this.update.bind(this)}var t=e.prototype;return t.setSize=function(e,t){this.cssRenderer.setSize(e,t),this.cssCamera.aspect=e/t,this.cssCamera.updateProjectionMatrix()},t.update=function(){this.camera.getWorldPosition(this.cssCamera.position),this.cssCamera.position.multiplyScalar(l),this.camera.getWorldQuaternion(this.cssCamera.quaternion),this.cssRenderer.render(this.cssScene,this.cssCamera)},e}(),c=function(e){function i(t,i,n,r,o){var a,c=(void 0===o?{}:o).elementWidth,d=void 0===c?1280:c,h=new THREE.PlaneGeometry(n,r),u=new THREE.MeshBasicMaterial({opacity:0,blending:THREE.NoBlending,side:THREE.DoubleSide,color:new THREE.Color(0,0,0)});return(a=e.call(this,h,u)||this).context=t,a.domElement=i,a.aspectRatio=r/n,a.elementWidth=d,a.elementHeight=a.elementWidth*a.aspectRatio,a.width=n,a.height=r,a.resizeElement(),a.cssObject=new s(a.domElement),a.cssObject.scale.multiplyScalar(l/(a.elementWidth/a.width)),a.cssObjectInitialScale=a.cssObject.scale,a.size=new THREE.Vector3,a.box=new THREE.Box3,a.addEventListener("added",a.handleAdded),a.addEventListener("removed",a.handleRemoved),a.update=a.update.bind(function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(a)),a}t(i,e);var n=i.prototype;return n.handleAdded=function(){this.context.cssScene.add(this.cssObject)},n.handleRemoved=function(){this.context.cssScene.remove(this.cssObject)},n.resizeElement=function(){this.domElement.style.width=this.elementWidth+"px",this.domElement.style.height=this.elementHeight+"px"},n.setElement=function(e){this.domElement.parentNode&&this.domElement.parentNode.removeChild(this.domElement),this.domElement=e,this.cssObject.element=e,this.resizeElement()},n.update=function(e){this.cssObject.quaternion.copy(e.quaternion),this.cssObject.position.copy(e.position).multiplyScalar(l),this.box.setFromObject(this).getSize(this.size);var t=e.scale;this.oldScaleFactor!=t&&(this.oldScaleFactor=t,this.cssObject.scale.set(this.cssObjectInitialScale.x,this.cssObjectInitialScale.y,this.cssObjectInitialScale.z),this.cssObject.scale.multiply(t)),this.cssObject.visible=e.visible},n.dispose=function(){this.removeEventListener("added",this.handleAdded),this.removeEventListener("removed",this.handleRemoved),this.domElement.remove(),this.geometry.dispose(),this.material.dispose()},i}(THREE.Mesh),d=AFRAME.registerComponent("websurface",{schema:{url:{default:"https://aframe.io"},width:{default:1},height:{default:.75},isInteractable:{default:!0},frameSkips:{default:1},autoSceneStyling:{default:!0}},init:function(){var e=this.el,t=this.data;1==t.autoSceneStyling&&(e.sceneEl.style.position="absolute",e.sceneEl.style.zIndex="2"),1==t.isInteractable&&(t.mouseHasLeftScreen=!0,e.setAttribute("geometry","primitive:plane; width:"+t.width+"; height:"+t.height+";"),e.addEventListener("click",function(){0!=t.mouseHasLeftScreen&&(document.exitPointerLock(),e.sceneEl.style.zIndex=-2,t.mouseHasLeftScreen=!1)}),e.addEventListener("mouseleave",function(){t.mouseHasLeftScreen=!0})),e.addEventListener("cam-loaded",function(){var i=document.createElement("iframe");i.setAttribute("src",t.url),i.style.border="none";var s=new a(e.sceneEl.camera,e);s.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(s.domElement);var n=new c(s,i,t.width,t.height);if(e.object3D.add(n),1==t.isInteractable){var r=document.createElement("div");r.style.position="fixed",r.style.top="0",r.style.width="100%",r.style.height="100%",r.style.zIndex="-1",s.domElement.appendChild(r),r.addEventListener("click",function(){e.sceneEl.style.zIndex=2})}this.websurface_iframe=i,this.css3d_context=s,this.css3d_element=n,t.context=s,t.element=n,window.addEventListener("resize",function(){s.setSize(window.innerWidth,window.innerHeight)})}),t.frames=0,t.isCamLoaded=!1},tick:function(){var e=this.el,t=this.data;if(1!=t.isPaused)if(0!=t.isCamLoaded){var i=t.context,s=t.element;t.frames%t.frameSkips==0&&(i&&i.update(),s&&s.update(e.object3D)),t.frames++}else e.sceneEl.camera&&(this.el.emit("cam-loaded"),t.isCamLoaded=!0)},pause:function(){this.data.isPaused=!0},play:function(){this.data.isPaused=!1}});e.component=d},"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(self.aframeWebsurfaces={}),AFRAME.registerComponent("web-portal",{schema:{url:{default:""},iframe:{default:""},player:{default:""},text:{default:""},width:{default:1.5},height:{default:2.4},portalFrame:{default:!0},portalWebsurface:{default:!0}},init:function(){var e,t=this.el,i=this.data,s=t.sceneEl;if(1==i.portalWebsurface?t.setAttribute("websurface",{url:i.url,width:i.width,height:i.height,isInteractable:!1}):(t.setAttribute("geometry",{primitive:"plane",width:i.width,height:i.height}),t.setAttribute("material",{color:"#faf"}),(e=document.createElement("iframe")).src=i.url,document.body.appendChild(e),e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100%",e.style.overflow="none",e.style.zIndex=-10,e.style.display="none"),""!==i.player){document.querySelector(i.player),t.setAttribute("aabb-collider",{objects:i.player});var n=document.createElement("a-text");if(n.setAttribute("value",i.text),n.setAttribute("position","0 "+(.5*i.height+.25)+" .4"),n.setAttribute("align","center"),t.appendChild(n),i.titleEl=n,1==i.portalFrame){var r=document.createElement("a-box");r.setAttribute("position",".75 0 .24"),r.setAttribute("scale",".25 2.6 .5"),t.appendChild(r);var o=document.createElement("a-box");o.setAttribute("position","-.75 0 .24"),o.setAttribute("scale",".25 2.6 .5"),t.appendChild(o);var l=document.createElement("a-box");l.setAttribute("position","0 1.2 .24"),l.setAttribute("scale","1.7 .25 .5"),t.appendChild(l);var a=document.createElement("a-box");a.setAttribute("position","0 0 -.06"),a.setAttribute("scale","1.6 2.5 .1"),t.appendChild(a)}t.addEventListener("hitstart",function(){if(i.portalWebsurface){t.pause();var n=t.css3d_context.domElement;i.style_iframe=(e=t.websurface_iframe).style,i.style_context=n.style,i.style_contextChild=n.children[0].style,e.style="",n.style="",n.children[0].style="",e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.width="100%",e.style.height="100%",e.style.overflow="none"}s.style.zIndex=-10,s.style.display="none",e.style.zIndex=10,e.style.display="block",document.exitPointerLock()})}else console.error("aframe-web-portal: player not defined")},update:function(){var e=this.data;e.titleEl.setAttribute("value",e.text)}})});
//# sourceMappingURL=aframe-web-portals.umd.js.map
