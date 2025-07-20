import { IntelHexRecordObject } from "./parseRecord.js";
import { SerializedRecord } from "./serializeRecord.js";
/**
 * Calculates the checksum for an Intel HEX record.
 * The checksum is the least significant byte of the two's complement of the sum of all bytes in the record.
 * @param record - The Intel HEX record object or serialized record.
 * @returns The calculated checksum.
 */
declare const calculateCheckSum: (record: IntelHexRecordObject | SerializedRecord) => number;
export default calculateCheckSum;
