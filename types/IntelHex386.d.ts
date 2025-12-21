import { BlockToJSON } from "./Block.js";
/**
 * Interface for the JSON representation of an IntelHex386 object.
 */
export interface IntelHex386ToJSON {
    /** The header lines of the Intel HEX file. */
    header: string[];
    /** An array of block data. */
    _blocks: BlockToJSON[];
}
/**
 * Interface for the result of a search within the blocks.
 * @template T The type of the result.
 */
export interface FindInBlocksResult<T> {
    /** The block index. */
    index: number;
    /** The starting address of the block. */
    address: number;
    /** The result of the callback. */
    result: T;
}
/**
 * Represents an Intel HEX 386 file.
 */
export default class IntelHex386 {
    header: string[];
    private _blocks;
    /**
     * Creates a new IntelHex386 instance from an Intel HEX string.
     * @param intelHex386 - The Intel HEX string.
     */
    constructor(intelHex386: string);
    /**
     * Creates a new IntelHex386 instance from a JSON object.
     * @param intelHex386Json - The JSON object.
     */
    constructor(intelHex386Json: IntelHex386ToJSON);
    /**
     * Reads data from the specified address.
     * @param address - The address to read from (can be a number or a hex string).
     * @param length - The number of bytes to read.
     * @returns A Buffer containing the data.
     */
    read(address: number | string, length: number): Buffer<ArrayBufferLike>;
    /**
     * Writes data to the specified address.
     * @param address - The address to write to (can be a number or a hex string).
     * @param buffer - The data to write.
     * @returns True if the write was successful.
     */
    write(address: number | string, buffer: Buffer): boolean;
    /**
     * Finds the absolute address from a block index and a byte index.
     * @param blockIndex - The index of the block.
     * @param byteIndex - The index of the byte within the block.
     * @returns The absolute address.
     */
    findAbsoluteAddress(blockIndex: number, byteIndex: number): number;
    /**
     * Searches for a value in the blocks using a callback function.
     * @param callback - The function to execute for each block. It receives the block's buffer and should return a value if found, or null otherwise.
     * @returns A `FindInBlocksResult` object if the value is found, or null otherwise.
     */
    findInBlocks<T>(callback: (buffer: Buffer) => (T | null)): FindInBlocksResult<T> | null;
    /**
     * Converts the object to an Intel HEX 386 document string.
     * @returns The Intel HEX 386 document as a string.
     */
    toIntelHex386Document(): string;
    /**
     * Converts the data to a single binary Buffer.
     * @returns A Buffer containing the concatenated data from all blocks.
     */
    toBinary(): Buffer;
    /**
     * Converts the object to its JSON representation.
     * @returns The JSON representation of the object.
     * @private
     */
    private toJSON;
}
