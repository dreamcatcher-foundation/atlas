import { EventEmitter } from "events";
class InternalNetworkSolidStateDisk {
    emitter;
    constructor(emitter = new EventEmitter()) {
        this.emitter = emitter;
    }
}
function InternalNetworkSolidState(_ = new InternalNetworkSolidStateDisk()) {
    function emit(toPort, cargo) {
        return _emit(toPort, cargo);
    }
    function ship(toPort, message, cargo) {
        return _ship(toPort, message, cargo);
    }
    function _emitter() {
        return _.emitter;
    }
    function _ports() {
        return _emitter().eventNames();
    }
    function _portsLength() {
        return _emitter().eventNames().length;
    }
    function _portsByIndex(index) {
        return _emitter().eventNames().at(index);
    }
    function _docksCount(port) {
        return _emitter().listenerCount(port);
    }
    function _docks(port) {
        return _emitter().listeners(port);
    }
    function _capacity() {
        return _emitter().getMaxListeners();
    }
    function _updateCapacity(capacity) {
        _emitter().setMaxListeners(capacity);
        return _instance();
    }
    function _emit(toPort, cargo) {
        _emitter().emit(toPort, cargo);
        return _instance();
    }
    function _ship(toPort, message, cargo) {
        Object.assign(cargo, { message: message });
        _emitter().emit(toPort, cargo);
        return _instance();
    }
    function _shipToAll(message, cargo) {
        for (let i = 0; i < _portsLength(); i++) {
            _ship(_portsByIndex(i), message, cargo);
        }
        return _instance();
    }
    function _dock(fromPort, message, callback) {
        _emitter().on(fromPort, function (cargo) {
            if (cargo["message"] === message) {
                callback(cargo);
            }
        });
        return _instance();
    }
    let instance = {};
    function _instance() {
        return instance;
    }
    return instance;
}
export const INTERNAL_NETWORK_SOLID_STATE = InternalNetworkSolidState();
import { rateLimit } from "express-rate-limit";
import express, { Router } from "express";
class NetworkMiddlewareSolidStateDisk {
    application;
    router;
    endpointsActivePublic;
    endpointsActivePrivate;
    server;
    port;
    rateLimitWindowMs;
    rateLimitMaxRequestsPerWindowMs;
    rateLimitMessage;
    constructor(application = express(), router = Router(), endpointsActivePublic = [], endpointsActivePrivate = [], server = undefined, port = 6000, rateLimitWindowMs = 60000, rateLimitMaxRequestsPerWindowMs = 100, rateLimitMessage = "TOO_MANY_REQUESTS") {
        this.application = application;
        this.router = router;
        this.endpointsActivePublic = endpointsActivePublic;
        this.endpointsActivePrivate = endpointsActivePrivate;
        this.server = server;
        this.port = port;
        this.rateLimitWindowMs = rateLimitWindowMs;
        this.rateLimitMaxRequestsPerWindowMs = rateLimitMaxRequestsPerWindowMs;
        this.rateLimitMessage = rateLimitMessage;
    }
}
function NetworkMiddlewareSolidState(_ = new NetworkMiddlewareSolidStateDisk()) {
    function application() {
        return _application();
    }
    function router() {
        return _router();
    }
    function endpointsActivePublic() {
        return _endpointsActivePrivate();
    }
    function endpointsActivePrivate() {
        return _endpointsActivePrivate();
    }
    function openEndpointPublic(endpoint, callback) {
        return _openEndpointPublic(endpoint, callback);
    }
    function openEndpointPrivate(endpoint, callback) {
        return _openEndpointPrivate(endpoint, callback);
    }
    function closeEndpointPublic(endpoint) {
        return _closeEndpointPublic(endpoint);
    }
    function closeEndpointPrivate(endpoint) {
        return _closeEndpointPrivate(endpoint);
    }
    function updatePort(port) {
        return _updatePort(port);
    }
    function connect(callback) {
        return _connect(callback);
    }
    function disconnect(callback) {
        return _disconnect(callback);
    }
    function reconnect() {
        return _reconnect();
    }
    function _application() {
        return _.application;
    }
    function _router() {
        return _.router;
    }
    function _endpointsActivePublic() {
        return _.endpointsActivePublic;
    }
    function _endpointsActivePrivate() {
        return _.endpointsActivePrivate;
    }
    function _server() {
        return _.server;
    }
    function _port() {
        return _.port;
    }
    function _rateLimitWindowMs() {
        return _.rateLimitWindowMs;
    }
    function _rateLimitMaxRequestsPerWindowMs() {
        return _.rateLimitMaxRequestsPerWindowMs;
    }
    function _rateLimitMessage() {
        return _.rateLimitMessage;
    }
    function _updateApplication(application) {
        _.application = application;
        return _instance();
    }
    function _updateRouter(router) {
        _.router = router;
        return _instance();
    }
    function _addEndpointToEndpointsActivePublic(endpoint) {
        _.endpointsActivePublic.push(endpoint);
        return _instance();
    }
    function _addEndpointToEndpointActivePrivate(endpoint) {
        _.endpointsActivePrivate.push(endpoint);
        return _instance();
    }
    function _removeEndpointFromEndpointActivePublic(endpoint) {
        _.endpointsActivePublic.splice(_.endpointsActivePublic.indexOf(endpoint), 1);
        return _instance();
    }
    function _removeEndpointFromEndpointActivePrivate(endpoint) {
        _.endpointsActivePrivate.splice(_.endpointsActivePrivate.indexOf(endpoint), 1);
        return _instance();
    }
    function _updateServer(server) {
        _.server = server;
        return _instance();
    }
    function _updatePort(port) {
        _.port = port;
        return _instance();
    }
    function _updateRateLimitWindowMs(rateLimitLimitWindowMs) {
        _.rateLimitWindowMs = rateLimitLimitWindowMs;
        return _instance();
    }
    function _updateRateLimitMessage(rateLimitMessage) {
        _.rateLimitMessage = rateLimitMessage;
        return _instance();
    }
    function _openEndpointPublic(endpoint, callback) {
        _router()["get"](endpoint, callback);
        _addEndpointToEndpointsActivePublic(endpoint);
        return _instance();
    }
    function _openEndpointPrivate(endpoint, callback) {
        _router()["post"](endpoint, callback);
        _addEndpointToEndpointActivePrivate(endpoint);
        return _instance();
    }
    function _closeEndpointPublic(endpoint) {
        let hasEndpoint = _endpointsActivePublic().indexOf(endpoint) !== -1;
        if (hasEndpoint) {
            _router().stack = _router().stack.filter(function (layer) {
                return layer.route?.path !== endpoint;
            });
            _removeEndpointFromEndpointActivePublic(endpoint);
        }
        return _instance();
    }
    function _closeEndpointPrivate(endpoint) {
        let hasEndpoint = _endpointsActivePrivate().indexOf(endpoint) !== -1;
        if (hasEndpoint) {
            _router().stack = _router().stack.filter(function (layer) {
                return layer.route?.path !== endpoint;
            });
            _removeEndpointFromEndpointActivePrivate(endpoint);
        }
        return _instance();
    }
    function _connect(callback) {
        _
            .application
            .use(rateLimit({
            windowMs: _rateLimitWindowMs(),
            max: _rateLimitMaxRequestsPerWindowMs(),
            message: _rateLimitMessage()
        }))
            .use("/", _router());
        _updateServer(_application().listen(_port(), callback));
        return _instance();
    }
    function _disconnect(callback) {
        if (_server()) {
            _server()?.close(function () {
                callback();
                _updateServer(undefined);
            });
        }
        return _instance();
    }
    function _reconnect() {
        _disconnect(function () { });
        _connect(function () { });
        return _instance();
    }
    let instance = {
        application,
        router,
        endpointsActivePublic,
        endpointsActivePrivate,
        openEndpointPublic,
        openEndpointPrivate,
        closeEndpointPublic,
        closeEndpointPrivate,
        updatePort,
        connect,
        disconnect,
        reconnect
    };
    function _instance() {
        return instance;
    }
    return instance;
}
export const NETWORK_MIDDLEWARE_SOLID_STATE = NetworkMiddlewareSolidState();
NETWORK_MIDDLEWARE_SOLID_STATE
    .updatePort(2000)
    .openEndpointPrivate("/", function () {
})
    .connect(function () { });
class NodeDisk {
    address;
    constructor(address) {
        this.address = address;
    }
}
function Node() {
}
//# sourceMappingURL=main.js.map