"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelHexRecordType = void 0;
const calculateCheckSum_1 = __importDefault(require("./calculateCheckSum"));
var IntelHexRecordType;
(function (IntelHexRecordType) {
    IntelHexRecordType[IntelHexRecordType["Data"] = 0] = "Data";
    IntelHexRecordType[IntelHexRecordType["EndOfFile"] = 1] = "EndOfFile";
    IntelHexRecordType[IntelHexRecordType["ExtendedLinearAddress"] = 4] = "ExtendedLinearAddress";
})(IntelHexRecordType || (exports.IntelHexRecordType = IntelHexRecordType = {}));
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
const parseRecord = (intelHexRecord) => {
    const hexLength = intelHexRecord.substring(1, 3);
    const length = parseInt(hexLength, 16);
    const hexAddress = intelHexRecord.substring(3, 7);
    const hexType = intelHexRecord.substring(7, 9);
    const dataLength = length * 2;
    const hexData = intelHexRecord.substring(9, 9 + dataLength).split(/(.{2})/).filter(d => d);
    const hexCheckSum = intelHexRecord.substring(9 + dataLength, 11 + dataLength);
    const address = parseInt(hexAddress, 16) >>> 0;
    const type = parseInt(hexType, 16);
    const data = hexData.map(b => (parseInt(b, 16) & 0xFF));
    const checkSum = parseInt(hexCheckSum, 16);
    const record = {
        length,
        address,
        type,
        data,
        checkSum,
        getEla() {
            if (this.type !== IntelHexRecordType.ExtendedLinearAddress) {
                return null;
            }
            return ((data[0] << 24) + (data[1] << 16)) >>> 0;
        }
    };
    if ((0, calculateCheckSum_1.default)(record) !== checkSum) {
        throw new Error(`Bad Checksum ==> , ${intelHexRecord}`);
    }
    return record;
};
exports.default = parseRecord;
