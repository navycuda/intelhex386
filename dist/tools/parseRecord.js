"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const calculateCheckSum_1 = __importDefault(require("./calculateCheckSum"));
const parseRecord = (intelHexRecord) => {
    const hexLength = intelHexRecord.substring(1, 3);
    const length = parseInt(hexLength, 16);
    const hexAddress = intelHexRecord.substring(3, 7);
    const hexType = intelHexRecord.substring(7, 9);
    const dataLength = length * 2;
    const hexData = intelHexRecord.substring(9, 9 + dataLength).split(/(.{2})/).filter(d => d);
    const hexCheckSum = intelHexRecord.substring(9 + dataLength, 11 + dataLength);
    const address = parseInt(hexAddress, 16);
    const type = parseInt(hexType, 16);
    const data = hexData.map(b => parseInt(b, 16));
    const checkSum = parseInt(hexCheckSum, 16);
    const calculatedCheckSum = (0, calculateCheckSum_1.default)([length, address & 0xFF, (address >> 8) & 0xFF, type, ...data]);
    const record = {
        length,
        get address() {
            return (type === 0x00) ? address : (data[0] << 24 + data[1] << 16) >>> 0;
        },
        type,
        data,
        checkSum
    };
    if (calculatedCheckSum !== checkSum) {
        console.log({
            hexLength,
            hexAddress,
            hexType,
            hexData,
            hexCheckSum
        });
        console.log(record);
        throw new Error(`Bad Checksum ==> , ${intelHexRecord} - ${checkSum}/${calculatedCheckSum}`);
    }
    return record;
};
exports.default = parseRecord;
