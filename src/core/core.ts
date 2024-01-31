import fs from "fs";
import {EventEmitter} from "events";
import express, {Express, Router, Request, Response, NextFunction} from "express";
import {Server} from "http";
import {rateLimit} from "express-rate-limit";

/**
 * Initially the idea was to have a separate port registrar for each event but
 * then it seamed better to assign a the node registrar as the event for each
 * node instead of having separate ports. When cargo is sent the port is the
 * node code which represents the address of the node. The node will listen to
 * its port and all cargo sent there should be treated as the node being called
 * directly.
 * 
 * "PORT_REGISTRAR" is deprecated. Please use "NODE_REGISTRAR" for port.
 */

export const NODE_REGISTRAR = {
  Core:            "<CORE>",
  Authenticator:   "<AUTH>",
  NetworkAdaptor:  "<NKAR>",
  FileSysAdaptor:  "<FSAR>",
  ConsoleAdaptor:  "<CEAR>",
  ErrorHandler:    "<ERHR>"
}

export interface IIndexer {
  generate:
    () => number;
}

export const INDEXER = (function() {
  let instance: IIndexer;

  return function() {
    if (!instance) {
      instance = function() {
        const _: {
          index: number
        } = {
          index: 0
        }

        function generate(): number {
          _.index += 1;
          return _.index;
        }
        return {
          generate
        }
      }();
    }
    return instance;
  }
})();

export interface ICargo {
  index:
    () => number;
  chain:
    () => string[];
  content:
    () => any;
  port:
    () => string;
  route:
    (port: string) => ICargo;
  pack:
    (content: any) => ICargo;
  inject:
    (content: any) => ICargo;
  sign:
    (identifier: string) => ICargo;
  ship:
    () => ICargo;
}

export const CargoConstructor = function() {
  const _: {
    index: number,
    chain: string[],
    content: any,
    port: string
  } = {
    index: INDEXER().generate(),
    chain: [],
    content: {},
    port: NODE_REGISTRAR.Core
  }

  function index(): number {
    return _.index;
  }

  function chain(): string[] {
    return _.chain;
  }

  function content(): any {
    return _.content;
  }

  function port(): string {
    return _.port;
  }

  function route(port: string): ICargo {
    _.port = port;
    return INSTANCE;
  }

  function pack(content: any): ICargo {
    _.content = content;
    return INSTANCE;
  }

  function inject(content: any): ICargo {
    Object.assign(_.content, content);
    return INSTANCE;
  }

  function sign(nodeId: string): ICargo {
    _.chain.push(nodeId);
    return INSTANCE;
  }

  function ship(): ICargo {
    NET().broadcast(INSTANCE);
    return INSTANCE;
  }

  const INSTANCE: ICargo = {
    index,
    chain,
    content,
    port,
    route,
    pack,
    inject,
    sign,
    ship
  }

  return INSTANCE;
}

export interface INet {
  activePorts:
    () => (string | symbol)[];
  numberOfStreamers:
    (port: string) => number;
  streamers:
    (port: string) => Function[];
  capacity:
    () => number;
  updateCapacity:
    (capacity: number) => INet;
  broadcast:
    (cargo: ICargo) => INet;
  openStream:
    (port: string, callback: (cargo: ICargo) => void) => INet;
  openTimedStream:
    (port: string, ms: number, callback: (cargo: ICargo) => void) => INet;
  openStreamCloseOnSuccess:
    (port: string, callback: (cargo: ICargo) => boolean) => INet;
  openStreamOnce:
    (port: string, callback: (cargo: ICargo) => void) => INet;
  openFilteredStream:
    (port: string, filterCallback: (cargo: ICargo) => boolean, callback: (cargo: ICargo) => void) => INet;
  closeStream:
    (port: string, callback: (cargo: ICargo) => void) => INet;
  closeEveryStream:
    (port: string) => INet;
}

/**
 * The functionalities of cargo and net are quite similar, and as a quality of
 * life improvement I thought it would be more convinient to integrate both in
 * cargo. The cargo module will contain all functionalities required to transmit
 * data across the system.
 * 
 */
