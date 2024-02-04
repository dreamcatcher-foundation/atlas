import {EventEmitter} from "events";

class InternalNetworkSolidStateDisk {
  public constructor(
    public emitter: EventEmitter = new EventEmitter()
  ) {}}

interface IInternalNetworkSolidState {}

function InternalNetworkSolidState(
  _: InternalNetworkSolidStateDisk = new InternalNetworkSolidStateDisk()) {
  function emit(
    toPort:  string, 
    cargo:   any): IInternalNetworkSolidState {
    return _emit(
      toPort,
      cargo);}

  function ship(
    toPort:    string,
    message:   string,
    cargo:     any): IInternalNetworkSolidState {
    return _ship(
      toPort,
      message,
      cargo);}
  
  function _emitter(): EventEmitter {
    return _.emitter;
  }
  
  function _ports(): (string | symbol)[] {
    return _emitter().eventNames();
  }

  function _portsLength(): number {
    return _emitter().eventNames().length;
  }

  function _portsByIndex(index: number): string {
    return _emitter().eventNames().at(index) as string;
  }

  function _docksCount(port: string): number {
    return _emitter().listenerCount(port);
  }

  function _docks(port: string): Array<Function> {
    return _emitter().listeners(port);
  }

  function _capacity(): number {
    return _emitter().getMaxListeners();
  }

  function _updateCapacity(capacity: number): IInternalNetworkSolidState {
    _emitter().setMaxListeners(capacity);
    return _instance();
  }

  function _emit(toPort: string, cargo: any): IInternalNetworkSolidState {
    _emitter().emit(toPort, cargo);
    return _instance();
  }

  function _ship(toPort: string, message: string, cargo: any): IInternalNetworkSolidState {
    Object.assign(cargo, {message: message});
    _emitter().emit(toPort, cargo);
    return _instance();
  }

  function _shipToAll(message: string, cargo: any): IInternalNetworkSolidState {
    for (let i = 0; i < _portsLength(); i++) {
      _ship(_portsByIndex(i), message, cargo);}
    return _instance();
  }

  function _dock(fromPort: string, message: string, callback: (cargo: any) => any): IInternalNetworkSolidState {
    _emitter().on(fromPort, function(cargo: any) {
      if (cargo["message"] === message) {
        callback(cargo);}});
    return _instance();
  }

  let instance = {

  }

  function _instance(): IInternalNetworkSolidState {
    return instance;
  }

  return instance;
}

export const INTERNAL_NETWORK_SOLID_STATE: IInternalNetworkSolidState = InternalNetworkSolidState();

import {Server} from "http";
import {rateLimit} from "express-rate-limit";
import express, {Express, Router, Request, Response, NextFunction} from "express";
import { car } from "./cargo.js";

class NetworkMiddlewareSolidStateDisk {
  public constructor(
    public application:                      Express             = express(),
    public router:                           Router              = Router(),
    public endpointsActivePublic:            Array<string>       = [],
    public endpointsActivePrivate:           Array<string>       = [],
    public server:                           Server | undefined  = undefined,
    public port:                             number              = 6000,
    public rateLimitWindowMs:                number              = 60_000,
    public rateLimitMaxRequestsPerWindowMs:  number              = 100,
    public rateLimitMessage:                 string              = "TOO_MANY_REQUESTS"
  ) {}
}

interface INetworkMiddlewareSolidState {
  application:
    () => Express;
  router:
    () => Router;
  endpointsActivePublic:
    () => Array<string>;
  endpointsActivePrivate:
    () => Array<string>;
  openEndpointPublic:
    (endpoint: string, callback: (request: Request, response: Response) => any) => INetworkMiddlewareSolidState;
  openEndpointPrivate:
    (endpoint: string, callback: (request: Request, response: Response) => any) => INetworkMiddlewareSolidState;
  closeEndpointPublic:
    (endpoint: string) => INetworkMiddlewareSolidState;
  closeEndpointPrivate:
    (endpoint: string) => INetworkMiddlewareSolidState;
  updatePort:
    (port: number) => INetworkMiddlewareSolidState;
  connect:
    (callback: () => any) => INetworkMiddlewareSolidState;
  disconnect:
    (callback: () => any) => INetworkMiddlewareSolidState;
  reconnect:
    () => INetworkMiddlewareSolidState;
}

