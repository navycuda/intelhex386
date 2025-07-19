import calculateCheckSum from "./calculateCheckSum.js";
import convert from "./convert.js";
import { IntelHexRecordObject, IntelHexRecordType } from "./parseRecord.js";

type GetRecordStringParams = (
  | { address:number; type: IntelHexRecordType.EndOfFile | IntelHexRecordType.ExtendedLinearAddress }
  | { address:number; type: IntelHexRecordType.Data; data:Buffer }
)


interface GetRecordString{
  (address: number, type: IntelHexRecordType.EndOfFile):string;
  (address: number, type: IntelHexRecordType.ExtendedLinearAddress):string;
  (address: number, type: IntelHexRecordType.Data, data: number[]):string;
}


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

