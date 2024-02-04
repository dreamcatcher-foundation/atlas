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
 * Represents a function type that takes no arguments and returns any value.
 * This type is commonly used for functions that generate Data Sharing Keys (DSKs).
 */
export type TDSK = () => any;

/**
 * Represents a function type that takes an internal Data Sharing Key (DSK) and returns any value.
 * This type is commonly used for functions that generate Implementation Components (IMPs).
 * IMPs rely on the provided internal DSK for their functionality.
 */
export type TIMP = (internalDSK: any) => any;

/**
 * Interface defining the structure of a base class.
 * The base class provides methods for installing Data Sharing Keys (DSKs) and Implementation Components (IMPs).
 */
export interface IBase {
  /**
   * Method for installing Data Sharing Keys (DSKs) into the base class.
   * DSKs are functions that generate data or functionality to be shared within the base class.
   * @param components Functions that produce DSKs to be installed.
   * @returns An instance of IBase with the provided DSKs installed.
   */
  installDSKs:
    (...components: TDSK[]) => IBase;

  /**
   * Method for installing Implementation Components (IMPs) into the base class.
   * IMPs are functions that utilize the provided internal DSK to enhance the base class functionality.
   * @param components Functions that produce IMPs to be installed.
   * @returns An instance of IBase with the provided IMPs installed.
   */
  installIMPs:
    (...components: TIMP[]) => IBase;
}

/**
 * Constructor function for creating instances of the base class.
 * The base class allows for the dynamic installation of DSKs and IMPs.
 * @returns An instance of IBase with methods for installing DSKs and IMPs.
 */
export function BaseConstructor(): IBase {
  let __internalDSK:   any       = {};
  let __internalIMP:   IBase     = {
    installDSKs,
    installIMPs};
  
  /**
   * Method for installing Data Sharing Keys (DSKs) into the base class.
   * DSKs are functions that generate data or functionality to be shared within the base class.
   * @param components Functions that produce DSKs to be installed.
   * @returns An instance of IBase with the provided DSKs installed.
   */
  function installDSKs(...components: TDSK[]): typeof __internalIMP {
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
  function installIMPs(...components: TIMP[]): typeof __internalIMP {
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