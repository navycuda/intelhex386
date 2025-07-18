import { IntelHexRecordType } from "./parseRecord";
export interface SerializedRecord {
    length: number;
    address: number;
    type: IntelHexRecordType;
    data?: number[];
    checksum?: number;
}
declare const serializeRecord: (address: number, type: IntelHexRecordType, data?: number[]) => string;
export default serializeRecord;
