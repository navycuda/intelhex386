import calculateCheckSum from "./calculateCheckSum.js";
import convert from "./convert.js";
import { IntelHexRecordObject, IntelHexRecordType } from "./parseRecord.js";

/**
 * Type definition for the parameters of `getRecordString`.
 */
type GetRecordStringParams = (
  | { address:number; type: IntelHexRecordType.EndOfFile | IntelHexRecordType.ExtendedLinearAddress }
  | { address:number; type: IntelHexRecordType.Data; data:Buffer }
)

/**
 * Interface for the `getRecordString` function.
 */
interface GetRecordString{
  /**
   * Generates an End of File record string.
   * @param address - The address (should be 0).
   * @param type - The record type (EndOfFile).
   * @returns The Intel HEX record string.
   */
  (address: number, type: IntelHexRecordType.EndOfFile):string;
  /**
   * Generates an Extended Linear Address record string.
   * @param address - The address.
   * @param type - The record type (ExtendedLinearAddress).
   * @returns The Intel HEX record string.
   */
  (address: number, type: IntelHexRecordType.ExtendedLinearAddress):string;
  /**
   * Generates a Data record string.
   * @param address - The address.
   * @param type - The record type (Data).
   * @param data - The data to include in the record.
   * @returns The Intel HEX record string.
   */
  (address: number, type: IntelHexRecordType.Data, data: number[]):string;
}

/**
 * Generates an Intel HEX record string from the given parameters.
 * @param address - The address for the record.
 * @param type - The type of the record.
   * @param data - The data for the record (for Data records).
 * @returns The formatted Intel HEX record string.
 */
const getRecordString:GetRecordString = (address,type,data?:number[]):string => {
  if (type === IntelHexRecordType.EndOfFile) { return ":00000001FF"; }
  
  const isEla = type === IntelHexRecordType.ExtendedLinearAddress;

  const record:Omit<IntelHexRecordObject, "getExtendedLinearAddress"> = {
    length:   isEla ? 2 : (data ? data.length : 0),
    address:  isEla ? 0 : address & 0xFFFF,
    type:     type,
    data:     isEla ? function(){
      const ela = address >> 16;
      return [
        (ela >> 8) & 0xFF,
        (ela) & 0xFF
      ];
    }() : (data ? data : []),
    checkSum: 0
  }
  record.checkSum = calculateCheckSum(record);

  const { fromUIntToHex } = convert;
  const l = fromUIntToHex(record.length,1);
  const a = fromUIntToHex(record.address,2);
  const t = fromUIntToHex(record.type,1);
  const d = record.data.reduce((a,c) => a+= fromUIntToHex(c,1), '');
  const c = fromUIntToHex(record.checkSum,1);

  return `:${l}${a}${t}${d}${c}\r\n`;
}

export default getRecordString;

