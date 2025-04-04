import { u as ur, C, a as u } from "./main-kKlcqFSi.js";
u();
var m = class extends ur {
  constructor(t) {
    super(t), this.rootDir = (void 0)(t), (void 0)((void 0)(this.rootDir)) || (void 0)(this.rootDir);
  }
  async init(t, e) {
    return this.pg = t, { emscriptenOpts: { ...e, preRun: [...e.preRun || [], (r) => {
      let c = r.FS.filesystems.NODEFS;
      r.FS.mkdir(C), r.FS.mount(c, { root: this.rootDir }, C);
    }] } };
  }
  async closeFs() {
    this.pg.Module.FS.quit();
  }
};
export {
  m as NodeFS
};