export const NET = (function() {
  let instance: INet;

  return function() {
    if (!instance) {
      instance = function() {
        const _: {
          emitter: EventEmitter
        } = {
          emitter: new EventEmitter()
        }

        function activePorts(): (string | symbol)[] {
          return _.emitter.eventNames();
        }

        function numberOfStreamers(port: string): number {
          return _.emitter.listenerCount(port);
        }

        function streamers(port: string): Function[] {
          return _.emitter.listeners(port);
        }

        function capacity(): number {
          return _.emitter.getMaxListeners();
        }

        function updateCapacity(capacity: number): INet {
          _.emitter.setMaxListeners(capacity);
          return instance;
        }

        function broadcast(cargo: ICargo): INet {
          _.emitter.emit(cargo.port(), cargo);
          return instance;
        }

        function openStream(port: string, callback: (cargo: ICargo) => void): INet {
          _.emitter.addListener(port, callback);
          return instance;
        }

        function openTimedStream(port: string, ms: number, callback: (cargo: ICargo) => void): INet {
          const TIMEOUT_ID = setTimeout(function() {
            _.emitter.removeListener(port, TIMEOUT_CALLBACK);
          }, ms);
          const TIMEOUT_CALLBACK = function(cargo: ICargo) {
            clearTimeout(TIMEOUT_ID);
            callback(cargo);
          }
          _.emitter.addListener(port, TIMEOUT_CALLBACK);
          return instance;
        }

        function openStreamCloseOnSuccess(port: string, callback: (cargo: ICargo) => boolean): INet {
          const SUCCESS_CALLBACK = function(cargo: ICargo) {
            if (callback(cargo)) {
              closeStream(port, SUCCESS_CALLBACK);
            }
          }
          openStream(port, SUCCESS_CALLBACK);
          return instance;
        }

        function openStreamOnce(port: string, callback: (cargo: ICargo) => void): INet {
          const ONCE_CALLBACK = function(cargo: ICargo) {
            closeStream(port, ONCE_CALLBACK);
            callback(cargo);
          }
          openStream(port, ONCE_CALLBACK);
          return instance;
        }

        function openFilteredStream(port: string, filterCallback: (cargo: ICargo) => boolean, callback: (cargo: ICargo) => void): INet {
          const FILTERED_CALLBACK = function(cargo: ICargo) {
            if (filterCallback(cargo)) {
              callback(cargo);
            }
          }
          openStream(port, FILTERED_CALLBACK);
          return instance;
        }

        function closeStream(port: string, callback: (cargo: ICargo) => void): INet {
          _.emitter.removeListener(port, callback);
          return instance;
        }

        function closeEveryStream(port: string): INet {
          _.emitter.removeAllListeners(port);
          return instance;
        }

        return {
          activePorts,
          numberOfStreamers,
          streamers,
          capacity,
          updateCapacity,
          broadcast,
          openStream,
          openTimedStream,
          openStreamCloseOnSuccess,
          openStreamOnce,
          openFilteredStream,
          closeStream,
          closeEveryStream
        }
      }();
    }
    return instance;
  }
})();

export interface ISyncDisk {
  get:
    (key: any) => any;
  set:
    (key: any, value: any) => ISyncDisk;
  del:
    (key: any) => ISyncDisk;
  syn:
    (path: string) => ISyncDisk;
}

export const SyncDiskConstructor = function(path: string) {
  const _: {
    path: string,
    content: any
  } = {
    path: path,
    content: {}
  }

  function get(key: any): any {
    _.content[key];
  }

  function set(key: any, value: any): ISyncDisk {
    _load();
    _.content[key] = value;
    _save();
    return INSTANCE;
  }

  function del(key: any): ISyncDisk {
    _load();
    delete _.content[key];
    _save();
    return INSTANCE;
  }

  function syn(path: string): ISyncDisk {
    _.path = path;
    _load();
    return INSTANCE;
  }

  function _save(): ISyncDisk {
    fs.writeFileSync(_.path, JSON.stringify(_.content, null, 2));
    return INSTANCE;
  }

  function _load(): any {
    if (!fs.existsSync(_.path)) {
      fs.writeFileSync(_.path, "{}");
      return {};
    }
    return JSON.parse(fs.readFileSync(_.path, "utf-8"));
  }

  const INSTANCE: ISyncDisk = {
    get,
    set,
    del,
    syn
  }

  return INSTANCE;
}

