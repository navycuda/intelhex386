/**
 * Calculates the checksum for an Intel HEX record.
 * The checksum is the least significant byte of the two's complement of the sum of all bytes in the record.
 * @param record - The Intel HEX record object or serialized record.
 * @returns The calculated checksum.
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
export default calculateCheckSum;
