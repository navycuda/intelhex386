import { BlockToJSON } from "./Block.js";
export interface IntelHex386ToJSON {
    _header: string[];
    _blocks: BlockToJSON[];
}
export interface FindInBlocksResult<T> {
    index: number;
    address: number;
    result: T;
}
export default class IntelHex386 {
    private _header;
    private _blocks;
    constructor(intelHex386: string);
    constructor(intelHex386Json: IntelHex386ToJSON);
    read(address: number | string, length: number): Buffer<ArrayBufferLike>;
    write(address: number | string, buffer: Buffer): boolean;
    findInBlocks<T>(callback: (buffer: Buffer) => (T | null)): FindInBlocksResult<T> | null;
    toIntelHex386Document(): string;
    toBinary(): Buffer;
    private toJSON;
}
