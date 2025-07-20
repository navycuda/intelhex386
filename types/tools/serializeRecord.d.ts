import { IntelHexRecordType } from "./parseRecord.js";
/**
 * Interface for a serialized Intel HEX record.
 */
export interface SerializedRecord {
    /** The length of the data field in bytes. */
    length: number;
    /** The 16-bit address of the data. */
    address: number;
    /** The record type. */
    type: IntelHexRecordType;
    /** The data bytes. */
    data?: number[];
    /** The checksum of the record. */
    checksum?: number;
}
/**
 * Serializes an Intel HEX record into a string.
 * @param address - The address for the record.
 * @param type - The type of the record.
 * @param data - The data for the record.
 * @returns The serialized Intel HEX record string.
 */
declare const serializeRecord: (address: number, type: IntelHexRecordType, data?: number[]) => string;
export default serializeRecord;
