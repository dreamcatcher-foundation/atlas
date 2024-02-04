import { EventEmitter } from "events";
export const cargo = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = function () {
                /// Cargo Node
                const _ = (function () {
                    let emitter = new EventEmitter();
                    let counter = 0;
                    let deleted = 0;
                    return {
                        counter,
                        deleted,
                        emitter
                    };
                })();
                function address() {
                    return "CargoNode";
                }
                function count() {
                    return _.counter - _.deleted;
                }
                function activePorts() {
                    return _.emitter.eventNames();
                }
                function activePort(position) {
                    return activePorts().at(position);
                }
                function activePortLength() {
                    return activePorts().length;
                }
                function dockers(port) {
                    return _.emitter.listeners(port);
                }
                function dockersLength(port) {
                    return dockers(port).length;
                }
                function docker(port, position) {
                    return dockers(port).at(position);
                }
                function capacity() {
                    return _.emitter.getMaxListeners();
                }
                function updateCapacity(capacity) {
                    _.emitter.setMaxListeners(capacity);
                    return instance;
                }
                function ship(cargo) {
                    _.emitter.emit(cargo.lastRoute(), cargo);
                    return instance;
                }
                function openStream(port, callback) {
                    _.emitter.addListener(port, callback);
                    return instance;
                }
                function closeAll(port) {
                    _.emitter.removeAllListeners(port);
                    return instance;
                }
                function build() {
                    /// Cargo
                    const __ = (function () {
                        let id = _.counter += 1;
                        let route = [];
                        let content = [];
                        let messageStack = [];
                        return {
                            id,
                            route,
                            content,
                            messageStack
                        };
                    })();
                    function id() {
                        return __.id;
                    }
                    function route(position) {
                        return __.route[position === undefined ? 0 : position];
                    }
                    function lastRoute() {
                        return __.route.at(-1);
                    }
                    function routeLength() {
                        return __.route.length;
                    }
                    function content() {
                        return __.content;
                    }
                    function message(position) {
                        return __.messageStack[position === undefined ? 0 : position];
                    }
                    function lastMessage() {
                        return __.messageStack.at(-1);
                    }
                    function ship(to) {
                        __.route.push(to);
                    }
                }
                return {};
            };
        }
        return instance;
    };
})();
export let car = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = function () {
                /// Cargo Node Instance
                const _ = (function () {
                    let counter = 0;
                    let deleted = 0;
                    let emitter = new EventEmitter();
                    return {
                        counter,
                        deleted,
                        emitter
                    };
                })();
                function address() {
                    return "CargoNode";
                }
                function count() {
                    return _.counter - _.deleted;
                }
                function activePorts() {
                    return _.emitter.eventNames();
                }
                /// @todo
                function build() {
                    /// Cargo Instance
                    const __ = (function () {
                        let id = Number();
                        let route = Array();
                        let destination = String();
                        let message = String();
                        let content = Array();
                        return {
                            id,
                            route,
                            destination,
                            message,
                            content
                        };
                    })();
                    __.id = _.counter += 1;
                    function id() {
                        return __.id;
                    }
                    function route() {
                        return __.route;
                    }
                    function destination() {
                        return __.destination;
                    }
                    function message() {
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
                    let instance = {};
                    return instance;
                }
            };
        }
        return instance;
    };
})();
var _;
(function (_) {
    _.counter = 0;
    _.emitter = new EventEmitter();
    _.numSentFrom = new Map();
    _.numSentTo = new Map();
    _.mailBox = new Map();
    function x() { }
})(_ || (_ = {}));
export function count() {
    return _.counter;
}
export function nodes() {
    return _.emitter.eventNames();
}
export function numberOfConsumers(port) {
    return _.emitter.listenerCount(port);
}
export function ship(from, to, message, ...args) {
    let cargo = build();
    cargo.updateMessage(message);
    cargo.sendFrom(from);
    cargo.sendTo(to);
    cargo.pack(args);
    _.emitter.emit(to, ...args);
    return true;
}
export function shipToAll(from, message, ...args) {
    /// will send cargo to all active listeners
    for (let i = 0; i < nodes().length; i++) {
        ship(from, nodes()[i], message, ...args);
    }
    return true;
}
export function dock(node, message, callback) {
    _.emitter.addListener(node, function (cargo) {
        if (cargo.message() === message) {
            callback(cargo.content());
        }
        return;
    });
}
shipToAll("", "SystemUpdate", 3, 948, 39, 1);
dock("", "SystemUpdate", function (numberA, numberB) {
});
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
export function build() {
    let __ = {
        id: _.counter += 1,
        chain: [],
        route: "",
        message: "",
        content: []
    };
    function id() {
        return __.id;
    }
    function chain() {
        return __.chain;
    }
    function route() {
        return __.route;
    }
    function message() {
        return __.message;
    }
    function content() {
        return __.content;
    }
    function updateMessage(message) {
        __.message = message;
        return;
    }
    function sendFrom(address) {
        __.chain.push(address);
        return;
    }
    function sendTo(address) {
        __.chain.push(address);
        __.route = address;
        return;
    }
    function pack(content) {
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
    };
}
//# sourceMappingURL=cargo.js.map