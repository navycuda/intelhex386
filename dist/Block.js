import getRecordString from "./tools/getRecordString.js";
import { IntelHexRecordType } from "./tools/parseRecord.js";
export class Block {
    _address = 0;
    _tempArray = [];
    _buffer;
    get length() {
        return (this._tempArray
            ? this._tempArray.length
            : this._buffer.length);
    }
    get buffer() {
        return this._buffer;
    }
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
    _buildBuffer() {
        this._buffer = Buffer.from(this._tempArray);
        delete this._tempArray;
    }
    _hasAddress(address) {
        return address >= this._address && address <= (this._address + this.length);
    }
    getAbsoluteAddressFromIndex(byteIndex) {
        return byteIndex + this._address;
    }
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
        } while (getBytesRemaining() > 0);
        return intelHex386Document;
    }
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
    toJSON() {
        return {
            _address: this._address.toString(16).padStart(8, "0"),
            _buffer: this._buffer.toString('base64')
        };
    }
}
