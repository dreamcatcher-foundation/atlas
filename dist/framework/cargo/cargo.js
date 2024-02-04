import { EventEmitter } from "events";
function CargoMemoryConstructor() {
    let index = 0;
    let fromPort = "";
    let toPort = "";
    let route = [];
    let message = "";
    let messages = [];
    let contents = {};
    return {
        index,
        fromPort,
        toPort,
        route,
        message,
        messages,
        contents
    };
}
function CargoNodeMemoryConstructor() {
    let counter = 0;
    let indexer = 0;
    let instances = [];
    let emitter = new EventEmitter();
    return {
        counter,
        indexer,
        instances,
        emitter
    };
}
function CargoNodeConstructor(cargoNodeMemory = CargoNodeMemoryConstructor()) {
    function address() {
        return "<< CARGO >>";
    }
    function memory() {
        return cargoNodeMemory;
    }
    function swapMemory(memory) {
        cargoNodeMemory = memory;
        return instance;
    }
    function instances() {
        return cargoNodeMemory.instances;
    }
    function activePorts() {
        return cargoNodeMemory.emitter.eventNames();
    }
    function dockersCount(port) {
        return cargoNodeMemory.emitter.listenerCount(port);
    }
    function dockers(port) {
        return cargoNodeMemory.emitter.listeners(port);
    }
    function capacity() {
        return cargoNodeMemory.emitter.getMaxListeners();
    }
    function updateCapacity(capacity) {
        cargoNodeMemory.emitter.setMaxListeners(capacity);
        return instance;
    }
    function ship(fromPort, toPort, message, content) {
        const CARGO = build()
            .updateMessage(message)
            .update(content)
            .sign(fromPort)
            .ship(toPort);
        cargoNodeMemory.emitter.emit(CARGO.toPort(), CARGO);
        return instance;
    }
    function shipToAll(fromPort, message, content) {
        for (let i = 0; i < activePorts().length; i++) {
            ship(fromPort, activePorts()[i], message, content);
        }
        return instance;
    }
    ///
    function dock(port, message, callback) {
        cargoNodeMemory.emitter.addListener(port, function (cargo) {
            if (cargo.message() === message) {
                callback(cargo.contents());
            }
        });
        return instance;
    }
    ///
    function bounce(port, toPort, message, callback) {
        cargoNodeMemory.emitter.addListener(port, function (cargo) {
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
    function build(cargoMemory = CargoMemoryConstructor()) {
        function factory() {
            return instance;
        }
        function memory() {
            return cargoMemory;
        }
        function swapMemory(memory) {
            cargoMemory = memory;
            return cargoInstance;
        }
        ///
        function index() {
            return cargoMemory.index;
        }
        ///
        function fromPort() {
            return cargoMemory.fromPort;
        }
        function toPort() {
            return cargoMemory.toPort;
        }
        function route() {
            return cargoMemory.route;
        }
        ///
        function message() {
            return cargoMemory.message;
        }
        function messages() {
            return cargoMemory.messages;
        }
        function updateMessage(message) {
            cargoMemory.message = message;
            return cargoInstance;
        }
        ///
        function contents() {
            return cargoMemory.contents;
        }
        function update(content) {
            Object.assign(cargoMemory.contents, content);
            return cargoInstance;
        }
        function override(content) {
            cargoMemory.contents = content;
            return cargoInstance;
        }
        ///
        function sign(nodePort) {
            cargoMemory.route.push(nodePort);
            cargoMemory.fromPort = nodePort;
            return cargoInstance;
        }
        function ship(toPort) {
            cargoMemory.toPort = toPort;
            return cargoInstance;
        }
        function terminate() {
            ship("<< VOID >>");
            return cargoInstance;
        }
        let cargoInstance = {
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
            terminate
        };
        cargoNodeMemory.counter += 1;
        cargoNodeMemory.indexer += 1;
        cargoMemory.index = cargoNodeMemory.indexer;
        return cargoInstance;
    }
    let instance = {
        address,
        memory,
        swapMemory,
        instances,
        activePorts,
        dockersCount,
        dockers,
        build
    };
    return instance;
}
export const CARGO_NODE = CargoNodeConstructor();
//# sourceMappingURL=cargo.js.map