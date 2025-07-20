/**
 * Interface for an Intel HEX record object.
 */
export interface IntelHexRecordObject {
    /** The length of the data field in bytes. */
    length: number;
    /** The 16-bit address of the data. */
    address: number;
    /** The record type. */
    type: IntelHexRecordType;
    /** The data bytes. */
    data: number[];
    /** The checksum of the record. */
    checkSum: number;
    /**
     * Gets the extended linear address from the record.
     * @returns The extended linear address, or null if the record is not an Extended Linear Address record.
     */
    getExtendedLinearAddress(): number | null;
}
/**
 * Enumeration of Intel HEX record types.
 */
export declare enum IntelHexRecordType {
    /** Data record. */
    Data = 0,
    /** End of File record. */
    EndOfFile = 1,
    /** Extended Linear Address record. */
    ExtendedLinearAddress = 4
}
/**
 * Parses an Intel HEX record string into an object.
 *
 * @param intelHexRecord - The Intel HEX record string to parse.
 * @returns An `IntelHexRecordObject` representing the parsed record.
 * @example
 * // :020000040800F2
 * // |||||||||||||^^  CheckSum
 * // |||||||||^^^^--  Data
 * // |||||||^^------  Record Type
 * // |||||||            0x00 - Data
 * // |||||||            0x01 - End Of File
 * // |||||||            0x04 - Extended Linear Address
 * // |||^^^^--------  16-bit Address
 * // |^^------------  Length
 * // ^--------------  Intel Hex Record prefix
 */
declare const parseRecord: (intelHexRecord: string) => IntelHexRecordObject;
export default parseRecord;
