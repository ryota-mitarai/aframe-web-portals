import * as Y from 'yjs';

//base CSDT object
//both the parent and child implementation extend from this
export default class Base {
  constructor() {
    this.version = '0.1.0';
    this.ydoc = new Y.Doc();

    //ydoc recieve updates
    document.addEventListener('CSDT-y-update', (e) => {
      const update = e.detail;
      Y.applyUpdate(this.ydoc, update);
    });
  }
}
