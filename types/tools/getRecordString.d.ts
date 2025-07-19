import { IntelHexRecordType } from "./parseRecord.js";
interface GetRecordString {
    (address: number, type: IntelHexRecordType.EndOfFile): string;
    (address: number, type: IntelHexRecordType.ExtendedLinearAddress): string;
    (address: number, type: IntelHexRecordType.Data, data: number[]): string;
}
declare const getRecordString: GetRecordString;
export default getRecordString;
