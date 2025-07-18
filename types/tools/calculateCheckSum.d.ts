import { IntelHexRecordObject } from "./parseRecord.js";
import { SerializedRecord } from "./serializeRecord.js";
/** ## calculateCheckSum
 * Least significant byte two's compliment checksum calculation for the intel
 * hex format.
 */
declare const calculateCheckSum: (record: IntelHexRecordObject | SerializedRecord) => number;
export default calculateCheckSum;