export const SyncDiskWrapperConstructor = function(path: string) {
  const SYNC_DISK = SyncDiskConstructor(path);

  return new Proxy({}, {
    set: function(target, property, value) {
      if (typeof property === "string") {
        SYNC_DISK.set(property, value);
        return true;
      }
      return false;
    },
    get: function(target, property) {
      if (typeof property === "string") {
        return SYNC_DISK.get(property);
      }
      return undefined;
    },
    deleteProperty: function(target, property) {
      if (typeof property === "string") {
        SYNC_DISK.del(property);
        return true;
      }
      return false;
    }
  });
}

export interface ISyncDiskArray {
  get:
    (index: number) => any;
  set:
    (index: number, value: any) => ISyncDiskArray;
  syn:
    (path: string) => ISyncDiskArray;
  length:
    () => number;
  push:
    (...items: any[]) => ISyncDiskArray;
  pop:
    () => any;
  shift:
    () => any;
  unshift:
    () => ISyncDiskArray;
  save:
    () => ISyncDiskArray;
  load:
    () => any[];
}

export const SyncDiskArrayConstructor = function(path: string) {
  const _: {
    path: string,
    content: any[]
  } = {
    path: path,
    content: []
  }

  function get(index: any): any {
    _load();
    return _.content[index];
  }

  function set(index: any, value: any): ISyncDiskArray {
    _load();
    _.content[index] = value;
    _save();
    return INSTANCE;
  }

  function syn(path: string): ISyncDiskArray {
    _.path = path;
    _load();
    return INSTANCE;
  }
  
  function length(): number {
    return _.content.length;
  }

  function push(...items: any[]): ISyncDiskArray {
    _load();
    _.content.push(...items);
    _save();
    return INSTANCE;
  }

  function pop(): any {
    _load();
    const ITEM = _.content.pop();
    _save();
    return ITEM;
  }

  function shift(): any {
    _load();
    const ITEM = _.content.shift();
    _save();
    return ITEM;
  }

  function unshift(...items: any[]): ISyncDiskArray {
    _load();
    _.content.unshift(...items);
    _save();
    return INSTANCE;
  }

  function save(): ISyncDiskArray {
    return _save();
  }

  function load(): any[] {
    return _load();
  }

  function _save(): ISyncDiskArray {
    fs.writeFileSync(_.path, JSON.stringify(_.content, null, 2));
    return INSTANCE;
  }

  function _load(): any[] {
    if (!fs.existsSync(_.path)) {
      fs.writeFileSync(_.path, "[]");
      return [];
    }
    return JSON.parse(fs.readFileSync(_.path, "utf-8"));
  }

  const INSTANCE: ISyncDiskArray = {
    get,
    set,
    syn,
    length,
    push,
    pop,
    shift,
    unshift,
    save,
    load
  }

  return INSTANCE;
}

export const SyncDiskArrayWrapperConstructor = function(path: string) {
  const SYNC_DISK_ARRAY = SyncDiskArrayConstructor(path);

  return new Proxy(SYNC_DISK_ARRAY, {
    set(target, property, value) {
      if (typeof property === "string" && !isNaN(parseInt(property))) {
        const INDEX = parseInt(property);
        target.set(INDEX, value);
        if (typeof target.save === "function") {
          target.save();
        }
        return true;
      }
      const PROPERTY_NAME = property as keyof typeof SYNC_DISK_ARRAY;
      target[PROPERTY_NAME] = value;
      if (typeof target.save === "function") {
        target.save();
      }
      return true;
    },
    get(target, property) {
      if (typeof property === "string" && !isNaN(parseInt(property))) {
        const INDEX = parseInt(property);
        return target.get(INDEX);
      }
      else if (property === "push" || property === "pop" || property === "shift" || property === "unshift") {
        return function(...args: any[]) {
          const RESULT = target[property].apply(target, args);
          if (typeof target.save === "function") {
            target.save();
            return RESULT;
          }
        }
      }
    }
  });
}

export function on({
  node    ,
  message ,
  task    ,
}: {
  node:      string;
  message:   string;
  task:      (cargo: ICargo) => void
}): void {
  NET().openStream(node, function(cargo: ICargo) {
    if (cargo.content().message === message) {
      task(cargo);
    }
  });
  return;
}

export function send({
  from = NODE_REGISTRAR.Core,
  to, 
  message, 
  cargo,
}: {
  from:      string;
  to:        string;
  message:   string;
  cargo:     ICargo;
}): number {
  return CargoConstructor()
    .pack(cargo)
    .inject({message: message})
    .sign(from)
    .route(to)
    .ship()
    .index();
}

