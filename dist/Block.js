import getRecordString from "./tools/getRecordString.js";
import { IntelHexRecordType } from "./tools/parseRecord.js";
/**
 * Represents a contiguous block of data in an Intel HEX file.
 */
export class Block {
    _address = 0;
    _tempArray = [];
    _buffer;
    /**
     * The length of the data in the block.
     */
    get length() {
        return (this._tempArray
            ? this._tempArray.length
            : this._buffer.length);
    }
    /**
     * The data buffer of the block.
     */
    get buffer() {
        return this._buffer;
    }
    /**
     * The starting address of the block.
     */
    get address() {
        return this._address;
    }
    constructor(blockJson) {
        if (blockJson) {
            this._address = parseInt(blockJson._address, 16) >>> 0;
            this._buffer = Buffer.from(blockJson._buffer, 'base64');
            delete this._tempArray;
        }
    }
    /**
     * Converts the temporary array of data into a Buffer.
     * @private
     */
    _buildBuffer() {
        this._buffer = Buffer.from(this._tempArray);
        delete this._tempArray;
    }
    /**
     * Checks if the given address is within the range of this block.
     * @param address - The address to check.
     * @returns True if the address is within the block, false otherwise.
     * @private
     */
    _hasAddress(address) {
        return address >= this._address && address <= (this._address + this.length);
    }
    /**
     * Calculates the absolute address from a byte index within the block.
     * @param byteIndex - The byte index within the block.
     * @returns The absolute address.
     */
    getAbsoluteAddressFromIndex(byteIndex) {
        return byteIndex + this._address;
    }
    /**
     * Converts the block to an Intel HEX 386 Extended Linear Address block format.
     * @returns The Intel HEX string representation of the block.
     */
    getAsIntelHex386ExtendedLinearAddressBlock() {
        if (!this._buffer) {
            throw new Error("Buffer is missing from block, cannot create intelhex386 document");
        }
        let intelHex386Document = '';
        let cursorPosition = 0 >>> 0;
        const getCurrentAddress = () => (this._address + cursorPosition);
        const getBytesRemaining = () => ((this._address + this.length) - getCurrentAddress());
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
                data.push(this._buffer[cursorPosition++]);
            }
            intelHex386Document += getRecordString(currentAddress, IntelHexRecordType.Data, data);
        } while (getBytesRemaining() > 0);
        return intelHex386Document;
    }
    /**
     * Adds a record to the block.
     * @param record - The Intel HEX record to add.
     * @returns True if the record was added successfully, false otherwise.
     */
    addRecord(record) {
        const { address, type, data } = record;
        const currentAddress = () => this._address + this._tempArray.length;
        switch (type) {
            case IntelHexRecordType.Data: {
                if (this._tempArray.length === 0) {
                    this._address += address;
                }
                this._tempArray.push(...data);
                break;
            }
            case IntelHexRecordType.EndOfFile: {
                this._buildBuffer();
                break;
            }
            case IntelHexRecordType.ExtendedLinearAddress: {
                const ela = record.getExtendedLinearAddress();
                if (this.length === 0) {
                    this._address += ela;
                }
                if (ela !== currentAddress()) {
                    this._buildBuffer();
                    return false;
                }
                break;
            }
        }
        return true;
    }
    /**
     * Reads data from the block.
     * @param address - The starting address to read from.
     * @param length - The number of bytes to read.
     * @returns A Buffer containing the read data, or null if the address is not in the block.
     */
    read(address, length) {
        if (!this._hasAddress) {
            return null;
        }
        const start = address - this._address;
        const end = start + length;
        if (end > (this._address + this.length)) {
            throw new Error('Block - Read length exceeds size of buffer');
        }
        return this._buffer.subarray(start, end);
    }
    /**
     * Writes data to the block.
     * @param address - The starting address to write to.
     * @param buffer - The data to write.
     * @returns True if the write was successful, false otherwise.
     */
    write(address, buffer) {
        if (!this._hasAddress) {
            return false;
        }
        const start = address - this._address;
        const end = start + buffer.length;
        if (end > (this._address + this.length)) {
            throw new Error('Block - Read length exceeds size of buffer');
        }
        buffer.copy(this._buffer, start);
        return true;
    }
    /**
     * Converts the block to a JSON object.
     * @returns The JSON representation of the block.
     * @private
     */
    toJSON() {
        return {
            _address: this._address.toString(16).padStart(8, "0"),
            _buffer: this._buffer.toString('base64')
        };
    }
}
