import {EventEmitter} from "events";

interface ICargoPlugInDisk {
  id:          string,
  message:     string,
  response:    string,
  location:    string,
  content:     any,
  state:       number,
  snapshots:   any[]}

class CargoPlugInDisk implements ICargoPlugInDisk {
  public constructor(
    public id:         string  = "",
    public message:    string  = "",
    public response:   string  = "",
    public location:   string  = "",
    public content:    any     = {},
    public state:      number  = -1,
    public snapshots:  any[]   = []
  ): ICargoPlugInDisk {}}

class CargoPlugIn {
  constructor(protected disk: ICargoPlugInDisk = new CargoPlugInDisk()) {}

  public build() {
    return {

    }
  }
}


const NodeConstructor = (function() {
  class NodeCoreDisk {
    public constructor(
      public memory: any = {}
    ) {}
  }

  let _ = new NodeCoreDisk();

  function patch(patch: any): typeof instance {
    _.memory = Object.assign(_.memory, patch);
    return instance;
  }

  function install(...plugIns: Array<(memory: any) => any>): typeof instance {
    for (let i = 0; i < plugIns.length; i++) {
      instance = Object
        .assign(instance, plugIns[i](_.memory));
    }
    return instance;
  }

  let instance = {
    patch,
    install
  }

  return instance;
});

interface INode {
  path:
    (patch: any) => INode;
  install:
    (...plugIns: Array<(memory: any) => any>) => INode;
}

interface IMyModule {
  doSomething:
    () => string;
}

interface Inew extends INode, IMyModule {}

let node: any = NodeConstructor();
node
  .patch({
    message: ""})
  .install(
    new CargoPlugIn().build());

let actual: Inew = node as Inew;

console.log(actual.doSomething());





interface IIndexer {
  generate:
    () => number;
}

class Indexer {
  public constructor(
    protected _counter: number = 0
  ) {}

  public plugIn(someItem: (state: number) => any): this {
    someItem(this._counter);
    return this;
  }

  public execute(module: string): this {

    return this;
  }
}

let x = new Indexer();
x
  .plugIn(function(state: number) {
    state = 2;
  })
  .plugIn(function() {

  });


const UNIQUE_HEX_ADDRESS_GENERATOR = (function() {
  class UniqueHexAddressGeneratorDisk {
    public constructor(
      public addresses: string[] = []
    ) {}
  }

  let _ = new UniqueHexAddressGeneratorDisk();

  function generate(): string {
    return _generate();
  }

  function _generate(): string {
    let isNotUnique: boolean = true;
    let address: string;
    while (isNotUnique) {
      address = _generateHexAddress();
      _ifAddressesDoesNotContain(address, function() {
        isNotUnique = false;
        _pushNewAddressToAddresses(address);
      });
    }
    return address!;
  }

  function _generateHexAddress(): string {
    return `0x${((Math.floor(Math.random() * 16_777_215))
      .toString(16))
      .padStart(6, "0")}`;
  }

  function _pushNewAddressToAddresses(address: string): void {
    _.addresses.push(address);
    return;
  }

  function _ifAddressesDoesNotContain(address: string, callback: () => any): void {
    if (_.addresses.indexOf(address) === -1) {
      callback();
    }
    return;
  }

  let instance = {
    generate
  }

  return instance;
})();

const CargoConstructor = (function() {
  class CargoDisk {
    public constructor(
      public id:         string  = "",
      public message:    string  = "",
      public response:   string  = "",
      public location:   string  = "",
      public content:    any     = {},
      public state:      number  = -1,
      public snapshots:  any[]   = []
    ) {}
  }

  let _ = new CargoDisk();

  function setUp(id: string): typeof instance {
    _warnIfStateHasAlreadyBeenSetUp();
    _ifStateIs(-1, function() {
      _updateId(id);
      _updateState(0);
    });
    return _instance();
  }

  function send(message: string, content: any): typeof instance {
    _warnIfStateIsNot0();
    _ifStateIs(0, function() {
      _updateMessage(message);
      _updateContent(content);
      _updateState(1);
    });
    return _instance();
  }

  function receive(response: string, location: string): any {
    _warnIfSentAndReceivedToAndBySelf(location);
    _warnIfStateIsNot1();
    _ifStateIs(1, function() {
      _updateResponse(response);
      _updateLocation(location);
      _pushNewSnapshotToSnapshots();
      _updateState(0);
    });
    return {
      id:          _id(),
      message:     _message(),
      response:    _response(),
      location:    _location(),
      content:     _content(),
      state:       _state(),
      snapshots:   _snapshots(),
    };
  }

  function _id(): string {
    return _.id;
  }

  function _message(): string {
    return _.message;
  }

  function _response(): string {
    return _.response;
  }

  function _location(): string {
    return _.location;
  }

  function _content(): any {
    return _.content;
  }

  function _state(): number {
    return _.state;
  }

  function _snapshots(): any[] {
    return _.snapshots;
  }

  function _updateId(id: string): void {
    _.id = id;
    return;
  }

  function _updateMessage(message: string): void {
    _.message = message;
    return;
  }

  function _updateResponse(response: string): void {
    _.response = response;
    return;
  }

  function _updateLocation(location: string): void {
    _.location = location;
    return;
  }

  function _updateContent(content: any): void {
    _.content = content;
    return;
  }

  function _updateState(state: number): void {
    _.state = state;
    return;
  }

  function _pushNewSnapshotToSnapshots(): void {
    _.snapshots.push({
      message:   _message(),
      response:  _response(),
      location:  _location(),
      content:   _content(),
      state:     _state()
    });
    return;
  }

  function _ifStateIs(state: number, callback: () => any): void {
    if (_state() === state) {
      callback();
    }
    return;
  }

  function _ifStateIsNot(state: number, callback: () => any): void {
    if (_state() !== state) {
      callback();
    }
    return;
  }

  function _warnIfStateHasAlreadyBeenSetUp(): void {
    _ifStateIsNot(-1, function() {
      console.warn("Cargo +> has already been set up");
    });
    return;
  }

  function _warnIfStateIsNot0(): void {
    _ifStateIsNot(0, function() {
      console.warn("Cargo +> must be state 0");
    });
    return;
  }

  function _warnIfStateIsNot1(): void {
    _ifStateIsNot(1, function() {
      console.warn("Cargo +> must be state 1");
    });
    return;
  }

  function _warnIfSentAndReceivedToAndBySelf(location: string): void {
    if (_location() === location) {
      console.warn("Cargo +> has been sent and received to and by itself");
    }
    return;
  }

  function _instance(): typeof instance {
    return instance;
  }

  let instance = {
    setUp,
    send,
    receive
  }

  return instance;
});

