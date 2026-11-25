import { IntelHexRecordObject } from "./tools/parseRecord.js";
/**
 * Interface for the JSON representation of a Block.
 */
export interface BlockToJSON {
    /** The starting address of the block, as a hex string. */
    _address: string;
    /** The content of the block, as a base64 string. */
    _buffer: string;
}
/**
 * Represents a contiguous block of data in an Intel HEX file.
 */
export declare class Block {
    #private;
    /**
     * The length of the data in the block.
     */
    get length(): number;
    /**
     * The data buffer of the block.
     */
    get buffer(): Buffer;
    /**
     * The starting address of the block.
     */
    get address(): number;
    /**
     * Creates a new Block instance.
     */
    constructor();
    /**
     * Creates a new Block instance from a JSON object.
     * @param blockJson - The JSON object to create the block from.
     */
    constructor(blockJson: BlockToJSON);
    /**
     * Calculates the absolute address from a byte index within the block.
     * @param {number} byteIndex - The byte index within the block.
     * @returns {number} The absolute address.
     */
    getAbsoluteAddressFromIndex(byteIndex: number): number;
    /**
     * Converts the block to an Intel HEX 386 Extended Linear Address block format.
     * @returns The Intel HEX string representation of the block.
     */
    getAsIntelHex386ExtendedLinearAddressBlock(): string;
    /**
     * Adds a record to the block.
     * @param {IntelHexRecordObject} record - The Intel HEX record to add.
     * @returns True if the record was added successfully, false otherwise.
     */
    addRecord(record: IntelHexRecordObject): boolean;
    /**
     * Reads data from the block.
     * @param {number} address - The starting address to read from.
     * @param {number} length - The number of bytes to read.
     * @returns A Buffer containing the read data, or null if the address is not in the block.
     */
    read(address: number, length: number): Buffer | null;
    /**
     * Writes data to the block.
     * @param {number} address - The starting address to write to.
     * @param {Buffer} buffer - The data to write.
     * @returns {boolean} True if the write was successful, false otherwise.
     */
    write(address: number, buffer: Buffer): boolean;
    /**
     * Converts the block to a JSON object.
     * @returns The JSON representation of the block.
     * @private
     */
    private toJSON;
}
