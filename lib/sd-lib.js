// Uses the sd-lib.js file at '$HOME/.local/share/sd-lib'
// and runs it a node:vm.

const vm = require("node:vm");
const fs = require("node:fs");
const path = require("node:path");

const SHARE_DIR = path.join(
    __dirname,
    "..",
    "share",
    "sd-lib"
);

const sdlib = {};

const context = {
    require,
    sdlib,
    console: require("node:console"),
    Error,
    TypeError,
    Buffer,
    Array,
    Object,
    Number
};

const file = path.join(SHARE_DIR, "sd-lib.js");

if (!fs.existsSync(file))
{
    process.exit(1);
}

const fileString = fs.readFileSync(file, "utf-8");

if (!vm.isContext(context))
    vm.createContext(context);

vm.runInContext(fileString, context, "sd-lib");

module.exports.sdlib = sdlib;