import {EventEmitter} from "events";

interface IUniqueHexAddressGenerator {
  generate:
    () => string;
}

const UNIQUE_HEX_ADDRESS_GENERATOR: () => IUniqueHexAddressGenerator = (function(): () => IUniqueHexAddressGenerator {
  let instance: IUniqueHexAddressGenerator;

  return function() {
    if (!instance) {
      instance = function(): IUniqueHexAddressGenerator {
        class UniqueHexAddressGeneratorDisk {
          public constructor(
            public generatedAddresses: string[] = []
          ) {}
        }

        let _: UniqueHexAddressGeneratorDisk = new UniqueHexAddressGeneratorDisk();

        function generate(): string {
          return _generate();
        }

        function _generateHexAddress(): string {
          return `0x${((Math.floor(Math.random() * 16_777_215))
            .toString(16))
            .padStart(6, "0")}`;
        }

        function _generatedAddressesContains(address: string): boolean {
          return _.generatedAddresses.indexOf(address) !== -1;
        }

        function _generatedAddressesDoesNotContain(address: string): boolean {
          return !_generatedAddressesContains(address);
        }

        function _generate(): string {
          let isUniqueAddress: boolean = false;
          let address: string;
          while (!isUniqueAddress) {
            address = _generateHexAddress();
            _ifGeneratedAddressesDoesNotContain(address, function() {
              isUniqueAddress = true;
            });
          }
          _pushNewGeneratedAddress(address!);
          return address!;
        }

        function _pushNewGeneratedAddress(address: string): typeof instance {
          _.generatedAddresses.push(address);
          return instance;
        }

        function _ifGeneratedAddressesDoesNotContain(address: string, callback: () => any): typeof instance {
          if (_generatedAddressesDoesNotContain(address)) {
            callback();
          }
          return instance;
        }

        return {
          generate
        }
      }();
    }
    return instance;
  }
})();

const UNIQUE_HEX_ADDRESS_GENERATOR = (function() {
  class UniqueHexAddressGeneratorDisk {
    public constructor(
      public addresses: string[] = []
    ) {}
  }

  let _: UniqueHexAddressGeneratorDisk = new UniqueHexAddressGeneratorDisk();

  

  let instance = {

  }
  
  return instance;
})();

interface ICargo {
  address:
    () => string;
  message:
    () => string;
  response:
    () => string;
  location:
    () => string;
  contents:
    () => any;
  snapshots:
    () => any[];
  snapshotsByIndex:
    (index: number) => any;
  snapshotsLength:
    () => number;
  state:
    () => number;
  setUp:
    (address: string) => ICargo;
  send:
    (message: string, contents: any) => ICargo;
  receive:
    (response: string, location: string) => any;
}

