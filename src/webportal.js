import './lib/aframe-aabb-collider-component.min';
import './lib/aframe-websurfaces.umd';

AFRAME.registerComponent('web-portal', {
  schema: {
    url: { default: '' },
    iframe: { default: '' },
    player: { default: '' },
    text: { default: '' },
    portalFrame: { default: true },
    portalWebsurface: { default: true },
  },

  init: function () {
    const el = this.el;
    const data = this.data;
    const scene = el.sceneEl;

    var iframe;

    if (data.portalWebsurface == true) {
      el.setAttribute('websurface', {
        url: data.url,
        width: 1.5,
        height: 2.4,
        isInteractable: false,
      });
    } else {
      el.setAttribute('geometry', { primitive: 'plane', width: 1.5, height: 2.4 });
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
      iframe.style.zIndex = -10;
      iframe.style.display = 'none';
    }

    var player;
    if (data.player !== '') {
      player = document.querySelector(data.player);
      el.setAttribute('aabb-collider', { objects: data.player });
    } else {
      console.error('aframe-web-portal: player not defined');
      return;
      //TODO: automatically use the scene camera as the player
      //player = scene.camera;
    }

    const title = document.createElement('a-text');
    title.setAttribute('value', data.text);
    title.setAttribute('position', '0 1.75 .4');
    title.setAttribute('align', 'center');
    el.appendChild(title);
    data.titleEl = title;

    if (data.portalFrame == true) {
      const box1 = document.createElement('a-box');
      box1.setAttribute('position', '.75 0 .24');
      box1.setAttribute('scale', '.25 2.6 .5');
      el.appendChild(box1);

      const box2 = document.createElement('a-box');
      box2.setAttribute('position', '-.75 0 .24');
      box2.setAttribute('scale', '.25 2.6 .5');
      el.appendChild(box2);

      const box3 = document.createElement('a-box');
      box3.setAttribute('position', '0 1.2 .24');
      box3.setAttribute('scale', '1.7 .25 .5');
      el.appendChild(box3);

      const box4 = document.createElement('a-box');
      box4.setAttribute('position', '0 0 -.06');
      box4.setAttribute('scale', '1.6 2.5 .1');
      el.appendChild(box4);
    }

    el.addEventListener('hitstart', function () {
      if (data.portalWebsurface) {
        el.pause();

        iframe = el.websurface_iframe;
        const context = el.css3d_context.domElement;

        data.style_iframe = iframe.style;
        data.style_context = context.style;
        data.style_contextChild = context.children[0].style;

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

      scene.style.zIndex = -10;
      scene.style.display = 'none';
      iframe.style.zIndex = 10;
      iframe.style.display = 'block';

      document.exitPointerLock();
    });
  },

  update: function () {
    const data = this.data;

    data.titleEl.setAttribute('value', data.text);
  },
});
