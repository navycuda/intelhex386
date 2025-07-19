import calculateCheckSum from "./calculateCheckSum.js";
import { IntelHexRecordType } from "./parseRecord.js";

/**
 * Interface for a serialized Intel HEX record.
 */
export interface SerializedRecord{
  /** The length of the data field in bytes. */
  length:number;
  /** The 16-bit address of the data. */
  address:number;
  /** The record type. */
  type:IntelHexRecordType;
  /** The data bytes. */
  data?:number[];
  /** The checksum of the record. */
  checksum?:number;
}

/**
 * Serializes an Intel HEX record into a string.
 * @param address - The address for the record.
 * @param type - The type of the record.
 * @param data - The data for the record.
 * @returns The serialized Intel HEX record string.
 */
const serializeRecord = (address:number,type:IntelHexRecordType,data:number[] = []) => {
  const record:SerializedRecord = {
    length: type === IntelHexRecordType.ExtendedLinearAddress ? 2 : data.length,
    address: type === IntelHexRecordType.ExtendedLinearAddress ? 0 : address & 0xFFFF,
    type,
    data: type === IntelHexRecordType.ExtendedLinearAddress ? function(){
      const ela = address >> 16;
      return [
        (ela >> 8) & 0xFF,
        ela & 0xFF
      ];
    }() : data
  }
  record.checksum = calculateCheckSum(record);

  const l = getHexFromUInt(record.length,1);
  const a = getHexFromUInt(record.address,2);
  const t = getHexFromUInt(record.type,1);
  const d = record.data!.reduce((a,c) => a += getHexFromUInt(c,1),"");
  const c = getHexFromUInt(record.checksum, 1);

  return `:${l}${a}${t}${d}${c}\r\n`;
}

export default serializeRecord;

/**
 * Converts an unsigned integer to a hexadecimal string.
 * @param value - The value to convert.
 * @param length - The desired length of the hexadecimal string in bytes.
 * @returns The hexadecimal string.
 */
const getHexFromUInt = (value:number, length:number) => {
  const bits = length * 2;
  return value.toString(16).padStart(bits,'0').toUpperCase();
}