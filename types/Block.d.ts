import { IntelHexRecordObject } from "./tools/parseRecord.js";
export interface BlockToJSON {
    _address: string;
    _buffer: string;
}
export declare class Block {
    private _address;
    private _tempArray;
    private _buffer;
    get length(): number;
    constructor();
    constructor(blockJson: BlockToJSON);
    private _buildBuffer;
    private _hasAddress;
    addRecord(record: IntelHexRecordObject): boolean;
    read(address: number, length: number): Buffer | null;
    write(address: number, buffer: Buffer): boolean;
    private toJSON;
}
