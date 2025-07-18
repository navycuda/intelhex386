import calculateCheckSum from "./calculateCheckSum";
import { IntelHexRecordType } from "./parseRecord";
const serializeRecord = (address, type, data = []) => {
    const record = {
        length: type === IntelHexRecordType.ExtendedLinearAddress ? 2 : data.length,
        address: type === IntelHexRecordType.ExtendedLinearAddress ? 0 : address & 0xFFFF,
        type,
        data: type === IntelHexRecordType.ExtendedLinearAddress ? function () {
            const ela = address >> 16;
            return [
                (ela >> 8) & 0xFF,
                ela & 0xFF
            ];
        }() : data
    };
    record.checksum = calculateCheckSum(record);
    const l = getHexFromUInt(record.length, 1);
    const a = getHexFromUInt(record.address, 2);
    const t = getHexFromUInt(record.type, 1);
    const d = record.data.reduce((a, c) => a += getHexFromUInt(c, 1), "");
    const c = getHexFromUInt(record.checksum, 1);
    return `:${l}${a}${t}${d}${c}\r\n`;
};
export default serializeRecord;
const getHexFromUInt = (value, length) => {
    const bits = length * 2;
    return value.toString(16).padStart(bits, '0').toUpperCase();
};
