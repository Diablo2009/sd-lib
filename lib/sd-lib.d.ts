export declare namespace sdlib {
    /** All valid types for use in `checkType`. */
    export type Types =
        | "undefined"
        | "null"
        | "object"
        | "array"
        | "boolean"
        | "number"
        | "bigint"
        | "string"
        | "symbol"
        | "function";

    export type ObjectType = {
        name: string;
        type: Types;
        inner?: Array<ObjectType>;
    }

    // Type Checking

    /**
     * Takes a `variable` and gets it type, cross-referencing it to the `expectedType`.
     * @throws TypeError if the `variable` type is not the same as the `expectedType`.
     */
    export function checkType(variable: any, variableName: string, expectedType: Types): void;

    export function checkObjectType(variable: any, variableName: string, ...types: Array<ObjectType>): void;

    // Version

    interface Version {
        toString(): string;
        get major(): number;
        get minor(): number;
        get patch(): number;
    }

    interface VersionStatic {
        new (versionString: string): Version;
        new (major: number, minor?: number, patch?: number): Version;

        isNew(current: Version, old: Version): boolean;
    }

    export const Version: VersionStatic

    // Constants

    /**
     * The current version of sd-lib.
     */
    export const version: string;
}