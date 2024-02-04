import { EventEmitter } from "events";
class CargoPlugInDisk {
    id;
    message;
    response;
    location;
    content;
    state;
    snapshots;
    constructor(id = "", message = "", response = "", location = "", content = {}, state = -1, snapshots = []): ICargoPlugInDisk {
        this.id = id;
        this.message = message;
        this.response = response;
        this.location = location;
        this.content = content;
        this.state = state;
        this.snapshots = snapshots;
    }
}
class CargoPlugIn {
    disk;
    constructor(disk = new CargoPlugInDisk()) {
        this.disk = disk;
    }
    build() {
        return {};
    }
}
const NodeConstructor = (function () {
    class NodeCoreDisk {
        memory;
        constructor(memory = {}) {
            this.memory = memory;
        }
    }
    let _ = new NodeCoreDisk();
    function patch(patch) {
        _.memory = Object.assign(_.memory, patch);
        return instance;
    }
    function install(...plugIns) {
        for (let i = 0; i < plugIns.length; i++) {
            instance = Object
                .assign(instance, plugIns[i](_.memory));
        }
        return instance;
    }
    let instance = {
        patch,
        install
    };
    return instance;
});
let node = NodeConstructor();
node
    .patch({
    message: ""
})
    .install(new CargoPlugIn().build());
