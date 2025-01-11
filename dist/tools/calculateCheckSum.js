"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** ## calculateCheckSum
 * Least significant byte two's compliment checksum calculation for the intel
 * hex format.
 */
const calculateCheckSum = (record) => {
    const values = [
        record.length,
        record.address & 0xFF,
        (record.address >> 8) & 0xFF,
        record.type,
        ...record.data
    ];
    const sum = values.reduce((a, c) => (a + c), 0);
    return ((~sum + 1) & 0xFF);
};
exports.default = calculateCheckSum;
