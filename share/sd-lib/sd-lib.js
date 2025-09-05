// Declares all sd-lib functions and classes.

((sdlib) => {

    const util = require("node:util");

    function getType(val) {
        if (val === null) return "null";
        if (Array.isArray(val)) return "array";
        return typeof val;
    }


    function checkType(x, y, z) {
        const validTypeNames = [
            "undefined",
            "null",
            "object",
            "array",
            "boolean",
            "number",
            "bigint",
            "string",
            "symbol",
            "function"
        ];

        if (!validTypeNames.includes(z))
            throw new TypeError(`The type of 'expectedType' is ${typeof z}, expected sdlib.Types.`);
        else if (typeof y != "string")
            throw new TypeError(`The type of 'variableName' is ${typeof y}, expected string.`);

        const actualType = getType(x);

        if (actualType !== z)
            throw new TypeError(`The type of '${y}' is ${actualType}, expected ${z}.`);
    }

    /**
     * 
     * @param {any} x 
     * @param {string} y 
     * @param  {...import("../../lib/sd-lib").sdlib.ObjectType} z 
     */
    function checkObjectType(x, y, ...z) {
        checkType(x, "variable", "object");
        checkType(y, "variableName", "string");
        checkType(z, "...types", "array");

        for (const item of z) {
            const { name, type, inner } = item;
            if (!name || !type || typeof name != "string")
                throw new TypeError(`The type of '...types' is not of type Array<sdlib.ObjectType>.`);
            else if (type == "object" && !inner)
                throw new TypeError(`The type of '...types' is not of type Array<sdlib.ObjectType>.`);

            if (!(name in x))
                throw new TypeError(`Could not find '${name}' on variable '${y}'.`);
            else 
                checkType(x[name], `${y}.${name}`, type);

            if (type == "object") {
                checkType(inner, "<sdlib.ObjectType>.inner", "array");
                checkObjectType(x[name], `${y}.${name}`, ...inner);
            }
        }
    }

    class Version {
        major;
        minor;
        patch;

        constructor(x, y, z) {
            if (typeof x == "string") {
                const versionParts = x.split(".").map((v) => {
                    let n = Number(v);

                    if (Number.isNaN(n))
                        n = 0;

                    if (n < 0)
                        n = -n;

                    return n;
                });

                if (versionParts.length > 3)
                    throw new Error("The length of a version should not be more than three sections.");

                while (versionParts.length < 3) versionParts.push(0);

                let major = 0, minor = 0, patch = 0;

                for (let i = 0; i < versionParts.length; i++) {
                    if (Number.isNaN(versionParts[i]) || versionParts[i] < 0)
                        throw new Error("The value of a version section should be a valid, positive number.");

                    if (i == 0)
                        major = versionParts[i];
                    else if (i == 1)
                        minor = versionParts[i];
                    else
                        patch = versionParts[i];
                }

                this.major = major;
                this.minor = minor;
                this.patch = patch;
            } else if (typeof x == "number") {
                if (x < 0 || Number.isNaN(x))
                    throw new Error("The value of a version section should be a valid, positive number.");

                if (y && typeof y == "number") {
                    if (y < 0 || Number.isNaN(y))
                        throw new Error("The value of a version section should be a valid, positive number.");

                    this.minor = y;

                    if (z && typeof z == "number") {
                        if (z < 0 || Number.isNaN(z))
                            throw new Error("The value of a version section should be a valid, positive number.");

                        this.patch = z;
                    }
                }
                
                this.major = x;
            } else {
                this.major = 0;
                this.minor = 0;
                this.patch = 0;
            }
        }

        toString() {
            return `${this.major}.${this.minor}.${this.patch}`;
        }

        [util.inspect.custom]() {
            return this.toString();
        }

        static isNew(current, old) {
            if (!(current instanceof Version))
                throw new TypeError(`The type of 'current' is ${getType(current)}, expected sdlib.Version.`);
            if (!(old instanceof Version))
                throw new TypeError(`The type of 'old' is ${getType(old)}, expected sdlib.Version.`);
        
            if (current.major > old.major) return true;
            if (current.major < old.major) return false;

            if (current.minor > old.minor) return true;
            if (current.minor < old.minor) return false;

            if (current.patch > old.patch) return true;
            if (current.patch < old.patch) return false;

            return false; // same version
        }
    }

    sdlib.checkType = checkType;
    sdlib.checkObjectType = checkObjectType;

    sdlib.Version = Version;

    sdlib.version = new Version("0.1.0").toString();

})(sdlib)