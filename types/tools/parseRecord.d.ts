export interface IntelHexRecordObject {
    length: number;
    address: number;
    type: IntelHexRecordType;
    data: number[];
    checkSum: number;
    getExtendedLinearAddress(): number | null;
}
export declare enum IntelHexRecordType {
    Data = 0,
    EndOfFile = 1,
    ExtendedLinearAddress = 4
}
/** ## parseRecord
 * Takes the intel hex record and parses it into an object for use in the program
 *
 * @example
 * :020000040800F2
 * |||||||||||||^^  CheckSum
 * |||||||||^^^^--  Data
 * |||||||^^------  Record Type
 * |||||||            0x00 - Data
 * |||||||            0x01 - End Of File
 * |||||||            0x04 - Extended Linear Address
 * |||^^^^--------  16-bit Address
 * |^^------------  Length
 * ^--------------  Intel Hex Record prefix
 */
declare const parseRecord: (intelHexRecord: string) => IntelHexRecordObject;
export default parseRecord;
