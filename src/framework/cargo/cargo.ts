import {EventEmitter} from "events";

export interface INode {
  address:
    () => string;
}

interface ICargoMemory {
  index:     number;
  fromPort:  string;
  toPort:    string;
  route:     string[];
  message:   string;
  messages:  string[];
  contents:  any;
}

function CargoMemoryConstructor(): ICargoMemory {
  let index:     number    = 0;
  let fromPort:  string    = "";
  let toPort:    string    = "";
  let route:     string[]  = [];
  let message:   string    = "";
  let messages:  string[]  = [];
  let contents:  any       = {};

  return {
    index,
    fromPort,
    toPort,
    route,
    message,
    messages,
    contents}
}

interface ICargoNodeMemory {
  counter:     number;
  indexer:     number;
  instances:   ICargo[];
  emitter:     EventEmitter;
}

function CargoNodeMemoryConstructor(): ICargoNodeMemory {
  let counter:     number        = 0;
  let indexer:     number        = 0;
  let instances:   ICargo[]      = [];
  let emitter:     EventEmitter  = new EventEmitter();

  return {
    counter,
    indexer,
    instances,
    emitter}
}

interface ICargo {
  factory():
    () => ICargoNode;
  memory:
    () => ICargoMemory;
  swapMemory:
    (memory: ICargoMemory) => ICargo;
  index:
    () => number;
  fromPort:
    () => string;
  toPort:
    () => string;
  route:
    () => string[];
  message:
    () => string;
  messages:
    () => string[];
  updateMessage:
    (message: string) => ICargo;
  contents:
    () => any;
  update:
    (content: any) => ICargo;
  override:
    (content: any) => ICargo;
  sign:
    (node: string) => ICargo;
  ship:
    (toPort: string) => ICargo;
  terminate:
    () => ICargo;
}

interface ICargoNode extends INode {
  memory:
    () => ICargoNodeMemory;
  swapMemory:
    (memory: ICargoNodeMemory) => ICargoNode;
  instances:
    () => ICargo[];
  activePorts:
    () => (string | symbol)[];
  dockersCount:
    (port: string) => number;
  dockers:
    (port: string) => Function[];
  capacity:
    () => number;
  updateCapacity:
    (capacity: number) => ICargoNode;
  ship:
    (fromPort: string, toPort: string, message: string, content: any) => ICargoNode;
  dock:
    (port: string, message: string, callback: (content: any) => any) => ICargoNode;
  bounce:
    (port: string, toPort: string, message: string, callback: (cargo: ICargo) => ICargo) => ICargoNode;
  copyTo:
    (fromPorts: string[], toPorts: string[]) => ICargoNode;
  build:
    (cargoMemory?: ICargoMemory) => ICargo;
}

function CargoNodeConstructor(cargoNodeMemory: ICargoNodeMemory = CargoNodeMemoryConstructor()) {
  function address(): string {
    return "<< CARGO >>";
  }

  function memory(): ICargoNodeMemory {
    return cargoNodeMemory;
  }

  function swapMemory(memory: ICargoNodeMemory): ICargoNode {
    cargoNodeMemory = memory;
    return instance;
  }

  function instances(): ICargo[] {
    return cargoNodeMemory.instances;
  }

  function activePorts(): (string | symbol)[] {
    return cargoNodeMemory.emitter.eventNames();
  }

  function dockersCount(port: string): number {
    return cargoNodeMemory.emitter.listenerCount(port);
  }

  function dockers(port: string): Function[] {
    return cargoNodeMemory.emitter.listeners(port);
  }

  function capacity(): number {
    return cargoNodeMemory.emitter.getMaxListeners();
  }

  function updateCapacity(capacity: number): ICargoNode {
    cargoNodeMemory.emitter.setMaxListeners(capacity);
    return instance;
  }

  function ship(fromPort: string, toPort: string, message: string, content: any): ICargoNode {
    const CARGO: ICargo = build()
      .updateMessage(message)
      .update(content)
      .sign(fromPort)
      .ship(toPort);
    cargoNodeMemory.emitter.emit(CARGO.toPort(), CARGO);
    return instance;
  }

  function shipToAll(fromPort: string, message: string, content: any): ICargoNode {
    for (let i = 0; i < activePorts().length; i++) {
      ship(fromPort, activePorts()[i] as string, message, content);
    }
    return instance;
  }

  ///

  function dock(port: string, message: string, callback: (content: any) => any): ICargoNode {
    cargoNodeMemory.emitter.addListener(port, function(cargo: ICargo) {
      if (cargo.message() === message) {
        callback(cargo.contents());
      }
    });
    return instance;
  }

  ///

  function bounce(port: string, toPort: string, message: string, callback: (cargo: ICargo) => ICargo): ICargoNode {
    cargoNodeMemory.emitter.addListener(port, function(cargo: ICargo) {
      /**
       * Receive from a port and then return the modified cargo
       */
      cargo
        .updateMessage(message)
        .sign(port)
        .ship(toPort);
      cargoNodeMemory.emitter.emit(toPort, callback(cargo));
    });

    return instance;
  }

  function build(cargoMemory: ICargoMemory = CargoMemoryConstructor()): ICargo {
    function factory(): ICargoNode {
      return instance;
    }

    function memory(): ICargoMemory {
      return cargoMemory;
    }

    function swapMemory(memory: ICargoMemory): ICargo {
      cargoMemory = memory;
      return cargoInstance;
    }

    ///

    function index(): number {
      return cargoMemory.index;
    }

    ///

    function fromPort(): string {
      return cargoMemory.fromPort;
    }

    function toPort(): string {
      return cargoMemory.toPort;
    }

    function route(): string[] {
      return cargoMemory.route;
    }

    ///

    function message(): string {
      return cargoMemory.message;
    }

    function messages(): string[] {
      return cargoMemory.messages;
    }

    function updateMessage(message: string): ICargo {
      cargoMemory.message = message;
      return cargoInstance;
    } 

    ///

    function contents(): any {
      return cargoMemory.contents;
    }

    function update(content: any): ICargo {
      Object.assign(cargoMemory.contents, content);
      return cargoInstance;
    }

    function override(content: any): ICargo {
      cargoMemory.contents = content;
      return cargoInstance;
    }

    ///

    function sign(nodePort: string): ICargo {
      cargoMemory.route.push(nodePort);
      cargoMemory.fromPort = nodePort;
      return cargoInstance;
    }

    function ship(toPort: string): ICargo {
      cargoMemory.toPort = toPort;
      return cargoInstance;
    }

    function terminate(): ICargo {
      ship("<< VOID >>");
      return cargoInstance;
    }

    let cargoInstance: ICargo = {
      factory,
      memory,
      swapMemory,
      index,
      fromPort,
      toPort,
      route,
      message,
      messages,
      updateMessage,
      contents,
      update,
      override,
      sign,
      ship,
      terminate}

    cargoNodeMemory.counter += 1;
    cargoNodeMemory.indexer += 1;
    cargoMemory.index = cargoNodeMemory.indexer;

    return cargoInstance;
  }

  let instance: ICargoNode = {
    address,
    memory,
    swapMemory,
    instances,
    activePorts,
    dockersCount,
    dockers,
    build}

  return instance;
}

export const CARGO_NODE: ICargoNode = CargoNodeConstructor();