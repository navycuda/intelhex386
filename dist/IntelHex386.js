"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Block_1 = __importDefault(require("./Block"));
const parseRecord_1 = __importDefault(require("./tools/parseRecord"));
/** # Intel Hex 386
 * Instantiates an Intel Hex 386 object for reading and writing
 * intel hex 386 documents.
 */
class IntelHex386 {
    constructor(value) {
        const parseStartTime = Date.now();
        const setTimeToProcess = () => { this.timeToProcess = Date.now() - parseStartTime; };
        if (value instanceof Object) {
            this.headerArray = value.headerArray;
            this.blocks = value.blocks.map(b => new Block_1.default(b));
            setTimeToProcess();
            return;
        }
        this.blocks = [
            new Block_1.default()
        ];
        const currentBlock = () => this.blocks[this.blocks.length - 1];
        // Remove carriage returns and split the document into an array of strings
        // at the new line characters.
        const intelHex386Lines = value.replace(/\r/g, '').split(/\n/);
        // Prepare the storage areas
        this.headerArray = [];
        const intelHexArray = [];
        // Sort out the file header items and the intel hex records
        for (const line of intelHex386Lines) {
            if (line[0] !== ":" && intelHexArray.length === 0) {
                this.headerArray.push(line);
            }
            if (line[0] === ":") {
                intelHexArray.push(line);
            }
        }
        const records = intelHexArray.map(r => (0, parseRecord_1.default)(r));
        // Instantiate the blocks by feeding them records
        for (const record of records) {
            console.log(record);
            if (!currentBlock().addRecord(record)) {
                this.blocks.push(new Block_1.default());
                currentBlock().addRecord(record);
            }
        }
        setTimeToProcess();
    }
    /** ## serializeAs
     * Available serialization formats: IntelHex386, Json
     */
    get serializeAs() {
        const intelHex386 = this;
        return {
            intelHex386() { return serializeAsIntelHex(intelHex386); },
            /** ### json
             * Serialize into a specialized, compact json document.
             */
            json() { return serializeAsJson(intelHex386); },
        };
    }
}
exports.default = IntelHex386;
const serializeAsIntelHex = (intelHex386) => {
    let serializedIntelHex386 = '';
    // Add header array
    for (const header of intelHex386.headerArray) {
        serializedIntelHex386 += header + '\r\n';
    }
    // Add blocks
    for (const block of intelHex386.blocks) {
        serializedIntelHex386 += block.serializeAs.intelHex386();
    }
    // add the end of file record
    serializedIntelHex386 += ':00000001FF';
    return serializedIntelHex386;
};
const serializeAsJson = (intelHex386, pretty = false) => {
    const jsonObject = {
        headerArray: intelHex386.headerArray,
        blocks: intelHex386.blocks.map(b => b.serializeAs.json())
    };
    return !pretty ? JSON.stringify(intelHex386) : JSON.stringify(intelHex386, null, 2);
};
