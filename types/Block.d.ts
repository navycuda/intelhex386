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
    private _address;
    private _tempArray;
    private _buffer;
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
     * Converts the temporary array of data into a Buffer.
     * @private
     */
    private _buildBuffer;
    /**
     * Checks if the given address is within the range of this block.
     * @param address - The address to check.
     * @returns True if the address is within the block, false otherwise.
     * @private
     */
    private _hasAddress;
    /**
     * Calculates the absolute address from a byte index within the block.
     * @param byteIndex - The byte index within the block.
     * @returns The absolute address.
     */
    getAbsoluteAddressFromIndex(byteIndex: number): number;
    /**
     * Converts the block to an Intel HEX 386 Extended Linear Address block format.
     * @returns The Intel HEX string representation of the block.
     */
    getAsIntelHex386ExtendedLinearAddressBlock(): string;
    /**
     * Adds a record to the block.
     * @param record - The Intel HEX record to add.
     * @returns True if the record was added successfully, false otherwise.
     */
    addRecord(record: IntelHexRecordObject): boolean;
    /**
     * Reads data from the block.
     * @param address - The starting address to read from.
     * @param length - The number of bytes to read.
     * @returns A Buffer containing the read data, or null if the address is not in the block.
     */
    read(address: number, length: number): Buffer | null;
    /**
     * Writes data to the block.
     * @param address - The starting address to write to.
     * @param buffer - The data to write.
     * @returns True if the write was successful, false otherwise.
     */
    write(address: number, buffer: Buffer): boolean;
    /**
     * Converts the block to a JSON object.
     * @returns The JSON representation of the block.
     * @private
     */
    private toJSON;
}