send({
  from: NODE_REGISTRAR.Core,
  to: NODE_REGISTRAR.ConsoleAdaptor,
  message: "ConnectionSent",
  cargo: CargoConstructor()
    .inject({})
})

on({
  node: NODE_REGISTRAR.Core,
  message: "ConnectionSent",
  task(cargo) {
    
  },
})

export interface INetwork {
  application:
    () => Express;
  router:
    () => Router;
  activePublicEndpoints:
    () => string[];
  activePrivateEndpoints:
    () => string[];
  rateLimitWindowMs:
    () => number;
  rateLimitMaxRequestsPerWindowMs:
    () => number;
  rateLimitMessage:
    () => string;
  server:
    () => Server | undefined;
  isConnected:
    () => boolean;
  port:
    () => number;
  updatePort:
    (port: number) => INetwork;
  openPublicEndpoint:
    (endpoint: string, callback: (request: Request, response: Response) => void) => INetwork;
  openPrivateEndpoint:
    (endpoint: string, callback: (request: Request, response: Response) => void) => INetwork;
  closePublicEndpoint:
    (endpoint: string) => INetwork;
  closePrivateEndpoint:
    (endpoint: string) => INetwork;
  connect:
    (callback: () => void) => INetwork;
  disconnect:
    (callback: () => void) => INetwork;
  reconnect:
    () => INetwork;
}

export const NETWORK = (function() {
  let instance: INetwork;

  return function() {
    if (!instance) {
      instance = function() {
        const _: {
          application: Express,
          router: Router,
          activePublicEndpoints: string[],
          activePrivateEndpoints: string[],
          server: Server | undefined,
          port: number,
          rateLimitWindowMs: number,
          rateLimitMaxRequestsPerWindowMs: number,
          rateLimitMessage: string
        } = {
          application: express(),
          router: Router(),
          activePublicEndpoints: [],
          activePrivateEndpoints: [],
          server: undefined,
          port: 6969,
          rateLimitWindowMs: 60_000,
          rateLimitMaxRequestsPerWindowMs: 100,
          rateLimitMessage: "Too many requests from this IP, please try again later"
        }

        function application(): Express {
          return _.application;
        }

        function router(): Router {
          return _.router;
        }

        function activePublicEndpoints(): string[] {
          return _.activePublicEndpoints;
        }

        function activePrivateEndpoints(): string[] {
          return _.activePrivateEndpoints;
        }

        function rateLimitWindowMs(): number {
          return _.rateLimitWindowMs;
        }

        function rateLimitMaxRequestsPerWindowMs(): number {
          return _.rateLimitMaxRequestsPerWindowMs;
        }

        function rateLimitMessage(): string {
          return _.rateLimitMessage;
        }

        function server(): Server | undefined {
          return _.server;
        }

        function isConnected(): boolean {
          if (server()) {
            return true;
          }
          return false;
        }

        function port(): number {
          return _.port;
        }

        function updatePort(port: number): INetwork {
          _.port = port;
          return instance;
        }

        function openPublicEndpoint(endpoint: string, callback: (request: Request, response: Response) => void): INetwork {
          (router() as any)["get"](endpoint, callback);
          activePublicEndpoints().push(endpoint);
          return instance;
        }

        function openPrivateEndpoint(endpoint: string, callback: (request: Request, response: Response) => void): INetwork {
          (router() as any)["post"](endpoint, callback);
          activePrivateEndpoints().push(endpoint);
          return instance;
        }

        function closePublicEndpoint(endpoint: string): INetwork {
          const INDEX = activePublicEndpoints().indexOf(endpoint);
          if (INDEX !== -1) {
            router().stack = router().stack.filter(function(layer: any) {
              return layer.route?.path !== endpoint;
            });
            activePublicEndpoints().splice(INDEX, 1);
          }
          return instance;
        }

        function closePrivateEndpoint(endpoint: string): INetwork {
          const INDEX = activePrivateEndpoints().indexOf(endpoint);
          if (INDEX !== -1) {
            router().stack = router().stack.filter(function(layer: any) {
              return layer.route?.path !== endpoint;
            });
            activePrivateEndpoints().splice(INDEX, 1);
          }
          return instance;
        }

        function connect(callback: () => void): INetwork {
          application()
            .use(rateLimit({
              windowMs: rateLimitWindowMs(),
              max: rateLimitMaxRequestsPerWindowMs(),
              message: rateLimitMessage()
            }))
            .use("/", router());
          _.server = application().listen(port(), callback);
          return instance;
        }

        function disconnect(callback: () => void): INetwork {
          if (server()) {
            server()!.close(function() {
              callback();
              _.server = undefined;
            });
          }
          return instance;
        }

        function reconnect(): INetwork {
          disconnect(function() {});
          connect(function() {});
          return instance;
        }

        return {
          application,
          router,
          activePublicEndpoints,
          activePrivateEndpoints,
          rateLimitWindowMs,
          rateLimitMaxRequestsPerWindowMs,
          rateLimitMessage,
          server,
          isConnected,
          port,
          updatePort,
          openPublicEndpoint,
          openPrivateEndpoint,
          closePublicEndpoint,
          closePrivateEndpoint,
          connect,
          disconnect,
          reconnect
        };
      }();
    }
    return instance;
  }
})();

