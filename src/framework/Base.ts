type TDisk               = ()            => any;
type TImplementation     = (disk: any)   => any;

interface IBase {
  syncToDisk:            (disk: any)                         => IBase;
  injectDisk:            (...components: TDisk[])            => IBase;
  injectImplementation:  (...components: TImplementation[])  => IBase;
}

const Base = function(): IBase {
  let __internal: any = {};
  let __external: IBase = {
    syncToDisk,
    injectDisk,
    injectImplementation
  }

  function syncToDisk(disk: any): 
  typeof __external {
    __internal = disk;
    return __external;
  }

  function injectDisk(...components: TDisk[]): 
  typeof __external {
    for (const COMPONENT of components) {
      __internal = {
        ...__internal,
        ...COMPONENT()
      }
    }
    return __external;
  }

  function injectImplementation(...components: TImplementation[]): 
  typeof __external {
    for(const COMPONENT of components) {
      __external = {
        ...__external,
        ...COMPONENT(__internal)
      }
    }
    return __external;
  }

  return __external;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface IUniqueNumberDisk {
  uniqueNumber: number;
}

const UNIQUE_NUMBER_DISK = function(): () => IUniqueNumberDisk {
  let uniqueNumber:  number              = 0;
  let instance:      IUniqueNumberDisk;

  return function() {
    if (!instance) {
      instance = {
        uniqueNumber
      }
    }
    return instance;
  }
}

interface IIndexer extends IBase {
  generateUniqueNumber: () => number;
}

function Indexer(_: IUniqueNumberDisk) {
  function generateUniqueNumber(): number {
    return _.uniqueNumber += 1;
  }

  return {
    generateUniqueNumber
  }
}

const INDEXER = Base()
  .injectDisk(UNIQUE_NUMBER_DISK())
  .injectImplementation(Indexer) as 
  IIndexer;
  

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import * as events from "events";

interface INetDisk {
  emitter: events.EventEmitter;
}

const NET_DISK = function NetDisk(): () => INetDisk {
  let emitter:   events.EventEmitter = new events.EventEmitter();
  let instance:  INetDisk;

  return function() {
    if (!instance) {
      instance = {
        emitter
      }
    }
    return instance;
  }
}

interface INet {
  active:          ()                                => (string | symbol)[];
  listenersCount:  (port: string)                    => number;
  listeners:       (port: string)                    => Function[];
  cap:             ()                                => number;
  updateCap:       (cap: number)                     => INet;
  broadcast: (
    toPort:    string, 
    message:   string, 
    cargo:     ICargo)                               => INet;
  broadcastToAll: (
    message:   string, 
    cargo:     ICargo)                               => INet;
  on: (
    fromPort:  string, 
    message:   string, 
    callback: (
      content: any)
        => any)                                      => INet;
  onTime: (
    fromPort:  string, 
    message:   string, 
    ms:        number, 
    callback: (
      content: any) 
        => any)                                      => INet;
}

function Net(_: INetDisk) {
  function active():
  (string | symbol)[] {
    return _.emitter.eventNames();
  }

  function listenersCount(port: string):
  number {
    return _.emitter.listenerCount(port);
  }

  function listeners(port: string):
  Function[] {
    return _.emitter.listeners(port);
  }

  function cap():
  number {
    return _.emitter.getMaxListeners();
  }

  function updateCap(cap: number):
  INet {
    _.emitter.setMaxListeners(cap)
    return instance;
  }

  let instance = {

  }

  return instance;
}

const NET = Base()
  .injectDisk(NET_DISK)
  .injectImplementation(Net) as 
  INet;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

interface ICargoDisk {
  ID:        number;
  fromPort:  string;
  toPort:    string;
  route:     string[];
  messages:  string;
  content:   any
}

function CargoDisk() {
  const ID:      number    = INDEXER
    .generateUniqueNumber();
  let fromPort:  string    = "";
  let toPort:    string    = "";
  let route:     string[]  = [];
  let messages:  string    = "";
  let content:   any       = {};

  return {
    ID,
    fromPort,
    toPort,
    route,
    messages,
    content
  }
}

interface ICargo {
  id:                  ()                  => number;
  fromPort:            ()                  => string;
  toPort:              ()                  => string;
  route:               (position: number)  => string | undefined;
  mostRecentRoute:     ()                  => string | undefined;
  messages:            (position: number)  => string | undefined;
  mostRecentMessage:   ()                  => string | undefined;
  content:             ()                  => any;
  ship:                ()                  => ICargo;
}

function Cargo(_: ICargoDisk) {
  function id(): 
  number {
    return _.ID;
  }

  function fromPort(): 
  string {
    return _.fromPort;
  }

  function toPort(): 
  string {
    return _.toPort;
  }

  function route(position: number): 
  string | undefined {
    return _.route[position];
  }

  function mostRecentRoute(): 
  string | undefined {
    return _.route[-1];
  }

  function messages(position: number): 
  string | undefined {
    return _.messages[position];
  }

  function mostRecentMessage(): 
  string | undefined {
    return _.messages[-1];
  }

  function content(): 
  any {
    return _.content as any;
  }

  function ship():
  ICargo {
    NET.broadcast(toPort(), mostRecentMessage() as string, instance);
    return instance;
  }

  let instance = {

  }

  return instance;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////