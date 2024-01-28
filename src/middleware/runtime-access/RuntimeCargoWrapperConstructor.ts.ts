import {RuntimeCargoConstructor} from "./RuntimeCargoConstructor.js";

const RuntimeCargoWrapperConstructor =function(path: string) {
  const _RUNTIME_CARGO =RuntimeCargoConstructor(path);

  return new Proxy(_RUNTIME_CARGO, {
    get(target, property) {
      if (typeof target.get(property) ==="function") {
        return target.get(property).bind(target);
      }
      else {
        return target.get(property);
      }
    },
    set(target, property, value) {
      target.set(property, value);
      return true;
    },
    deleteProperty(target, property) {
      target.del(property);
      return true;
    }
  });
}