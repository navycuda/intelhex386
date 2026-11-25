import getRecordString from "./tools/getRecordString.js";
import { IntelHexRecordType } from "./tools/parseRecord.js";
/**
 * Represents a contiguous block of data in an Intel HEX file.
 */
export class Block {
    #address = 0;
    #tempArray = [];
    #buffer;
    /**
     * The length of the data in the block.
     */
    get length() {
        return (this.#tempArray
            ? this.#tempArray.length
            : this.#buffer.length);
    }
    /**
     * The data buffer of the block.
     */
    get buffer() {
        return this.#buffer;
    }
    /**
     * The starting address of the block.
     */
    get address() {
        return this.#address;
    }
    constructor(blockJson) {
        if (blockJson) {
            this.#address = parseInt(blockJson._address, 16) >>> 0;
            this.#buffer = Buffer.from(blockJson._buffer, 'base64');
            this.#tempArray.length = 0;
        }
    }
    /**
     * Converts the temporary array of data into a Buffer.
     * @private
     */
    #buildBuffer() {
        this.#buffer = Buffer.from(this.#tempArray);
        this.#tempArray.length = 0;
    }
    /**
     * Checks if the given address is within the range of this block.
     * @param {number} address - The address to check.
     * @param {number} length - The data length to check.
     * @returns {number} True if the address is within the block, false otherwise.
     */
    #hasAddress(address, length) {
        const a = address >>> 0;
        const l = (address + length) >>> 0;
        const hasAddress = a >= this.#address && a <= (this.#address + this.length);
        const hasEndAddress = l >= this.#address && l <= (this.#address + this.length);
        return (hasAddress && hasEndAddress);
    }
    /**
     * Calculates the absolute address from a byte index within the block.
     * @param {number} byteIndex - The byte index within the block.
     * @returns {number} The absolute address.
     */
    getAbsoluteAddressFromIndex(byteIndex) {
        return (byteIndex + this.#address) >>> 0;
    }
    /**
     * Converts the block to an Intel HEX 386 Extended Linear Address block format.
     * @returns The Intel HEX string representation of the block.
     */
    getAsIntelHex386ExtendedLinearAddressBlock() {
        if (!this.#buffer) {
            throw new Error("Buffer is missing from block, cannot create intelhex386 document");
        }
        let intelHex386Document = '';
        let cursorPosition = 0 >>> 0;
        const getCurrentAddress = () => (this.#address + cursorPosition) >>> 0;
        const getBytesRemaining = () => ((this.#address + this.length) - getCurrentAddress()) >>> 0;
        let firstPass = true;
        do {
            const currentAddress = getCurrentAddress();
            const bytesRemaining = getBytesRemaining();
            if (firstPass) {
                intelHex386Document += getRecordString(currentAddress, IntelHexRecordType.ExtendedLinearAddress);
                firstPass = false;
            }
            else if (currentAddress % 0x10000 === 0) {
                intelHex386Document += getRecordString(currentAddress, IntelHexRecordType.ExtendedLinearAddress);
            }
            const length = bytesRemaining >= 0x20 ? 0x20 : bytesRemaining;
            const data = [];
            for (let d = 0; d < length; d++) {
                data.push(this.#buffer[cursorPosition++]);
            }
            intelHex386Document += getRecordString(currentAddress, IntelHexRecordType.Data, data);
        } while (getBytesRemaining() > 0);
        return intelHex386Document;
    }
    /**
     * Adds a record to the block.
     * @param {IntelHexRecordObject} record - The Intel HEX record to add.
     * @returns True if the record was added successfully, false otherwise.
     */
    addRecord(record) {
        const { address, type, data } = record;
        const currentAddress = () => this.#address + this.#tempArray.length;
        switch (type) {
            case IntelHexRecordType.Data: {
                if (this.#tempArray.length === 0) {
                    this.#address += address;
                }
                this.#tempArray.push(...data);
                break;
            }
            case IntelHexRecordType.EndOfFile: {
                this.#buildBuffer();
                break;
            }
            case IntelHexRecordType.ExtendedLinearAddress: {
                const ela = record.getExtendedLinearAddress();
                if (this.length === 0) {
                    this.#address += ela;
                }
                if (ela !== currentAddress()) {
                    this.#buildBuffer();
                    return false;
                }
                break;
            }
        }
        return true;
    }
    /**
     * Reads data from the block.
     * @param {number} address - The starting address to read from.
     * @param {number} length - The number of bytes to read.
     * @returns A Buffer containing the read data, or null if the address is not in the block.
     */
    read(address, length) {
        if (!this.#hasAddress(address, length)) {
            return null;
        }
        const start = address - this.#address;
        const end = start + length;
        return this.#buffer.subarray(start, end);
    }
    /**
     * Writes data to the block.
     * @param {number} address - The starting address to write to.
     * @param {Buffer} buffer - The data to write.
     * @returns {boolean} True if the write was successful, false otherwise.
     */
    write(address, buffer) {
        if (!this.#hasAddress(address, buffer.length)) {
            return false;
        }
        const start = address - this.#address;
        const end = start + buffer.length;
        buffer.copy(this.#buffer, start);
        return true;
    }
    /**
     * Converts the block to a JSON object.
     * @returns The JSON representation of the block.
     * @private
     */
    toJSON() {
        return {
            _address: this.#address.toString(16).padStart(8, "0"),
            _buffer: this.#buffer.toString('base64')
        };
    }
}
