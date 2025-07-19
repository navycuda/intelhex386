import { Block } from "./Block.js";
import parseRecord, { IntelHexRecordType } from "./tools/parseRecord.js";
export default class IntelHex386 {
    _header = [];
    _blocks = [new Block()];
    constructor(intelHex386) {
        if (typeof intelHex386 === 'object') {
            this._header = intelHex386._header;
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
                    this._header.push(line);
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
    toIntelHex386Document() {
        return '';
    }
    toBinary() {
        return Buffer.from([0, 0, 0, 0]);
    }
    toJSON() {
        return {
            _header: this._header,
            _blocks: this._blocks
        };
    }
}
