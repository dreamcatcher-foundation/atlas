import fs from "fs";
import { EventEmitter } from "events";
import express, { Router } from "express";
import { rateLimit } from "express-rate-limit";
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
    Core: "<CORE>",
    Authenticator: "<AUTH>",
    NetworkAdaptor: "<NKAR>",
    FileSysAdaptor: "<FSAR>",
    ConsoleAdaptor: "<CEAR>",
    ErrorHandler: "<ERHR>"
};
export const INDEXER = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = function () {
                const _ = {
                    index: 0
                };
                function generate() {
                    _.index += 1;
                    return _.index;
                }
                return {
                    generate
                };
            }();
        }
        return instance;
    };
})();
export const CargoConstructor = function () {
    const _ = {
        index: INDEXER().generate(),
        chain: [],
        content: {},
        port: NODE_REGISTRAR.Core
    };
    function index() {
        return _.index;
    }
    function chain() {
        return _.chain;
    }
    function content() {
        return _.content;
    }
    function port() {
        return _.port;
    }
    function route(port) {
        _.port = port;
        return INSTANCE;
    }
    function pack(content) {
        _.content = content;
        return INSTANCE;
    }
    function inject(content) {
        Object.assign(_.content, content);
        return INSTANCE;
    }
    function sign(nodeId) {
        _.chain.push(nodeId);
        return INSTANCE;
    }
    function ship() {
        NET().broadcast(INSTANCE);
        return INSTANCE;
    }
    const INSTANCE = {
        index,
        chain,
        content,
        port,
        route,
        pack,
        inject,
        sign,
        ship
    };
    return INSTANCE;
};
export const NET = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = function () {
                const _ = {
                    emitter: new EventEmitter()
                };
                function activePorts() {
                    return _.emitter.eventNames();
                }
                function numberOfStreamers(port) {
                    return _.emitter.listenerCount(port);
                }
                function streamers(port) {
                    return _.emitter.listeners(port);
                }
                function capacity() {
                    return _.emitter.getMaxListeners();
                }
                function updateCapacity(capacity) {
                    _.emitter.setMaxListeners(capacity);
                    return instance;
                }
                function broadcast(cargo) {
                    _.emitter.emit(cargo.port(), cargo);
                    return instance;
                }
                function openStream(port, callback) {
                    _.emitter.addListener(port, callback);
                    return instance;
                }
                function openTimedStream(port, ms, callback) {
                    const TIMEOUT_ID = setTimeout(function () {
                        _.emitter.removeListener(port, TIMEOUT_CALLBACK);
                    }, ms);
                    const TIMEOUT_CALLBACK = function (cargo) {
                        clearTimeout(TIMEOUT_ID);
                        callback(cargo);
                    };
                    _.emitter.addListener(port, TIMEOUT_CALLBACK);
                    return instance;
                }
                function openStreamCloseOnSuccess(port, callback) {
                    const SUCCESS_CALLBACK = function (cargo) {
                        if (callback(cargo)) {
                            closeStream(port, SUCCESS_CALLBACK);
                        }
                    };
                    openStream(port, SUCCESS_CALLBACK);
                    return instance;
                }
                function openStreamOnce(port, callback) {
                    const ONCE_CALLBACK = function (cargo) {
                        closeStream(port, ONCE_CALLBACK);
                        callback(cargo);
                    };
                    openStream(port, ONCE_CALLBACK);
                    return instance;
                }
                function openFilteredStream(port, filterCallback, callback) {
                    const FILTERED_CALLBACK = function (cargo) {
                        if (filterCallback(cargo)) {
                            callback(cargo);
                        }
                    };
                    openStream(port, FILTERED_CALLBACK);
                    return instance;
                }
                function closeStream(port, callback) {
                    _.emitter.removeListener(port, callback);
                    return instance;
                }
                function closeEveryStream(port) {
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
                };
            }();
        }
        return instance;
    };
})();
export const SyncDiskConstructor = function (path) {
    const _ = {
        path: path,
        content: {}
    };
    function get(key) {
        _.content[key];
    }
    function set(key, value) {
        _load();
        _.content[key] = value;
        _save();
        return INSTANCE;
    }
    function del(key) {
        _load();
        delete _.content[key];
        _save();
        return INSTANCE;
    }
    function syn(path) {
        _.path = path;
        _load();
        return INSTANCE;
    }
    function _save() {
        fs.writeFileSync(_.path, JSON.stringify(_.content, null, 2));
        return INSTANCE;
    }
    function _load() {
        if (!fs.existsSync(_.path)) {
            fs.writeFileSync(_.path, "{}");
            return {};
        }
        return JSON.parse(fs.readFileSync(_.path, "utf-8"));
    }
    const INSTANCE = {
        get,
        set,
        del,
        syn
    };
    return INSTANCE;
};
export const SyncDiskWrapperConstructor = function (path) {
    const SYNC_DISK = SyncDiskConstructor(path);
    return new Proxy({}, {
        set: function (target, property, value) {
            if (typeof property === "string") {
                SYNC_DISK.set(property, value);
                return true;
            }
            return false;
        },
        get: function (target, property) {
            if (typeof property === "string") {
                return SYNC_DISK.get(property);
            }
            return undefined;
        },
        deleteProperty: function (target, property) {
            if (typeof property === "string") {
                SYNC_DISK.del(property);
                return true;
            }
            return false;
        }
    });
};
export const SyncDiskArrayConstructor = function (path) {
    const _ = {
        path: path,
        content: []
    };
    function get(index) {
        _load();
        return _.content[index];
    }
    function set(index, value) {
        _load();
        _.content[index] = value;
        _save();
        return INSTANCE;
    }
    function syn(path) {
        _.path = path;
        _load();
        return INSTANCE;
    }
    function length() {
        return _.content.length;
    }
    function push(...items) {
        _load();
        _.content.push(...items);
        _save();
        return INSTANCE;
    }
    function pop() {
        _load();
        const ITEM = _.content.pop();
        _save();
        return ITEM;
    }
    function shift() {
        _load();
        const ITEM = _.content.shift();
        _save();
        return ITEM;
    }
    function unshift(...items) {
        _load();
        _.content.unshift(...items);
        _save();
        return INSTANCE;
    }
    function save() {
        return _save();
    }
    function load() {
        return _load();
    }
    function _save() {
        fs.writeFileSync(_.path, JSON.stringify(_.content, null, 2));
        return INSTANCE;
    }
    function _load() {
        if (!fs.existsSync(_.path)) {
            fs.writeFileSync(_.path, "[]");
            return [];
        }
        return JSON.parse(fs.readFileSync(_.path, "utf-8"));
    }
    const INSTANCE = {
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
    };
    return INSTANCE;
};
export const SyncDiskArrayWrapperConstructor = function (path) {
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
            const PROPERTY_NAME = property;
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
                return function (...args) {
                    const RESULT = target[property].apply(target, args);
                    if (typeof target.save === "function") {
                        target.save();
                        return RESULT;
                    }
                };
            }
        }
    });
};
export function on({ node, message, task, }) {
    NET().openStream(node, function (cargo) {
        if (cargo.content().message === message) {
            task(cargo);
        }
    });
    return;
}
export function send({ from = NODE_REGISTRAR.Core, to, message, cargo, }) {
    return CargoConstructor()
        .pack(cargo)
        .inject({ message: message })
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
});
on({
    node: NODE_REGISTRAR.Core,
    message: "ConnectionSent",
    task(cargo) {
    },
});
export const NETWORK = (function () {
    let instance;
    return function () {
        if (!instance) {
            instance = function () {
                const _ = {
                    application: express(),
                    router: Router(),
                    activePublicEndpoints: [],
                    activePrivateEndpoints: [],
                    server: undefined,
                    port: 6969,
                    rateLimitWindowMs: 60000,
                    rateLimitMaxRequestsPerWindowMs: 100,
                    rateLimitMessage: "Too many requests from this IP, please try again later"
                };
                function application() {
                    return _.application;
                }
                function router() {
                    return _.router;
                }
                function activePublicEndpoints() {
                    return _.activePublicEndpoints;
                }
                function activePrivateEndpoints() {
                    return _.activePrivateEndpoints;
                }
                function rateLimitWindowMs() {
                    return _.rateLimitWindowMs;
                }
                function rateLimitMaxRequestsPerWindowMs() {
                    return _.rateLimitMaxRequestsPerWindowMs;
                }
                function rateLimitMessage() {
                    return _.rateLimitMessage;
                }
                function server() {
                    return _.server;
                }
                function isConnected() {
                    if (server()) {
                        return true;
                    }
                    return false;
                }
                function port() {
                    return _.port;
                }
                function updatePort(port) {
                    _.port = port;
                    return instance;
                }
                function openPublicEndpoint(endpoint, callback) {
                    router()["get"](endpoint, callback);
                    activePublicEndpoints().push(endpoint);
                    return instance;
                }
                function openPrivateEndpoint(endpoint, callback) {
                    router()["post"](endpoint, callback);
                    activePrivateEndpoints().push(endpoint);
                    return instance;
                }
                function closePublicEndpoint(endpoint) {
                    const INDEX = activePublicEndpoints().indexOf(endpoint);
                    if (INDEX !== -1) {
                        router().stack = router().stack.filter(function (layer) {
                            return layer.route?.path !== endpoint;
                        });
                        activePublicEndpoints().splice(INDEX, 1);
                    }
                    return instance;
                }
                function closePrivateEndpoint(endpoint) {
                    const INDEX = activePrivateEndpoints().indexOf(endpoint);
                    if (INDEX !== -1) {
                        router().stack = router().stack.filter(function (layer) {
                            return layer.route?.path !== endpoint;
                        });
                        activePrivateEndpoints().splice(INDEX, 1);
                    }
                    return instance;
                }
                function connect(callback) {
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
                function disconnect(callback) {
                    if (server()) {
                        server().close(function () {
                            callback();
                            _.server = undefined;
                        });
                    }
                    return instance;
                }
                function reconnect() {
                    disconnect(function () { });
                    connect(function () { });
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
    };
})();
/// NETWORK NODE
(function () {
    const NODE_ID = NODE_REGISTRAR.NetworkAdaptor;
    NET().openStream(NODE_ID, function (cargo) {
        let content = cargo.content();
        let message = content.request;
        switch (message) {
            case "OpenPublicEndpoint":
                let endpoint = content.endpoint;
                NETWORK().openPublicEndpoint(endpoint, function (request, response) {
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
                break;
            case "PublicEndpointQueryResponse":
                let response = content.response;
                let webResponse = content.webResponse;
                response.send(webResponse);
                content.success = true;
                CargoConstructor()
                    .pack(content)
                    .route(NODE_REGISTRAR.Core)
                    .ship();
                break;
        }
    });
    NETWORK().openPublicEndpoint("/", function (request, response) {
        const INDEX = CargoConstructor()
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
        const CALLBACK_ID = function (cargo) {
            if (cargo.index() === INDEX) {
                let content = cargo.content();
                response.send(content.response);
                NET().closeStream(NODE_ID, CALLBACK_ID);
            }
        };
        NET().openStream(NODE_ID, CALLBACK_ID);
    });
    NETWORK().openPrivateEndpoint("/chrysalis", function (request, response) {
        const INDEX = CargoConstructor()
            .inject({})
            .sign(NODE_ID)
            .ship()
            .index();
    });
})();
(function () {
    const NODE_ID = NODE_REGISTRAR.ConsoleAdaptor;
    let commandParserMapping;
    NET().openStream(NODE_ID, function (cargo) {
        try {
            let command = commandParserMapping.get(cargo.content().command)();
        }
        catch (error) {
            cargo.sign(NODE_ID)
                .inject({ error: error })
                .route(NODE_REGISTRAR.Authenticator)
                .ship();
        }
    });
    NET().openFilteredStream(NODE_ID, function (cargo) {
        if (cargo.content().request === "+> cargo-log") {
            return true;
        }
        return false;
    }, function (cargo) {
        cargo.sign(NODE_ID);
        console.log(cargo);
    });
    NET().openStream(NODE_ID, function (cargo) {
        let initialSender = cargo.chain()[0];
        console.log(cargo.chain());
        cargo.content().response = "CargoLogged";
        cargo
            .route(initialSender)
            .sign(NODE_ID)
            .ship();
        return;
    });
})();
(function () {
    let nodeId = NODE_REGISTRAR.ErrorHandler;
    on(nodeId, "NewErrorLogged", function (cargo) {
        let error = cargo.content().error;
    });
})();
/// CORE NODE
(function () {
    const NODE_ID = NODE_REGISTRAR.Core;
})();
//# sourceMappingURL=core.js.map