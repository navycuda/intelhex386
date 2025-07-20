import { IntelHexRecordType } from "./parseRecord.js";
/**
 * Interface for the `getRecordString` function.
 */
interface GetRecordString {
    /**
     * Generates an End of File record string.
     * @param address - The address (should be 0).
     * @param type - The record type (EndOfFile).
     * @returns The Intel HEX record string.
     */
    (address: number, type: IntelHexRecordType.EndOfFile): string;
    /**
     * Generates an Extended Linear Address record string.
     * @param address - The address.
     * @param type - The record type (ExtendedLinearAddress).
     * @returns The Intel HEX record string.
     */
    (address: number, type: IntelHexRecordType.ExtendedLinearAddress): string;
    /**
     * Generates a Data record string.
     * @param address - The address.
     * @param type - The record type (Data).
     * @param data - The data to include in the record.
     * @returns The Intel HEX record string.
     */
    (address: number, type: IntelHexRecordType.Data, data: number[]): string;
}
/**
 * Generates an Intel HEX record string from the given parameters.
 * @param address - The address for the record.
 * @param type - The type of the record.
   * @param data - The data for the record (for Data records).
 * @returns The formatted Intel HEX record string.
 */
declare const getRecordString: GetRecordString;
export default getRecordString;
