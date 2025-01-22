import calculateCheckSum from "./calculateCheckSum";

export interface IntelHexRecordObject{
  length:number;
  address:number;
  type:IntelHexRecordType;
  data:number[];
  checkSum:number;
  getEla():number|null;
}

export enum IntelHexRecordType{
  Data                  = 0x00,
  EndOfFile             = 0x01,
  ExtendedLinearAddress = 0x04
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
const parseRecord = (intelHexRecord:string):IntelHexRecordObject => {
  const hexLength = intelHexRecord.substring(1,3);
  const length = parseInt(hexLength,16);
  const hexAddress = intelHexRecord.substring(3,7);
  const hexType = intelHexRecord.substring(7,9);
  const dataLength = length * 2
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
    getEla(){
      if (this.type !== IntelHexRecordType.ExtendedLinearAddress) { return null; }
      return ((data[0] << 24) + (data[1] << 16)) >>> 0;
    }
  }


  if (calculateCheckSum(record) !== checkSum){
    throw new Error(`Bad Checksum ==> , ${intelHexRecord}`);
  }

  return record;
};

export default parseRecord;