/**
 * @title Dynamic Software Component Framework
 * @description
 * This TypeScript file defines a versatile framework for constructing dynamic and extensible software components.
 * It facilitates the development of modular and flexible software systems by providing mechanisms for integrating
 * Data Sharing Keys (DSKs) and Implementation Components (IMPs) into a base class.
 *
 * @remarks
 * The framework revolves around the `IBase` interface, which embodies the structure of the base class.
 * It offers two fundamental methods: `installDSKs` and `installIMPs`, allowing developers to augment the base
 * class with custom functionalities and data structures.
 *
 * @remarks
 * DSKs, represented by the `TDSK` type, are functions that generate shared data or functionality within the base class.
 * They enable the encapsulation of reusable logic, promoting code modularity and reusability.
 *
 * @remarks
 * IMPs, represented by the `TIMP` type, are functions that utilize internal DSKs to enhance the base class's capabilities.
 * IMPs leverage the shared functionalities provided by DSKs, fostering composability and extensibility in software design.
 */
/**
 * Constructor function for creating instances of the base class.
 * The base class allows for the dynamic installation of DSKs and IMPs.
 * @returns An instance of IBase with methods for installing DSKs and IMPs.
 */
export function BaseConstructor() {
    let __internalDSK = {};
    let __internalIMP = {
        installDSKs,
        installIMPs
    };
    /**
     * Method for installing Data Sharing Keys (DSKs) into the base class.
     * DSKs are functions that generate data or functionality to be shared within the base class.
     * @param components Functions that produce DSKs to be installed.
     * @returns An instance of IBase with the provided DSKs installed.
     */
    function installDSKs(...components) {
        __internalDSK = {};
        for (let component of components) {
            __internalDSK = {
                ...__internalDSK,
                ...component()
            };
        }
        return __internalIMP;
    }
    /**
     * Method for installing Implementation Components (IMPs) into the base class.
     * IMPs are functions that utilize the provided internal DSK to enhance the base class functionality.
     * @param components Functions that produce IMPs to be installed.
     * @returns An instance of IBase with the provided IMPs installed.
     */
    function installIMPs(...components) {
        for (let component of components) {
            __internalIMP = {
                ...installIMPs,
                ...component(__internalDSK)
            };
        }
        return __internalIMP;
    }
    return __internalIMP;
}
//# sourceMappingURL=Base.js.map