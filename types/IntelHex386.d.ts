import { BlockToJSON } from "./Block.js";
export interface IntelHex386ToJSON {
    _header: string[];
    _blocks: BlockToJSON[];
}
export interface FindInBlocksResult<T> {
    /** the block index */
    index: number;
    /** starting address of the block */
    address: number;
    /** the result of the callback */
    result: T;
}
export default class IntelHex386 {
    private _header;
    private _blocks;
    constructor(intelHex386: string);
    constructor(intelHex386Json: IntelHex386ToJSON);
    read(address: number | string, length: number): Buffer<ArrayBufferLike>;
    write(address: number | string, buffer: Buffer): boolean;
    /** ## findAbsoluteAddress
     * Method to search for the absolute address from a block index
     * and byte index.
     *
     * Used to get the address from certain
     */
    findAbsoluteAddress(blockIndex: number, byteIndex: number): number;
    findInBlocks<T>(callback: (buffer: Buffer) => (T | null)): FindInBlocksResult<T> | null;
    toIntelHex386Document(): string;
    toBinary(): Buffer;
    private toJSON;
}
