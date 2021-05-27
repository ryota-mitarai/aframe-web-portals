import './lib/aframe-aabb-collider-component.min';
import './lib/aframe-websurfaces.umd';

import CSDTParent from './csdt/parent';

AFRAME.registerComponent('web-portal', {
  schema: {
    url: { default: 'https://aframe.io' },
    text: { default: '' },
    width: { default: 1.5 },
    height: { default: 2.4 },
    frameWidth: { default: 0.15 },
    enableFrame: { default: true },
    enableWebsurface: { default: true },
    enableReturnButton: { default: true },
    enableCSDT: { default: true },
  },

  init: function () {
    const el = this.el;
    const data = this.data;
    const scene = this.el.sceneEl;

    data.has_iframe_loaded = false;
    el.object3D.position.y += data.height / 2;

    //portal title
    const title = document.createElement('a-text');
    title.setAttribute('value', data.text);
    title.setAttribute('position', `0 ${data.height * 0.5 + 0.25 + data.frameWidth} 0`);
    title.setAttribute('align', 'center');
    title.setAttribute('side', 'double');
    el.appendChild(title);
    data.titleEl = title;

    //portal frame
    if (data.enableFrame == true) {
      const frameWidth = data.frameWidth;
      const width = data.width;
      const height = data.height;

      const box1 = document.createElement('a-box');
      box1.setAttribute('position', `${(width + frameWidth) / 2} 0 0`);
      box1.setAttribute('scale', `${frameWidth} ${height} ${frameWidth}`);
      el.appendChild(box1);

      const box2 = document.createElement('a-box');
      box2.setAttribute('position', `${-(width + frameWidth) / 2} 0 0`);
      box2.setAttribute('scale', `${frameWidth} ${height} ${frameWidth}`);
      el.appendChild(box2);

      const box3 = document.createElement('a-box');
      box3.setAttribute('position', `0 ${(height + frameWidth) / 2} 0`);
      box3.setAttribute('scale', `${width + frameWidth * 2} ${frameWidth} ${frameWidth}`);
      el.appendChild(box3);

      const box4 = document.createElement('a-box');
      box4.setAttribute('position', `0 0 ${-frameWidth / 4 - 0.01}`);
      box4.setAttribute('scale', `${width + frameWidth * 2} ${height + frameWidth * 2} ${frameWidth / 2}`);
      el.appendChild(box4);
    }

    //aabb collision
    if (!scene.camera) {
      el.sceneEl.addEventListener('loaded', () => {
        const cameraEl = scene.camera.el;
        if (cameraEl.id) {
          el.setAttribute('aabb-collider', { objects: `#${cameraEl.id}` });
        } else {
          cameraEl.id = 'web-portal-cam-tag';
          el.setAttribute('aabb-collider', { objects: `#${cameraEl.id}` });
        }
      });
    } else {
      const cameraEl = scene.camera.el;
      if (cameraEl.id) {
        el.setAttribute('aabb-collider', { objects: `#${cameraEl.id}` });
      } else {
        cameraEl.id = 'web-portal-cam-tag';
        el.setAttribute('aabb-collider', { objects: `#${cameraEl.id}` });
      }
    }

    //special case for when the url is 'parent'
    //used for sending a user back to their parent site using CSDT
    if (data.url == 'parent') {
      el.setAttribute('geometry', { primitive: 'plane', width: data.width, height: data.height });
      el.setAttribute('material', { color: '#c8c' });

      el.addEventListener('hitstart', function () {
        document.exitPointerLock();

        window.CSDT.portalReturn();
      });
    } else {
      //add websurface
      if (data.enableWebsurface == true) {
        el.setAttribute('websurface', {
          url: data.url,
          width: data.width,
          height: data.height,
          isInteractable: false,
        });
      } else {
        //create an iframe manually
        el.setAttribute('geometry', { primitive: 'plane', width: data.width, height: data.height });
        el.setAttribute('material', { color: '#c8c' });

        const iframe = document.createElement('iframe');
        iframe.src = data.url;
        document.body.appendChild(iframe);

        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.overflow = 'none';

        iframe.style.zIndex = 10;
        iframe.style.display = 'none';

        el.websurface_iframe = iframe;
      }

      //add a return button overlay on portal entry
      if (data.enableReturnButton == true) {
        const button = document.createElement('button');
        button.className = 'web-portal-overlay-button';
        button.innerHTML = 'return';

        const css = `
      .web-portal-overlay-button {
        position: fixed;
        top: .5em;
        left: .5em;

        cursor: pointer;
        color: white;
        box-shadow: 1px 1px 1px 1px #000000;
        background-color: transparent;
        border-radius: 5px;
        border: 2px solid white;
        
        font-family: Arial;
        font-size: 1em;
        font-weight: bold;
        text-shadow: 2px 2px 1px #000000;
        padding: 0.25em 0.5em;

        z-index: 20;
      }
      
      button:hover {
        color: lightgrey;
        border-color: lightgrey;
      }`;

        const style = document.createElement('style');
        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
        button.appendChild(style);
        document.body.appendChild(button);

        button.style.display = 'none';

        button.onclick = () => {
          this.returnFromPortal();
        };
      }

      //set up CSDT
      if (data.enableCSDT == true) {
        el.addEventListener('iframe loaded', () => {
          el.websurface_iframe.addEventListener('load', () => {
            const CSDT = (this.CSDT = new CSDTParent(el.websurface_iframe));

            //check for CSDT supprt
            CSDT.checkSupport().then(() => {
              //open a portal
              CSDT.openPortal().then((d) => {
                const preview = d.previewImage.perspective;
                console.log(d);
              });
            });

            document.addEventListener('CSDT-portal-return', () => {
              this.returnFromPortal();
            });
          });
        });
      }

      //on portal collision
      //send the user through
      el.addEventListener('hitstart', function () {
        if (data.enableWebsurface == true) {
          el.components['websurface'].pause();

          const iframe = el.websurface_iframe;
          const context = el.css3d_context.domElement;

          data.style_iframe = iframe.style.cssText;
          data.style_context = context.style.cssText;
          data.style_contextChild = context.children[0].style.cssText;

          iframe.style = '';
          context.style = '';
          context.children[0].style = '';

          iframe.style.position = 'fixed';
          iframe.style.top = '0';
          iframe.style.left = '0';
          iframe.style.width = '100%';
          iframe.style.height = '100%';
          iframe.style.overflow = 'none';
        }

        scene.style.display = 'none';
        if (el.websurface_iframe) el.websurface_iframe.style.display = 'block';
        if (data.returnButton) data.returnButton.style.display = 'block';

        document.exitPointerLock();
      });
    }
  },

  //brings the user back to this page, out of the portal
  returnFromPortal: function () {
    const el = this.el;
    const data = this.data;
    const scene = this.el.sceneEl;

    if (data.enableWebsurface == true) {
      const context = el.css3d_context.domElement;

      el.websurface_iframe.style = data.style_iframe;
      context.style = data.style_context;
      context.children[0].style.cssText = data.style_contextChild;

      el.components['websurface'].play();
    }

    const camera = scene.camera.el;

    const portalPos = new THREE.Vector3();
    el.object3D.getWorldPosition(portalPos);
    portalPos.y = camera.object3D.position.y;

    const portalDir = new THREE.Vector3();
    el.object3D.getWorldDirection(portalDir).multiplyScalar(1.5);

    const modifiedPos = new THREE.Vector3();
    modifiedPos.copy(portalPos);
    modifiedPos.add(portalDir);

    camera.object3D.position.x = modifiedPos.x;
    camera.object3D.position.z = modifiedPos.z;

    if (camera.components['look-controls']) {
      camera.setAttribute('look-controls', { enabled: false });

      const camPos = new THREE.Vector3();
      camera.object3D.getWorldPosition(camPos);

      const lookVector = new THREE.Vector3();
      lookVector.subVectors(camPos, portalPos).add(camPos);

      camera.object3D.lookAt(lookVector);
      camera.object3D.updateMatrix();

      const rotation = camera.getAttribute('rotation');
      camera.components['look-controls'].pitchObject.rotation.x = THREE.Math.degToRad(rotation.x);
      camera.components['look-controls'].yawObject.rotation.y = THREE.Math.degToRad(rotation.y);

      camera.setAttribute('look-controls', { enabled: true });
    }

    scene.style.display = 'block';
    if (data.returnButton) data.returnButton.style.display = 'none';
  },

  update: function () {
    const data = this.data;

    data.titleEl.setAttribute('value', data.text);
  },

  tick: function () {
    const el = this.el;
    const data = this.data;

    if (data.has_iframe_loaded == false) {
      if (el.websurface_iframe) {
        if (el.websurface_iframe.contentDocument) {
          data.has_iframe_loaded = true;
          el.emit('iframe loaded');
        }
      }
    }
  },
});
