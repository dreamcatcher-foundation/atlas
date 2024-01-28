import fs from "fs";
import {IRuntimeCargo} from "./interface/IRuntimeCargo.js";
import {TRuntimeCargoConstructor} from "./type/TRuntimeCargoConstructor.js";

export const RuntimeCargoConstructor: TRuntimeCargoConstructor =function(path: string): IRuntimeCargo {
  const _CARGO_PATH: string =path;
  const _CARGO: any =load();
  const _JSON_INDENTATION: number =2;

  function get(key: any): any {
    return _CARGO[key];
  }

  function set(key: any, value: any): IRuntimeCargo {
    _CARGO[key] =value;
    save();
    return _RUNTIME_CARGO_INSTANCE;
  }

  function del(key: any): IRuntimeCargo {
    delete _CARGO[key];
    return _RUNTIME_CARGO_INSTANCE;
  }

  function save(): IRuntimeCargo {
    fs.writeFileSync(_CARGO_PATH, JSON.stringify(_CARGO, null, _JSON_INDENTATION));
    return _RUNTIME_CARGO_INSTANCE;
  }

  function load(): any {
    return JSON.parse(fs.readFileSync(_CARGO_PATH, "utf8"));
  }

  const _RUNTIME_CARGO_INSTANCE: IRuntimeCargo = {
    get,
    set,
    del,
    save,
    load
  }

  return _RUNTIME_CARGO_INSTANCE;
}