const CargoConstructor: () => ICargo = (function(): ICargo {
  class CargoDisk {
    public constructor(
      public address:    string  = "",
      public message:    string  = "",
      public response:   string  = "",
      public location:   string  = "",
      public contents:   any     = {},
      public snapshots:  any[]   = [],
      public state:      number  = -1
    ) {}
  }

  let _ = new CargoDisk();

  function address(): string {
    return _address();
  }

  function message(): string {
    return _message();
  }

  function response(): string {
    return _response();
  }

  function location(): string {
    return _location();
  }

  function contents(): any {
    return _contents();
  }

  function snapshots(): any[] {
    return _snapshots();
  }

  function snapshotsByIndex(index: number): any | undefined {
    return _snapshotsByIndex(index);
  }

  function snapshotsLength(): number {
    return _snapshotsLength();
  }

  function state(): number {
    return _state();
  }

  function setUp(address: string): typeof instance {
    _ifStateIs(-1, function() {
      _updateAddress(address);
      _updateState(0);
      return instance;
    })
    _warnIsAlreadySetUp();
    return instance;
  }

  function send(message: string, contents: any): typeof instance {
    _ifStateIs(0, function() {
      _updateMessage(message);
      _updateContents(contents);
      _updateState(1);
      return instance;
    });
    _warnStateIsNot0();
    return instance;
  }

  function receive(response: string, location: string): any {
    _warnIfIsSentAndReceivedToAndBySelf(location);
    _ifStateIs(1, function() {
      _updateResponse(response);
      _updateLocation(location);
      _pushInstanceToSnapshot();
      _updateState(0);
      return _contents();
    });
    _warnStateIsNot1();
    return;
  }

  function _address(): string {
    return _.address;
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

  function _contents(): any {
    return _.contents;
  }

  function _snapshots(): any[] {
    return _.snapshots;
  }

  function _snapshotsByIndex(index: number): any | undefined {
    return _.snapshots.at(index);
  }

  function _snapshotsLength(): number {
    return _.snapshots.length;
  }

  function _state(): number {
    return _.state;
  }

  function _updateAddress(address: string): typeof instance {
    _.address = address;
    return instance;
  }

  function _updateMessage(message: string): typeof instance {
    _.message = message;
    return instance;
  }

  function _updateResponse(response: string): typeof instance {
    _.response = response;
    return instance;
  }

  function _updateLocation(location: string): typeof instance {
    _.location = location;
    return instance;
  }

  function _updateContents(contents: any): typeof instance {
    _.contents = contents;
    return instance;
  }

  function _pushInstanceToSnapshot(): typeof instance {
    _.snapshots.push({
      message:   _message(),
      response:  _response(),
      location:  _location(),
      contents:  _contents(),
      state:     _state()
    });
    return instance;
  }

  function _updateState(state: number): typeof instance {
    _.state = state;
    return instance;
  }

  function _ifStateIs(state: number, callback: () => any): typeof instance {
    if (_.state === state) {
      callback();
    }
    return instance;
  }

  function _warnIsAlreadySetUp(): typeof instance {
    console.warn("Cargo +> has already been set up");
    return instance;
  }

  function _warnStateIsNot0(): typeof instance {
    console.warn("Cargo +> must be state 0");
    return instance;
  }

  function _warnStateIsNot1(): typeof instance {
    console.warn("Cargo +> must be state 1");
    return instance;
  }

  function _warnIfIsSentAndReceivedToAndBySelf(location: string): typeof instance {
    if (_location() === location) {
      console.warn("Cargo +> has been sent and received to and by itself");
    }
    return instance;
  }

  let instance: ICargo = {
    address,
    message,
    response,
    location,
    contents,
    snapshots,
    snapshotsByIndex,
    snapshotsLength,
    state,
    setUp,
    send,
    receive
  }

  return instance;
});

class SyncInternalEventHandler extends EventEmitter {
  public constructor(
    protected _counter: number = 0
  ) {
    super();
  }

  public ship(fromPort: string, toPort: string, message: string, cargo: any): this {
    Object.assign(cargo, {
      $: {
        message: "",
        response: "",
        location: "",
        snapshot: []
      }
    });
    cargo.$.message = message;
    cargo.$.location = fromPort;
    cargo.$.snapshot.push(cargo);
    return this;
  }

  /// Make sure everyone hears you loud and clear. For when you know an event is important but dont know what exactly to do with it just yet.
  public shipToAll(fromPort: string, message: string, cargo: any): this {

    return this;
  }

  /// Literally yeet any cargo sent to your port and make it someone else's problem.
  public yeet(fromPort: string, toPort: string): this {
    this.on(fromPort, (cargo: any) => {
      this.emit(toPort, cargo);
    });
    return this;
  }

  public tryDock(port: string, message: string, callback: (cargo: any) => any): this {
    this.on(port, (cargo: any) => {
      try {
        if (cargo["reserved"]["messages"][-1] === message) {
          callback(cargo);
        }
      }
      catch (error) {
        this.yeet(port, PORT_REGISTRAR.HELL); /// Hell is reserved for errors or problems I dont wanna deal with, maybe they will get a second chance.
      }
    });
  }

  public dock(port: string, message: string, callback: (cargo: any) => any): this {
    this.on(port, (cargo: any) => {
      if (cargo["reserved"]["messages"][-1] === message) {
        callback(cargo);
      }
    });
    return this;
  }

  public dockUntilMessage(port: string, message: string, callback: (cargo: any) => any): this {
    this.dock(port, message, (cargo: any) => {
      callback(cargo);
      /// this doesnt work because the actual function is embedded
      this.off(port, callback);
    });
    return this;
  }

  /**
   * Does not filter by message. Will be triggered by the first cargo sent to
   * the port irrespective of the message or context.
   */
  public dockOnce(port: string, callback: (cargo: any) => any): this {
    this.once(port, callback);
    return this;
  }
}

const SYNC_INTERNAL_EVENT_HANDLER: SyncInternalEventHandler = new SyncInternalEventHandler();

/**
 * It's like sync internal event handler but we put stuff in queues so
 * it doesnt all have to be executed at once, which would melt the
 * server.
 */
class AsyncInternalEventHandler {
  public constructor(
    protected _mailBoxStack: Map<string, any[]> = new Map()
  ) {}

  public ship(fromPort: string, toPort: string, message: string, cargo: any): this {
    let mailBoxStack: any[] | undefined = this._mailBoxStack.get(toPort);
    if (!mailBoxStack) {
      mailBoxStack = []
    }
    Object.assign(cargo, {
      "reserved": {
        "messages": [
          message
        ],
        "route": [
          fromPort,
          toPort
        ]
      }
    });
    mailBoxStack.push(cargo);
    this._mailBoxStack.set(toPort, mailBoxStack);
    return this;
  }


}

class Node {
  public constructor(
    protected _address: string
  ) {}

  public address(): string {
    return this._address;
  }

  public ship(toPort: string, message: string, cargo: any): this {
    this._warnIfDestinationIsDead(toPort);
    SYNC_INTERNAL_EVENT_HANDLER.ship(this.address(), toPort, message, cargo);
    return this;
  }

  public yeet(toPort: string): this {
    this._warnIfDestinationIsDead(toPort);
    SYNC_INTERNAL_EVENT_HANDLER.yeet(this.address(), toPort);
    return this;
  }

  public dock(message: string, callback: (cargo: any) => any) {
    SYNC_INTERNAL_EVENT_HANDLER.dock(this.address(), message, callback);
    return this;
  }

  public mail(toPort: string, message: string, cargo: any): this {

    return this;
  }

  public checkMail(callback: (cargo: any) => any) {

  }

  private _warnIfDestinationIsDead(port: string): this {
    if (SYNC_INTERNAL_EVENT_HANDLER.listenerCount(port) === 0) {
      console.warn(`Node +> ${port} IS_DEAD`);
    }
    return this;
  }
}


const TEST_NODE = new Node("<< TEST >>");
TEST_NODE.ship(PORT_REGISTRAR.VOID, "TEST_SIGNED", {
  "my-number": 50
});

TEST_NODE.dock("TestSigned", (cargo: any) => {
  cargo["endpoint"]
})