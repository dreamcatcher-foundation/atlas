import { EventEmitter } from "events";
const UNIQUE_HEX_ADDRESS_GENERATOR = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = function () {
                class UniqueHexAddressGeneratorDisk {
                    generatedAddresses;
                    constructor(generatedAddresses = []) {
                        this.generatedAddresses = generatedAddresses;
                    }
                }
                let _ = new UniqueHexAddressGeneratorDisk();
                function generate() {
                    return _generate();
                }
                function _generateHexAddress() {
                    return `0x${((Math.floor(Math.random() * 16777215))
                        .toString(16))
                        .padStart(6, "0")}`;
                }
                function _generatedAddressesContains(address) {
                    return _.generatedAddresses.indexOf(address) !== -1;
                }
                function _generatedAddressesDoesNotContain(address) {
                    return !_generatedAddressesContains(address);
                }
                function _generate() {
                    let isUniqueAddress = false;
                    let address;
                    while (!isUniqueAddress) {
                        address = _generateHexAddress();
                        _ifGeneratedAddressesDoesNotContain(address, function () {
                            isUniqueAddress = true;
                        });
                    }
                    _pushNewGeneratedAddress(address);
                    return address;
                }
                function _pushNewGeneratedAddress(address) {
                    _.generatedAddresses.push(address);
                    return instance;
                }
                function _ifGeneratedAddressesDoesNotContain(address, callback) {
                    if (_generatedAddressesDoesNotContain(address)) {
                        callback();
                    }
                    return instance;
                }
                return {
                    generate
                };
            }();
        }
        return instance;
    };
})();
const UNIQUE_HEX_ADDRESS_GENERATOR = (function () {
    class UniqueHexAddressGeneratorDisk {
        addresses;
        constructor(addresses = []) {
            this.addresses = addresses;
        }
    }
    let _ = new UniqueHexAddressGeneratorDisk();
    let instance = {};
    return instance;
})();
const CargoConstructor = (function () {
    class CargoDisk {
        address;
        message;
        response;
        location;
        contents;
        snapshots;
        state;
        constructor(address = "", message = "", response = "", location = "", contents = {}, snapshots = [], state = -1) {
            this.address = address;
            this.message = message;
            this.response = response;
            this.location = location;
            this.contents = contents;
            this.snapshots = snapshots;
            this.state = state;
        }
    }
    let _ = new CargoDisk();
    function address() {
        return _address();
    }
    function message() {
        return _message();
    }
    function response() {
        return _response();
    }
    function location() {
        return _location();
    }
    function contents() {
        return _contents();
    }
    function snapshots() {
        return _snapshots();
    }
    function snapshotsByIndex(index) {
        return _snapshotsByIndex(index);
    }
    function snapshotsLength() {
        return _snapshotsLength();
    }
    function state() {
        return _state();
    }
    function setUp(address) {
        _ifStateIs(-1, function () {
            _updateAddress(address);
            _updateState(0);
            return instance;
        });
        _warnIsAlreadySetUp();
        return instance;
    }
    function send(message, contents) {
        _ifStateIs(0, function () {
            _updateMessage(message);
            _updateContents(contents);
            _updateState(1);
            return instance;
        });
        _warnStateIsNot0();
        return instance;
    }
    function receive(response, location) {
        _warnIfIsSentAndReceivedToAndBySelf(location);
        _ifStateIs(1, function () {
            _updateResponse(response);
            _updateLocation(location);
            _pushInstanceToSnapshot();
            _updateState(0);
            return _contents();
        });
        _warnStateIsNot1();
        return;
    }
    function _address() {
        return _.address;
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
    function _contents() {
        return _.contents;
    }
    function _snapshots() {
        return _.snapshots;
    }
    function _snapshotsByIndex(index) {
        return _.snapshots.at(index);
    }
    function _snapshotsLength() {
        return _.snapshots.length;
    }
    function _state() {
        return _.state;
    }
    function _updateAddress(address) {
        _.address = address;
        return instance;
    }
    function _updateMessage(message) {
        _.message = message;
        return instance;
    }
    function _updateResponse(response) {
        _.response = response;
        return instance;
    }
    function _updateLocation(location) {
        _.location = location;
        return instance;
    }
    function _updateContents(contents) {
        _.contents = contents;
        return instance;
    }
    function _pushInstanceToSnapshot() {
        _.snapshots.push({
            message: _message(),
            response: _response(),
            location: _location(),
            contents: _contents(),
            state: _state()
        });
        return instance;
    }
    function _updateState(state) {
        _.state = state;
        return instance;
    }
    function _ifStateIs(state, callback) {
        if (_.state === state) {
            callback();
        }
        return instance;
    }
    function _warnIsAlreadySetUp() {
        console.warn("Cargo +> has already been set up");
        return instance;
    }
    function _warnStateIsNot0() {
        console.warn("Cargo +> must be state 0");
        return instance;
    }
    function _warnStateIsNot1() {
        console.warn("Cargo +> must be state 1");
        return instance;
    }
    function _warnIfIsSentAndReceivedToAndBySelf(location) {
        if (_location() === location) {
            console.warn("Cargo +> has been sent and received to and by itself");
        }
        return instance;
    }
    let instance = {
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
    };
    return instance;
});
class SyncInternalEventHandler extends EventEmitter {
    _counter;
    constructor(_counter = 0) {
        super();
        this._counter = _counter;
    }
    ship(fromPort, toPort, message, cargo) {
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
    shipToAll(fromPort, message, cargo) {
        return this;
    }
    /// Literally yeet any cargo sent to your port and make it someone else's problem.
    yeet(fromPort, toPort) {
        this.on(fromPort, (cargo) => {
            this.emit(toPort, cargo);
        });
        return this;
    }
    tryDock(port, message, callback) {
        this.on(port, (cargo) => {
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
    dock(port, message, callback) {
        this.on(port, (cargo) => {
            if (cargo["reserved"]["messages"][-1] === message) {
                callback(cargo);
            }
        });
        return this;
    }
    dockUntilMessage(port, message, callback) {
        this.dock(port, message, (cargo) => {
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
    dockOnce(port, callback) {
        this.once(port, callback);
        return this;
    }
}
const SYNC_INTERNAL_EVENT_HANDLER = new SyncInternalEventHandler();
/**
 * It's like sync internal event handler but we put stuff in queues so
 * it doesnt all have to be executed at once, which would melt the
 * server.
 */
class AsyncInternalEventHandler {
    _mailBoxStack;
    constructor(_mailBoxStack = new Map()) {
        this._mailBoxStack = _mailBoxStack;
    }
    ship(fromPort, toPort, message, cargo) {
        let mailBoxStack = this._mailBoxStack.get(toPort);
        if (!mailBoxStack) {
            mailBoxStack = [];
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
    _address;
    constructor(_address) {
        this._address = _address;
    }
    address() {
        return this._address;
    }
    ship(toPort, message, cargo) {
        this._warnIfDestinationIsDead(toPort);
        SYNC_INTERNAL_EVENT_HANDLER.ship(this.address(), toPort, message, cargo);
        return this;
    }
    yeet(toPort) {
        this._warnIfDestinationIsDead(toPort);
        SYNC_INTERNAL_EVENT_HANDLER.yeet(this.address(), toPort);
        return this;
    }
    dock(message, callback) {
        SYNC_INTERNAL_EVENT_HANDLER.dock(this.address(), message, callback);
        return this;
    }
    mail(toPort, message, cargo) {
        return this;
    }
    checkMail(callback) {
    }
    _warnIfDestinationIsDead(port) {
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
TEST_NODE.dock("TestSigned", (cargo) => {
    cargo["endpoint"];
});
//# sourceMappingURL=cargo.js.map