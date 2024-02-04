import {EventEmitter} from "events";

export interface ICargoNode {
  address:
    () => string;
  count:
    () => number;
  activePorts:
    () => string[];
  activePort:
    (position: number) => string | undefined;
  isActivePort:
    (port: string) => boolean;
  streamerCount:
    (port: string) => number;
  streamer:
    (port: string, position: number) => Function;
  capacity:
    () => number;
  updateCapacity:
    (capacity: number) => ICargoNode;
  openStream:
    (port: string, callback: (cargo: ICargo) => any) => ICargoNode;
  openTimedStream:
    (port: string, ms: number, callback: (cargo: ICargo) => any) => ICargoNode;
  openStreamOnce:
    (port: string, callback: (cargo: ICargo) => any) => ICargoNode;
  dock:
    (port: string, message: string, callback: (...args: any[]) => any) => ICargoNode;
  dockToAll:
    (message: string, callback: (...args: any[]) => any) => ICargoNode;
  dockToRaw:
    (port: string, callback: (cargo: ICargo) => any) => ICargoNode;
  ship:
    (from: string, to: string, message: string, ...args: any[]) => ICargoNode;
  shipToAll:
    (from: string, message: string, ...args: any[]) => ICargoNode;
}

export interface ICargo {
  id:
    () => number;
  route:
    (position: number) => string;
  routeLength:
    () => number;
  message:
    (position: number) => string;
  messageLength:
    () => number;
  content:
    () => any[];
  ship:
    (from: string, to: string, message: string, ...args: any[]) => ICargo;
}

export const cargo = (function() {
  let instance: ICargoNode;

  return function() {
    if (!instance) {
      instance = function() {
        /// Cargo Node
        const _ = (function() {
          let emitter: EventEmitter = new EventEmitter();
          let counter: number = 0;
          let deleted: number = 0;

          return {
            counter,
            deleted,
            emitter
          }
        })();

        function address(): string {
          return "CargoNode";
        }

        function count(): number {
          return _.counter - _.deleted;
        }

        function activePorts(): string[] {
          return _.emitter.eventNames() as string[];
        }

        function activePort(position: number): string | undefined {
          return activePorts().at(position);
        }

        function activePortLength(): number {
          return activePorts().length;
        }

        function dockers(port: string): Function[] {
          return _.emitter.listeners(port);
        }

        function dockersLength(port: string): number {
          return dockers(port).length;
        }

        function docker(port: string, position: number): Function | undefined {
          return dockers(port).at(position);
        }

        function capacity(): number {
          return _.emitter.getMaxListeners();
        }

        function updateCapacity(capacity: number): ICargoNode {
          _.emitter.setMaxListeners(capacity);
          return instance;
        }

        

        function ship(cargo: ICargo): ICargoNode {
          _.emitter.emit(cargo.lastRoute(), cargo);
          return instance;
        }

        function openStream(port: string, callback: (cargo: ICargo) => void): ICargoNode {
          _.emitter.addListener(port, callback);
          return instance;
        }

        function closeAll(port: string): ICargoNode {
          _.emitter.removeAllListeners(port);
          return instance;
        }

        function build() {
          /// Cargo
          const __ = (function() {
            let id: number = _.counter += 1;
            let route: string[] = [];
            let content: any[] = []
            let messageStack: string[] = [];

            return {
              id,
              route,
              content,
              messageStack
            }
          })();

          function id(): number {
            return __.id;
          }

          function route(position?: number): string {
            return __.route[position === undefined ? 0 : position];
          }

          function lastRoute(): string | undefined {
            return __.route.at(-1);
          }

          function routeLength(): number {
            return __.route.length;
          }

          function content(): any[] {
            return __.content;
          }

          function message(position?: number): string {
            return __.messageStack[position === undefined ? 0 : position];
          }

          function lastMessage(): string | undefined {
            return __.messageStack.at(-1);
          }



          function ship(to: string) {
            __.route.push(to);
          }
        }

        return {
          
        }
      }
    }
    return instance;
  }
})();