function NetworkMiddlewareSolidState(_: NetworkMiddlewareSolidStateDisk = new NetworkMiddlewareSolidStateDisk()): INetworkMiddlewareSolidState {
  function application(): Express {
    return _application();
  }

  function router(): Router {
    return _router();
  }

  function endpointsActivePublic(): Array<string> {
    return _endpointsActivePrivate();
  }

  function endpointsActivePrivate(): Array<string> {
    return _endpointsActivePrivate();
  }

  function openEndpointPublic(
    endpoint: string, 
    callback: (
      request: Request, 
      response: Response) => any): INetworkMiddlewareSolidState {
    return _openEndpointPublic(endpoint, callback);
  }

  function openEndpointPrivate(
    endpoint: string, 
    callback: (
      request: Request, 
      response: Response) => any): INetworkMiddlewareSolidState {
    return _openEndpointPrivate(endpoint, callback);
  }

  function closeEndpointPublic(endpoint: string): INetworkMiddlewareSolidState {
    return _closeEndpointPublic(endpoint);
  }

  function closeEndpointPrivate(endpoint: string): INetworkMiddlewareSolidState {
    return _closeEndpointPrivate(endpoint);
  }

  function updatePort(port: number): INetworkMiddlewareSolidState {
    return _updatePort(port);
  }

  function connect(callback: () => any): INetworkMiddlewareSolidState {
    return _connect(callback);
  }

  function disconnect(callback: () => any): INetworkMiddlewareSolidState {
    return _disconnect(callback);
  }

  function reconnect(): INetworkMiddlewareSolidState {
    return _reconnect();
  }

  function _application(): Express {
    return _.application;
  }

  function _router(): Router {
    return _.router;
  }

  function _endpointsActivePublic(): Array<string> {
    return _.endpointsActivePublic;
  }

  function _endpointsActivePrivate(): Array<string> {
    return _.endpointsActivePrivate;
  }

  function _server(): Server | undefined {
    return _.server;
  }

  function _port(): number {
    return _.port;
  }

  function _rateLimitWindowMs(): number {
    return _.rateLimitWindowMs;
  }

  function _rateLimitMaxRequestsPerWindowMs(): number {
    return _.rateLimitMaxRequestsPerWindowMs;
  }

  function _rateLimitMessage(): string {
    return _.rateLimitMessage;
  }

  function _updateApplication(application: Express): INetworkMiddlewareSolidState {
    _.application = application;
    return _instance();
  }

  function _updateRouter(router: Router): INetworkMiddlewareSolidState {
    _.router = router;
    return _instance();
  }

  function _addEndpointToEndpointsActivePublic(endpoint: string): INetworkMiddlewareSolidState {
    _.endpointsActivePublic.push(endpoint);
    return _instance();
  }

  function _addEndpointToEndpointActivePrivate(endpoint: string): INetworkMiddlewareSolidState {
    _.endpointsActivePrivate.push(endpoint);
    return _instance();
  }

  function _removeEndpointFromEndpointActivePublic(endpoint: string): INetworkMiddlewareSolidState {
    _.endpointsActivePublic.splice(_.endpointsActivePublic.indexOf(endpoint), 1);
    return _instance();
  }

  function _removeEndpointFromEndpointActivePrivate(endpoint: string): INetworkMiddlewareSolidState {
    _.endpointsActivePrivate.splice(_.endpointsActivePrivate.indexOf(endpoint), 1);
    return _instance();
  }

  function _updateServer(server: Server | undefined): INetworkMiddlewareSolidState {
    _.server = server;
    return _instance();
  }

  function _updatePort(port: number): INetworkMiddlewareSolidState {
    _.port = port;
    return _instance();
  }

  function _updateRateLimitWindowMs(rateLimitLimitWindowMs: number): INetworkMiddlewareSolidState {
    _.rateLimitWindowMs = rateLimitLimitWindowMs;
    return _instance();
  }

  function _updateRateLimitMessage(rateLimitMessage: string): INetworkMiddlewareSolidState {
    _.rateLimitMessage = rateLimitMessage;
    return _instance();
  }

  function _openEndpointPublic(endpoint: string, callback: (request: Request, response: Response) => any): INetworkMiddlewareSolidState {
    (_router() as any)["get"](endpoint, callback);
    _addEndpointToEndpointsActivePublic(endpoint);
    return _instance();
  }

  function _openEndpointPrivate(endpoint: string, callback: (request: Request, response: Response) => any): INetworkMiddlewareSolidState {
    (_router() as any)["post"](endpoint, callback);
    _addEndpointToEndpointActivePrivate(endpoint);
    return _instance();
  }

  function _closeEndpointPublic(endpoint: string): INetworkMiddlewareSolidState {
    let hasEndpoint: boolean = _endpointsActivePublic().indexOf(endpoint) !== -1;
    if (hasEndpoint) {
      _router().stack = _router().stack.filter(function(layer: any) {
        return layer.route?.path !== endpoint;
      });
      _removeEndpointFromEndpointActivePublic(endpoint);
    }
    return _instance();
  }

  function _closeEndpointPrivate(endpoint: string): INetworkMiddlewareSolidState {
    let hasEndpoint: boolean = _endpointsActivePrivate().indexOf(endpoint) !== -1;
    if (hasEndpoint) {
      _router().stack = _router().stack.filter(function(layer: any) {
        return layer.route?.path !== endpoint;
      });
      _removeEndpointFromEndpointActivePrivate(endpoint);
    }
    return _instance();
  }

  function _connect(callback: () => any): INetworkMiddlewareSolidState {
    _
      .application
      .use(rateLimit({
        windowMs:  _rateLimitWindowMs(),
        max:       _rateLimitMaxRequestsPerWindowMs(),
        message:   _rateLimitMessage()
      }))
      .use("/", _router());
    _updateServer(_application().listen(_port(), callback));
    return _instance();
  }

  function _disconnect(callback: () => any): INetworkMiddlewareSolidState {
    if (_server()) {
      _server()?.close(function() {
        callback();
        _updateServer(undefined);
      });
    }
    return _instance();
  }

  function _reconnect(): INetworkMiddlewareSolidState {
    _disconnect(function() {});
    _connect(function() {});
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

  function _instance(): INetworkMiddlewareSolidState {
    return instance;
  }

  return instance;
}

export const NETWORK_MIDDLEWARE_SOLID_STATE: INetworkMiddlewareSolidState = NetworkMiddlewareSolidState();



NETWORK_MIDDLEWARE_SOLID_STATE
  .updatePort(2000)
  .openEndpointPrivate("/", function() {

  })
  .connect(function() {});

class NodeDisk {
  constructor(
    public address: string
  ) {}
}

function Node() {

}