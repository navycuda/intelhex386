"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseRecord_1 = require("./tools/parseRecord");
class Block {
    constructor(blockJsonObject) {
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
        var _a;
        // If the address hasn't been set, this is the first record.
        if (this.address === undefined) {
            // If the first record is not an extended linear address the block cannot be properly
            // instantiated and must throw an error
            if (record.type !== parseRecord_1.IntelHexRecordType.ExtendedLinearAddress) {
                // console.log("if (record.type !== IntelHexRecordType.ExtendedLinearAddress)", {block:this,record});
                throw new Error('Tried to instantiate a block without providing an extended linear address first');
            }
            this.address = record.getEla();
            return true;
        }
        // If _tempData is still undefined, the address from the first data record must be
        // added to the block address to set the actual starting address of the block
        if (!this._tempData) {
            this.address += record.address;
            this._tempData = [];
        }
        const length = this._tempData.length;
        const currentAddress = (this.address + length) >>> 0;
        const recordAbsoluteAddress = ((this.address & 0xFFFF0000) + record.address) >>> 0;
        if (record.type === parseRecord_1.IntelHexRecordType.ExtendedLinearAddress) {
            console.log("if (record.type === IntelHexRecordType.ExtendedLinearAddress)", {
                currentAddress: recordAbsoluteAddress.toString(16),
                recordAbsoluteAddress: recordAbsoluteAddress.toString(16),
                ela: (_a = record.getEla()) === null || _a === void 0 ? void 0 : _a.toString(16)
            });
            if (record.getEla() === currentAddress + 1) {
                console.log("if (record.getEla() === currentAddress)");
                this.address += 0x10000;
                return true;
            }
        }
        // **** Add a method to check extended linear address
        if (record.type === parseRecord_1.IntelHexRecordType.EndOfFile) {
            // console.log("EndOfFile");
            return true;
        }
        // Check to see if the supplied record is sequential with this block
        // If it isn't, then finalize the instantiation of the block and return false.
        if (currentAddress !== recordAbsoluteAddress) {
            // console.log("if (currentAddress !== recordAbsoluteAddress)", {block:this,record, currentAddress, recordAbsoluteAddress});
            this.data = Buffer.from(this._tempData);
            delete this._tempData;
            return false;
        }
        // Add the data to the temporary data storage.
        if (record.type === parseRecord_1.IntelHexRecordType.Data) {
            for (const b of record.data) {
                this._tempData.push(b & 0xFF);
            }
        }
        return true;
    }
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
    const maximumRecordLength = 32; // The maximum length of the intel hex record
    let remaining = block.data.length >>> 0;
    let serializedIntelHexData = '';
    while (remaining > 0) {
        // Create the first extended linear address
        // Create additional extended linear addresses as needed
        // Add the data records
    }
    return serializedIntelHexData;
};
const serializeAsJsonObject = (block, pretty = false) => {
    return {
        address: block.address,
        data: block.data.toString('base64')
    };
};