export let car = (function() {
  let instance: ICargoNode;

  return function() {
    if (!instance) {
      instance = function() {
        /// Cargo Node Instance
        const _ = (function() {
          let counter: number = 0;
          let deleted: number = 0;
          let emitter: EventEmitter = new EventEmitter();
          return {
            counter,
            deleted,
            emitter
          }
        })();

        function address(): string {
          return "CargoNode";
        }
        
        function count(): number {
          return _.counter - _.deleted;
        }

        function activePorts(): string[] {
          return _.emitter.eventNames() as string[]
        }

        /// @todo

        function build() {
          /// Cargo Instance
          const __ = (function() {
            let id: number = Number();
            let route: string[] = Array();
            let destination: string = String();
            let message: string = String();
            let content: any[] = Array();
            return {
              id,
              route,
              destination,
              message,
              content
            }
          })();
          
          __.id = _.counter += 1;

          function id(): number {
            return __.id;
          }

          function route(): string[] {
            return __.route;
          }

          function destination(): string {
            return __.destination;
          }

          function message(): string {
            return __.message;
          }

          function pack() {

          }

          function unpack() {
            
          }

          function terminate() {
            _.deleted += 1;
          }

          /// @todo

          let instance = {

          }

          return instance;
        }
      }
    }
    return instance;
  }
})();

namespace _ {
  export let counter: number = 0;
  export let emitter: EventEmitter = new EventEmitter();
  export let numSentFrom: Map<string, number> = new Map();
  export let numSentTo: Map<string, number> = new Map();
  export let mailBox: Map<string, ICargo[]> = new Map();

  function x() {}
}

export function count(): number {
  return _.counter;
}

export function nodes(): string[] {
  return _.emitter.eventNames() as string[];
}

export function numberOfConsumers(port: string): number {
  return _.emitter.listenerCount(port);
}

export function ship(from: string, to: string, message: string, ...args: any[]): boolean {
  let cargo: ICargo = build();
  cargo.updateMessage(message);
  cargo.sendFrom(from);
  cargo.sendTo(to);
  cargo.pack(args);
  _.emitter.emit(to, ...args);
  return true;
}

export function shipToAll(from: string, message: string, ...args: any[]): boolean {
  /// will send cargo to all active listeners
  for (let i = 0; i < nodes().length; i++) {
    ship(from, nodes()[i], message, ...args);
  }
  return true;
}

export function dock(node: string, message: string, callback: (...args: any[]) => any) {
  _.emitter.addListener(node, function(cargo: ICargo) {
    if (cargo.message() === message) {
      callback(cargo.content())
    }
    return;
  });
}

shipToAll("", "SystemUpdate", 3, 948, 39, 1);
dock("", "SystemUpdate", function(numberA, numberB) {

})

// listen to all ports
export function dockToAll() {

}

export function dockTo() {

}

export function dockForCargo() {
  /// access cargo directly
}

export function directDock() {
  /// no message filtering will process message   
}

interface ICargo {
  id:
    () => number;
  chain:
    () => string[];
  route:
    () => string;
  message:
    () => string;
  content:
    () => any[];
  updateMessage:
    (message: string) => void;
  sendFrom:
    (address: string) => void;
  sendTo:
    (address: string) => void;
  pack:
    (content: any[]) => void;
}

export function build() {
  let __: {
    id: number;
    chain: string[];
    route: string;
    message: string;
    content: any[];
  } = {
    id: _.counter += 1,
    chain: [],
    route: "",
    message: "",
    content: []
  }

  function id(): number {
    return __.id;
  }

  function chain(): string[] {
    return __.chain;
  }

  function route(): string {
    return __.route;
  }

  function message(): string {
    return __.message;
  }

  function content(): any[] {
    return __.content;
  }

  function updateMessage(message: string) {
    __.message = message;
    return;
  }

  function sendFrom(address: string) {
    __.chain.push(address);
    return;
  }

  function sendTo(address: string) {
    __.chain.push(address);
    __.route = address;
    return;
  }

  function pack(content: any[]) {
    __.content = content;
    return;
  }

  return {
    id,
    chain,
    route,
    message,
    content,
    updateMessage,
    sendFrom,
    sendTo,
    pack
  }
}