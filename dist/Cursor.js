"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cursor {
    constructor(block, memoryAddress) {
        this.block = block;
        this.startingAddress = memoryAddress;
        this.index = memoryAddress - block.address;
    }
    reset() {
        this.index = (this.startingAddress - this.block.address) >>> 0;
    }
    advanceCursor() {
        if (this.index >= this.block.data.length) {
            throw new Error('Cursor advanced beyond end of the block');
        }
        return this.index++;
    }
    read() {
        console.log('read()', this);
        return this.block.data[this.advanceCursor()];
    }
    readSequentially(length) {
        return Buffer.from(Array.from({ length }, this.read));
    }
    write(byte) {
        this.block.data[this.advanceCursor()] = byte & 0xFF;
    }
    writeSequentially(bytes) {
        for (const byte of bytes) {
            this.write(byte);
        }
    }
}
exports.default = Cursor;
