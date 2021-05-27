const scene = document.querySelector('a-scene');

document.addEventListener('CSDT-portal-open', () => {
  //create a portal
  const portal = document.createElement('a-entity');
  portal.setAttribute('web-portal', 'url:parent; text:Parent;');
  portal.setAttribute('position', '0 0 -6');
  scene.appendChild(portal);

  const imgPerspective = scene.components.screenshot.getCanvas('perspective');
  const imgEquirectangular = scene.components.screenshot.getCanvas('equirectangular');

  //send info back to parent
  CSDT.responsePortalOpen(true, imgPerspective, imgEquirectangular);
});