const SYNC_INTERNAL_EVENT_HANDLER = (function() {
  class SyncInternalEventHandlerDisk extends EventEmitter {
    public constructor(
      public counter: number = 0
    ) {
      super();
    }
  }

  let _ = new SyncInternalEventHandlerDisk();

  function ship(fromPort: string, toPort: string, message: string, content: any): typeof instance {
    _ship(fromPort, toPort, message, content);
    return _instance();
  }

  function shipToAll(fromPort: string, message: string, content: any): typeof instance {
    _shipToAll(fromPort, message, content);
    return _instance();
  }

  function _counter(): number {
    return _.counter;
  }

  function _incrementCounter(): void {
    _.counter += 1;
    return;
  }

  function _decrementCounter(): void {
    _.counter -= 1;
    return;
  }

  function _ship(fromPort: string, toPort: string, message: string, content: any): void {
    _incrementCounter();
    let cargo = CargoConstructor();
    cargo
      .setUp(UNIQUE_HEX_ADDRESS_GENERATOR.generate())
      .receive("", fromPort);
    cargo.send(message, content);
    _.emit(toPort, cargo);
    return;
  }

  function _shipToAll(fromPort: string, message: string, content: any): void {
    let activePorts: string[] = _.eventNames() as string[];
    for (let i = 0; i < activePorts.length; i++) {
      _ship(fromPort, activePorts[i], message, content);
    }
    return;
  }

  function _dock(port: string, message: string, callback: (content: any) => any): void {
    _.on(port, function(cargo: typeof CargoConstructor) {
      
      if (cargo().receive("", port))
    })

  }

  function _instance(): typeof instance {
    return instance;
  }

  let instance = {
    ship,
    shipToAll
  }

  return instance;
})();


interface ICargoNode {

}

const cargo = (function() {
  let instance: ICargoNode;
  return function() {
    if (!instance) {
      instance = function() {
        class Storage extends EventEmitter {
          public constructor(
            public counter: number = 0
          ) {
            super()
          } 
        }

        let _ = new Storage();

        function ship(from: string, to: string, message: string, content: any): typeof instance {

          return _instance();
        }

        function ship(from: string, to: string, message: string, content: any): typeof instance {
          _incrementCounter();
          _assignContentTemplate(content, _generateHexAddress(), message, "", from, to, []);
          _ship(to, content);
          return instance;
        }

        

        function dock(from: string, message: string, callback: (content: any) => any): typeof instance {
          _decrementCounter();
          _dock(from, function(content: any) {
            if (content.$.message === message) {
              callback(content);
            }
          });
          return instance;
        }

        function _ports(): string[] {
          return _.eventNames() as string[];
        }

        function _portsByIndex(index: number): string | undefined {
          return _ports().at(index);
        }

        function _portsLength(): number {
          return _ports().length;
        }

        function _ship(port: string, content: any): typeof instance {
          _.emit(port, content);
          return _instance();
        }

        function _dock(port: string, callback: (content: any) => any): typeof instance {
          _.on(port, callback);
          return _instance();
        }

        function _assignContentTemplate(content: any, id: string, message: string, response: string, from: string, to: string, snapshots: any[]): typeof instance {
          Object.assign(content, _createContentTemplate(id, message, response, from, to, snapshots));
          content.$.snapshots.push(content);
          return _instance();
        }

        function _createContentTemplate(id: string, message: string, response: string, from: string, to: string, snapshots: any[]): any {
          return {
            $: {
              id:          id,
              message:     message,
              response:    response,
              from:        from,
              to:          to,
              snapshots:   snapshots
            }
          }
        }

        function _incrementCounter(): typeof instance {
          _.counter += 1;
          return _instance();
        }

        function _decrementCounter(): typeof instance {
          _.counter -= 1;
          return _instance();
        }

        function _generateHexAddress(): string {
          return `0x${((Math.floor(Math.random() * 16_777_215))
            .toString(16))
            .padStart(6, "0")}`;
        }

        function _instance(): typeof instance {
          return instance;
        }

        return {
          ship
        }
      }
    }
    return instance;
  }
})();