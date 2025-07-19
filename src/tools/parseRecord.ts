import calculateCheckSum from "./calculateCheckSum.js";

/**
 * Interface for an Intel HEX record object.
 */
export interface IntelHexRecordObject{
  /** The length of the data field in bytes. */
  length:number;
  /** The 16-bit address of the data. */
  address:number;
  /** The record type. */
  type:IntelHexRecordType;
  /** The data bytes. */
  data:number[];
  /** The checksum of the record. */
  checkSum:number;
  /**
   * Gets the extended linear address from the record.
   * @returns The extended linear address, or null if the record is not an Extended Linear Address record.
   */
  getExtendedLinearAddress():number|null;
}

/**
 * Enumeration of Intel HEX record types.
 */
export enum IntelHexRecordType{
  /** Data record. */
  Data                  = 0x00,
  /** End of File record. */
  EndOfFile             = 0x01,
  /** Extended Linear Address record. */
  ExtendedLinearAddress = 0x04
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
const parseRecord = (intelHexRecord:string):IntelHexRecordObject => {
  const hexLength = intelHexRecord.substring(1,3);
  const length = parseInt(hexLength,16);
  const hexAddress = intelHexRecord.substring(3,7);
  const hexType = intelHexRecord.substring(7,9);
  const dataLength = length * 2;
  const hexData = intelHexRecord.substring(9,9+dataLength).split(/(.{2})/).filter(d=>d);
  const hexCheckSum = intelHexRecord.substring(9+dataLength, 11+dataLength);
  
  const address = parseInt(hexAddress, 16) >>> 0;
  const type = parseInt(hexType,16);
  const data = hexData.map(b => (parseInt(b,16) & 0xFF))
  const checkSum = parseInt(hexCheckSum,16);

  const record:IntelHexRecordObject = {
    length,
    address,
    type,
    data,
    checkSum,
    getExtendedLinearAddress(){
      if (type !== IntelHexRecordType.ExtendedLinearAddress) { return null; }
      return ((data[0] << 24) + (data[1] << 16)) >>> 0;
    }
  }


  if (calculateCheckSum(record) !== checkSum){
    throw new Error(`Bad Checksum ==> , ${intelHexRecord}`);
  }

  return record;
};

export default parseRecord;