/// NETWORK NODE
(function() {
  const NODE_ID = NODE_REGISTRAR.NetworkAdaptor;

  NET().openStream(NODE_ID, function(cargo: ICargo) {
    let content: any = cargo.content();
    let message: string = content.request;

    switch(message) {
      case "OpenPublicEndpoint":
        let endpoint: string = content.endpoint;
        NETWORK().openPublicEndpoint(endpoint, function(request: Request, response: Response) {
          CargoConstructor()
            .pack({
              message: "public-endpoint",
              endpoint: endpoint,
              request: request,
              response: response
            })
            .route(NODE_REGISTRAR.Core)
            .ship();
        });
        break

      case "PublicEndpointQueryResponse":
        let response: express.Response<any, Record<string, any>> = content.response;
        let webResponse: string = content.webResponse;
        response.send(webResponse);
        content.success = true;
        CargoConstructor()
          .pack(content)
          .route(NODE_REGISTRAR.Core)
          .ship();
        break
    }
  });

  NETWORK().openPublicEndpoint("/", function(request: Request, response: Response) {
    const INDEX: number = CargoConstructor()
      .inject({
        event: "public-endpoint",
        endpoint: "/",
        request: request,
        response: response
      })
      .sign(NODE_ID)
      .route(NODE_REGISTRAR.Core)
      .ship()
      .index();
    const CALLBACK_ID = function(cargo: ICargo) {
      if (cargo.index() === INDEX) {
        let content: any = cargo.content();
        response.send(content.response);
        NET().closeStream(NODE_ID, CALLBACK_ID);
      }
    }
    NET().openStream(NODE_ID, CALLBACK_ID);
  });

  NETWORK().openPrivateEndpoint("/chrysalis", function(request: Request, response: Response) {
    const INDEX: number = CargoConstructor()
      .inject({

      })
      .sign(NODE_ID)
      .ship()
      .index();
    
  });

})();

(function() {
  const NODE_ID: string = NODE_REGISTRAR.ConsoleAdaptor;
  let commandParserMapping: Map<string, Function>;

  NET().openStream(NODE_ID, function(cargo: ICargo) {
    try {
      let command: Function | undefined = commandParserMapping.get(cargo.content().command)!();
    }
    catch (error) {
      cargo.sign(NODE_ID)
        .inject({error: error})
        .route(NODE_REGISTRAR.Authenticator)
        .ship();
    }
  });

  NET().openFilteredStream(NODE_ID, function(cargo: ICargo) {
    if (cargo.content().request === "+> cargo-log") {
      return true;
    }
    return false;
  }, function(cargo: ICargo) {
    cargo.sign(NODE_ID);
    console.log(cargo);
  });

  NET().openStream(NODE_ID, function(cargo) {
    let initialSender: string = cargo.chain()[0];
    console.log(cargo.chain());
    cargo.content().response = "CargoLogged";
    cargo
      .route(initialSender)
      .sign(NODE_ID)
      .ship();
    return;
  });
})();

(function() {
  let nodeId: string = NODE_REGISTRAR.ErrorHandler;

  on(nodeId, "NewErrorLogged", function(cargo: ICargo) {
    let error: string = cargo.content().error;

  });
})();


/// CORE NODE
(function() {
  const NODE_ID = NODE_REGISTRAR.Core;


})();

