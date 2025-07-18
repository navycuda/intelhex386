import { BlockToJSON } from "./Block.js";
export interface IntelHex386ToJSON {
    _header: string[];
    _blocks: BlockToJSON[];
}
export default class IntelHex386 {
    private _header;
    private _blocks;
    constructor(intelHex386: string);
    constructor(intelHex386Json: IntelHex386ToJSON);
    read(address: number | string, length: number): Buffer<ArrayBufferLike>;
    write(address: number | string, buffer: Buffer): boolean;
    private toJSON;
}
