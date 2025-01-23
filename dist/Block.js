"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parseRecord_1 = require("./tools/parseRecord");
const serializeRecord_1 = __importDefault(require("./tools/serializeRecord"));
class Block {
    constructor(blockJsonObject) {
        this.address = 0 >>> 0;
        if (blockJsonObject) {
            this.address = blockJsonObject.address;
            this.data = Buffer.from(blockJsonObject.data, 'base64');
        }
    }
    /** ### Block.addRecord(record)
     * Method to add a record to the block.  Part of the Intel Hex 386 instantiation process.
     *
     * Returns true as long as the block can accept a new record.  It returns false if the provided
     * record cannot be added sequentially to the block.
     */
    addRecord(record) {
        // if we find that the record to be added cannot be added to this block
        // we need to return false.  However we also must finish the instantiation
        // of this block.
        // Another, possibily unneeded sanity check
        if (this.data && !this._tempData) {
            throw new Error('This block is already complete.  Cannot add new record.');
        }
        // Setup the record for use
        const { length, address, type, data, getExtendedLinearAddress } = record;
        const currentAddress = () => this.address + this._tempData.length;
        const finishBlock = () => {
            this.data = Buffer.from(this._tempData);
            delete this._tempData;
        };
        switch (type) {
            case parseRecord_1.IntelHexRecordType.Data: {
                if (this._tempData.length === 0) {
                    this.address += address;
                }
                for (const byte of data) {
                    this._tempData.push(byte);
                }
                break;
            }
            case parseRecord_1.IntelHexRecordType.EndOfFile: {
                finishBlock();
                break;
            }
            case parseRecord_1.IntelHexRecordType.ExtendedLinearAddress: {
                const ela = getExtendedLinearAddress();
                // If this is the first pass, initialize the tempData storage
                if (!this.data && !this._tempData) {
                    this._tempData = [];
                    this.address += ela;
                }
                if (ela !== currentAddress()) {
                    finishBlock();
                    return false;
                }
                break;
            }
        }
        return true;
    } // AddRecord
    get serializeAs() {
        const block = this;
        return {
            intelHex386() { return serializeAsIntelHex(block); },
            jsonObject() { return serializeAsJsonObject(block); }
        };
    }
}
exports.default = Block;
const serializeAsIntelHex = (block) => {
    let blockRecords = "";
    let cursorPosition = 0 >>> 0;
    const endAddress = (block.address + block.data.length) >>> 0;
    const getCurrentAddress = () => (block.address + cursorPosition);
    const getBytesRemaining = () => (endAddress - getCurrentAddress());
    do {
        const currentAddress = getCurrentAddress();
        const bytesRemaining = getBytesRemaining();
        if (!blockRecords) {
            blockRecords += (0, serializeRecord_1.default)(currentAddress, parseRecord_1.IntelHexRecordType.ExtendedLinearAddress);
        }
        else if (currentAddress % 0x1000 === 0) { // Handle extra linear address setps
            blockRecords += (0, serializeRecord_1.default)(currentAddress, parseRecord_1.IntelHexRecordType.ExtendedLinearAddress);
        }
        const length = bytesRemaining >= 0x20 ? 0x20 : bytesRemaining;
        const data = [];
        for (let i = 0; i < length; i++) {
            data.push(block.data[cursorPosition++]);
        }
        blockRecords += (0, serializeRecord_1.default)(currentAddress, parseRecord_1.IntelHexRecordType.Data, data);
    } while (getBytesRemaining() > 0);
    return blockRecords;
};
const serializeAsJsonObject = (block) => {
    var _a;
    return {
        address: block.address,
        data: ((_a = block.data) === null || _a === void 0 ? void 0 : _a.toString('base64')) || "no data"
    };
};
