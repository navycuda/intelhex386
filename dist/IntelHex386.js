"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parseRecord_1 = __importDefault(require("./tools/parseRecord"));
class IntelHex386 {
    constructor(intelHex386Document) {
        const parseStartTime = Date.now();
        this.blocks = [];
        const currentBlock = () => this.blocks[this.blocks.length - 1];
        let currentAddress = 0 >>> 0;
        const intelHex386Lines = intelHex386Document.split(/\r?\n/);
        const headerArray = [];
        const intelHexArray = [];
        for (const line of intelHex386Lines) {
            if (line[0] !== ":" && intelHexArray.length === 0) {
                headerArray.push(line);
            }
            if (line[0] === ":") {
                intelHexArray.push(line);
            }
        }
        const records = intelHexArray.map(r => (0, parseRecord_1.default)(r));
        for (const record of records) {
            if (record.type === 0x00) {
            }
            if (record.type === 0x01) {
                break;
            }
            if (record.type === 0x04) {
            }
        }
        this.timeToProcess = Date.now() - parseStartTime;
        console.log({ IntelHex386: this });
    }
}
exports.default = IntelHex386;