let actual = node;
console.log(actual.doSomething());
class Indexer {
    _counter;
    constructor(_counter = 0) {
        this._counter = _counter;
    }
    plugIn(someItem) {
        someItem(this._counter);
        return this;
    }
    execute(module) {
        return this;
    }
}
let x = new Indexer();
x
    .plugIn(function (state) {
    state = 2;
})
    .plugIn(function () {
});
const UNIQUE_HEX_ADDRESS_GENERATOR = (function () {
    class UniqueHexAddressGeneratorDisk {
        addresses;
        constructor(addresses = []) {
            this.addresses = addresses;
        }
    }
    let _ = new UniqueHexAddressGeneratorDisk();
    function generate() {
        return _generate();
    }
    function _generate() {
        let isNotUnique = true;
        let address;
        while (isNotUnique) {
            address = _generateHexAddress();
            _ifAddressesDoesNotContain(address, function () {
                isNotUnique = false;
                _pushNewAddressToAddresses(address);
            });
        }
        return address;
    }
    function _generateHexAddress() {
        return `0x${((Math.floor(Math.random() * 16777215))
            .toString(16))
            .padStart(6, "0")}`;
    }
    function _pushNewAddressToAddresses(address) {
        _.addresses.push(address);
        return;
    }
    function _ifAddressesDoesNotContain(address, callback) {
        if (_.addresses.indexOf(address) === -1) {
            callback();
        }
        return;
    }
    let instance = {
        generate
    };
    return instance;
})();
const CargoConstructor = (function () {
    class CargoDisk {
        id;
        message;
        response;
        location;
        content;
        state;
        snapshots;
        constructor(id = "", message = "", response = "", location = "", content = {}, state = -1, snapshots = []) {
            this.id = id;
            this.message = message;
            this.response = response;
            this.location = location;
            this.content = content;
            this.state = state;
            this.snapshots = snapshots;
        }
    }
    let _ = new CargoDisk();
    function setUp(id) {
        _warnIfStateHasAlreadyBeenSetUp();
        _ifStateIs(-1, function () {
            _updateId(id);
            _updateState(0);
        });
        return _instance();
    }
    function send(message, content) {
        _warnIfStateIsNot0();
        _ifStateIs(0, function () {
            _updateMessage(message);
            _updateContent(content);
            _updateState(1);
        });
        return _instance();
    }
    function receive(response, location) {
        _warnIfSentAndReceivedToAndBySelf(location);
        _warnIfStateIsNot1();
        _ifStateIs(1, function () {
            _updateResponse(response);
            _updateLocation(location);
            _pushNewSnapshotToSnapshots();
            _updateState(0);
        });
        return {
            id: _id(),
            message: _message(),
            response: _response(),
            location: _location(),
            content: _content(),
            state: _state(),
            snapshots: _snapshots(),
        };
    }
    function _id() {
        return _.id;
    }
    function _message() {
        return _.message;
    }
    function _response() {
        return _.response;
    }
    function _location() {
        return _.location;
    }
    function _content() {
        return _.content;
    }
    function _state() {
        return _.state;
    }
    function _snapshots() {
        return _.snapshots;
    }
    function _updateId(id) {
        _.id = id;
        return;
    }
    function _updateMessage(message) {
        _.message = message;
        return;
    }
    function _updateResponse(response) {
        _.response = response;
        return;
    }
    function _updateLocation(location) {
        _.location = location;
        return;
    }
    function _updateContent(content) {
        _.content = content;
        return;
    }
    function _updateState(state) {
        _.state = state;
        return;
    }
    function _pushNewSnapshotToSnapshots() {
        _.snapshots.push({
            message: _message(),
            response: _response(),
            location: _location(),
            content: _content(),
            state: _state()
        });
        return;
    }
    function _ifStateIs(state, callback) {
        if (_state() === state) {
            callback();
        }
        return;
    }
    function _ifStateIsNot(state, callback) {
        if (_state() !== state) {
            callback();
        }
        return;
    }
    function _warnIfStateHasAlreadyBeenSetUp() {
        _ifStateIsNot(-1, function () {
            console.warn("Cargo +> has already been set up");
        });
        return;
    }
    function _warnIfStateIsNot0() {
        _ifStateIsNot(0, function () {
            console.warn("Cargo +> must be state 0");
        });
        return;
    }
    function _warnIfStateIsNot1() {
        _ifStateIsNot(1, function () {
            console.warn("Cargo +> must be state 1");
        });
        return;
    }
    function _warnIfSentAndReceivedToAndBySelf(location) {
        if (_location() === location) {
            console.warn("Cargo +> has been sent and received to and by itself");
        }
        return;
    }
    function _instance() {
        return instance;
    }
    let instance = {
        setUp,
        send,
        receive
    };
    return instance;
});
const SYNC_INTERNAL_EVENT_HANDLER = (function () {
    class SyncInternalEventHandlerDisk extends EventEmitter {
        counter;
        constructor(counter = 0) {
            super();
            this.counter = counter;
        }
    }
    let _ = new SyncInternalEventHandlerDisk();
    function ship(fromPort, toPort, message, content) {
        _ship(fromPort, toPort, message, content);
        return _instance();
    }
    function shipToAll(fromPort, message, content) {
        _shipToAll(fromPort, message, content);
        return _instance();
    }
    function _counter() {
        return _.counter;
    }
    function _incrementCounter() {
        _.counter += 1;
        return;
    }
    function _decrementCounter() {
        _.counter -= 1;
        return;
    }
    function _ship(fromPort, toPort, message, content) {
        _incrementCounter();
        let cargo = CargoConstructor();
        cargo
            .setUp(UNIQUE_HEX_ADDRESS_GENERATOR.generate())
            .receive("", fromPort);
        cargo.send(message, content);
        _.emit(toPort, cargo);
        return;
    }
    function _shipToAll(fromPort, message, content) {
        let activePorts = _.eventNames();
        for (let i = 0; i < activePorts.length; i++) {
            _ship(fromPort, activePorts[i], message, content);
        }
        return;
    }
    function _dock(port, message, callback) {
        _.on(port, function (cargo) {
            if (cargo().receive("", port))
                ;
        });
    }
    function _instance() {
        return instance;
    }
    let instance = {
        ship,
        shipToAll
    };
    return instance;
})();
const cargo = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = function () {
                class Storage extends EventEmitter {
                    counter;
                    constructor(counter = 0) {
                        super();
                        this.counter = counter;
                    }
                }
                let _ = new Storage();
                function ship(from, to, message, content) {
                    return _instance();
                }
                function ship(from, to, message, content) {
                    _incrementCounter();
                    _assignContentTemplate(content, _generateHexAddress(), message, "", from, to, []);
                    _ship(to, content);
                    return instance;
                }
                function dock(from, message, callback) {
                    _decrementCounter();
                    _dock(from, function (content) {
                        if (content.$.message === message) {
                            callback(content);
                        }
                    });
                    return instance;
                }
                function _ports() {
                    return _.eventNames();
                }
                function _portsByIndex(index) {
                    return _ports().at(index);
                }
                function _portsLength() {
                    return _ports().length;
                }
                function _ship(port, content) {
                    _.emit(port, content);
                    return _instance();
                }
                function _dock(port, callback) {
                    _.on(port, callback);
                    return _instance();
                }
                function _assignContentTemplate(content, id, message, response, from, to, snapshots) {
                    Object.assign(content, _createContentTemplate(id, message, response, from, to, snapshots));
                    content.$.snapshots.push(content);
                    return _instance();
                }
                function _createContentTemplate(id, message, response, from, to, snapshots) {
                    return {
                        $: {
                            id: id,
                            message: message,
                            response: response,
                            from: from,
                            to: to,
                            snapshots: snapshots
                        }
                    };
                }
                function _incrementCounter() {
                    _.counter += 1;
                    return _instance();
                }
                function _decrementCounter() {
                    _.counter -= 1;
                    return _instance();
                }
                function _generateHexAddress() {
                    return `0x${((Math.floor(Math.random() * 16777215))
                        .toString(16))
                        .padStart(6, "0")}`;
                }
                function _instance() {
                    return instance;
                }
                return {
                    ship
                };
            };
        }
        return instance;
    };
})();
//# sourceMappingURL=.js.map