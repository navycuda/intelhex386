import { Block } from "./Block.js";
import getRecordString from "./tools/getRecordString.js";
import parseRecord, { IntelHexRecordType } from "./tools/parseRecord.js";
/**
 * Represents an Intel HEX 386 file.
 */
export default class IntelHex386 {
    header = [];
    _blocks = [new Block()];
    constructor(intelHex386) {
        if (typeof intelHex386 === 'object') {
            this.header = intelHex386.header;
            this._blocks = intelHex386._blocks.map(b => new Block(b));
        }
        else {
            const intelHex386Lines = intelHex386.split(/\r?\n/g);
            const records = [];
            for (const line of intelHex386Lines) {
                if (line[0] === ":") {
                    records.push(parseRecord(line));
                }
                else {
                    this.header.push(line);
                }
            }
            const getCurrentBlock = () => this._blocks[this._blocks.length - 1];
            const addBlock = (record) => {
                this._blocks.push(new Block());
                getCurrentBlock().addRecord(record);
            };
            for (const record of records) {
                const addRecord = getCurrentBlock().addRecord(record);
                if (!addRecord && record.type !== IntelHexRecordType.EndOfFile) {
                    addBlock(record);
                }
            }
        }
    }
    ;
    /**
     * Reads data from the specified address.
     * @param address - The address to read from (can be a number or a hex string).
     * @param length - The number of bytes to read.
     * @returns A Buffer containing the data.
     */
    read(address, length) {
        if (typeof address === "string") {
            address = parseInt(address, 16);
        }
        for (const block of this._blocks) {
            const buffer = block.read(address, length);
            if (buffer) {
                return buffer;
            }
        }
        throw new Error('IntelHex386.read - address or length not appropriate');
    }
    /**
     * Writes data to the specified address.
     * @param address - The address to write to (can be a number or a hex string).
     * @param buffer - The data to write.
     * @returns True if the write was successful.
     */
    write(address, buffer) {
        if (typeof address === "string") {
            address = parseInt(address, 16);
        }
        for (const block of this._blocks) {
            const result = block.write(address, buffer);
            if (result) {
                return result;
            }
        }
        throw new Error('IntelHex386.write - address or length not appropriate');
    }
    /**
     * Finds the absolute address from a block index and a byte index.
     * @param blockIndex - The index of the block.
     * @param byteIndex - The index of the byte within the block.
     * @returns The absolute address.
     */
    findAbsoluteAddress(blockIndex, byteIndex) {
        return this._blocks[blockIndex].getAbsoluteAddressFromIndex(byteIndex);
    }
    /**
     * Searches for a value in the blocks using a callback function.
     * @param callback - The function to execute for each block. It receives the block's buffer and should return a value if found, or null otherwise.
     * @returns A `FindInBlocksResult` object if the value is found, or null otherwise.
     */
    findInBlocks(callback) {
        for (let b = 0; b < this._blocks.length; b++) {
            const result = callback(this._blocks[b].buffer);
            if (result) {
                return {
                    index: b,
                    address: this._blocks[b].address,
                    result
                };
            }
        }
        return null;
    }
    /**
     * Converts the object to an Intel HEX 386 document string.
     * @returns The Intel HEX 386 document as a string.
     */
    toIntelHex386Document() {
        let intelHex386Document = this.header.join('\r\n');
        for (const block of this._blocks) {
            intelHex386Document += block.getAsIntelHex386ExtendedLinearAddressBlock();
        }
        intelHex386Document += getRecordString(0, IntelHexRecordType.EndOfFile);
        return intelHex386Document;
    }
    /**
     * Converts the data to a single binary Buffer.
     * @returns A Buffer containing the concatenated data from all blocks.
     */
    toBinary() {
        return Buffer.concat(this._blocks.map(b => b.buffer));
    }
    /**
     * Converts the object to its JSON representation.
     * @returns The JSON representation of the object.
     * @private
     */
    toJSON() {
        return {
            header: this.header,
            _blocks: this._blocks
        };
    }
}
