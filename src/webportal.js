import './lib/aframe-aabb-collider-component.min';
import './lib/aframe-websurfaces.umd';

AFRAME.registerComponent('web-portal', {
  schema: {
    url: { default: '' },
    player: { default: '' },
    text: { default: '' },
    width: { default: 1.5 },
    height: { default: 2.4 },
    frameWidth: { default: 0.15 },
    enableFrame: { default: true },
    enableWebsurface: { default: true },
    enableReturnButton: { default: true },
  },

  init: function () {
    const el = this.el;
    const data = this.data;
    const scene = el.sceneEl;

    var iframe;

    if (data.enableWebsurface == true) {
      el.setAttribute('websurface', {
        url: data.url,
        width: data.width,
        height: data.height,
        isInteractable: false,
      });
    } else {
      el.setAttribute('geometry', { primitive: 'plane', width: data.width, height: data.height });
      el.setAttribute('material', { color: '#faf' });

      iframe = document.createElement('iframe');
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
    }

    if (data.enableReturnButton == true) {
      const button = document.createElement('button');
      button.innerHTML = 'return';

      const css = `
      button {
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
        if (data.enableWebsurface == true) {
          const context = el.css3d_context.domElement;

          iframe.style = data.style_iframe;
          context.style = data.style_context;
          context.children[0].style.cssText = data.style_contextChild;

          el.components['websurface'].play();
        }

        scene.style.display = 'block';
        button.style.display = 'none';
      };

      data.returnButton = button;
    }

    if (data.player !== '') {
      el.setAttribute('aabb-collider', { objects: data.player });
    } else {
      console.error('aframe-web-portal: player not defined');
      return;
      //TODO: automatically use the scene camera as the player
      //player = scene.camera;
    }

    const title = document.createElement('a-text');
    title.setAttribute('value', data.text);
    title.setAttribute('position', `0 ${data.height * 0.5 + 0.25 + data.frameWidth} 0`);
    title.setAttribute('align', 'center');
    title.setAttribute('side', 'double');
    el.appendChild(title);
    data.titleEl = title;

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

    el.addEventListener('hitstart', function () {
      if (data.enableWebsurface == true) {
        el.components['websurface'].pause();

        iframe = el.websurface_iframe;
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
      iframe.style.display = 'block';
      if (data.returnButton) data.returnButton.style.display = 'block';

      document.exitPointerLock();
    });
  },

  update: function () {
    const data = this.data;

    data.titleEl.setAttribute('value', data.text);
  },
});
