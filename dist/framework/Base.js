const Base = function () {
    let __internal = {};
    let __external = {
        syncToDisk,
        injectDisk,
        injectImplementation
    };
    function syncToDisk(disk) {
        __internal = disk;
        return __external;
    }
    function injectDisk(...components) {
        for (const COMPONENT of components) {
            __internal = {
                ...__internal,
                ...COMPONENT()
            };
        }
        return __external;
    }
    function injectImplementation(...components) {
        for (const COMPONENT of components) {
            __external = {
                ...__external,
                ...COMPONENT(__internal)
            };
        }
        return __external;
    }
    return __external;
};
const UNIQUE_NUMBER_DISK = function () {
    let uniqueNumber = 0;
    let instance;
    return function () {
        if (!instance) {
            instance = {
                uniqueNumber
            };
        }
        return instance;
    };
};
function Indexer(_) {
    function generateUniqueNumber() {
        return _.uniqueNumber += 1;
    }
    return {
        generateUniqueNumber
    };
}
const INDEXER = Base()
    .injectDisk(UNIQUE_NUMBER_DISK())
    .injectImplementation(Indexer);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import * as events from "events";
const NET_DISK = function NetDisk() {
    let emitter = new events.EventEmitter();
    let instance;
    return function () {
        if (!instance) {
            instance = {
                emitter
            };
        }
        return instance;
    };
};
function Net(_) {
    function active() {
        return _.emitter.eventNames();
    }
    function listenersCount(port) {
        return _.emitter.listenerCount(port);
    }
    function listeners(port) {
        return _.emitter.listeners(port);
    }
    function cap() {
        return _.emitter.getMaxListeners();
    }
    function updateCap(cap) {
        _.emitter.setMaxListeners(cap);
        return instance;
    }
    let instance = {};
    return instance;
}
const NET = Base()
    .injectDisk(NET_DISK)
    .injectImplementation(Net);
function CargoDisk() {
    const ID = INDEXER
        .generateUniqueNumber();
    let fromPort = "";
    let toPort = "";
    let route = [];
    let messages = "";
    let content = {};
    return {
        ID,
        fromPort,
        toPort,
        route,
        messages,
        content
    };
}
function Cargo(_) {
    function id() {
        return _.ID;
    }
    function fromPort() {
        return _.fromPort;
    }
    function toPort() {
        return _.toPort;
    }
    function route(position) {
        return _.route[position];
    }
    function mostRecentRoute() {
        return _.route[-1];
    }
    function messages(position) {
        return _.messages[position];
    }
    function mostRecentMessage() {
        return _.messages[-1];
    }
    function content() {
        return _.content;
    }
    function ship() {
        NET.broadcast(toPort(), mostRecentMessage(), instance);
        return instance;
    }
    let instance = {};
    return instance;
}
//# sourceMappingURL=Base.js.map