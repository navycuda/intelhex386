import { Block, BlockToJSON } from "./Block.js";
import getRecordString from "./tools/getRecordString.js";
import parseRecord, { IntelHexRecordObject, IntelHexRecordType } from "./tools/parseRecord.js";

/**
 * Interface for the JSON representation of an IntelHex386 object.
 */
export interface IntelHex386ToJSON{
  /** The header lines of the Intel HEX file. */
  _header: string[];
  /** An array of block data. */
  _blocks: BlockToJSON[];
}

/**
 * Interface for the result of a search within the blocks.
 * @template T The type of the result.
 */
export interface FindInBlocksResult<T>{
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
export default class IntelHex386{
  private _header:string[] = [];
  private _blocks:Block[] = [ new Block() ];

  /**
   * Creates a new IntelHex386 instance from an Intel HEX string.
   * @param intelHex386 - The Intel HEX string.
   */
  constructor(intelHex386:string);
  /**
   * Creates a new IntelHex386 instance from a JSON object.
   * @param intelHex386Json - The JSON object.
   */
  constructor(intelHex386Json:IntelHex386ToJSON);
  constructor(intelHex386:IntelHex386ToJSON|string){
    if (typeof intelHex386 === 'object'){
      this._header = intelHex386._header;
      this._blocks = intelHex386._blocks.map(b => new Block(b));
    } else {
      const intelHex386Lines = intelHex386.split(/\r?\n/g);
      const records = [];
  
      for (const line of intelHex386Lines){
        if (line[0] === ":"){
          records.push(parseRecord(line));
        } else {
          this._header.push(line);
        }
      }
  
      const getCurrentBlock = () => this._blocks[this._blocks.length - 1];
      const addBlock = (record:IntelHexRecordObject) => {
        this._blocks.push(new Block());
        getCurrentBlock().addRecord(record);
      }
  
      for (const record of records){
        const addRecord = getCurrentBlock().addRecord(record);
        if (!addRecord && record.type !== IntelHexRecordType.EndOfFile) { addBlock(record); }
      }
    }
  };


  /**
   * Reads data from the specified address.
   * @param address - The address to read from (can be a number or a hex string).
   * @param length - The number of bytes to read.
   * @returns A Buffer containing the data.
   */
  read(address:number|string,length:number){
    if (typeof address === "string"){
      address = parseInt(address,16);
    }
    for (const block of this._blocks){
      const buffer = block.read(address,length);
      if (buffer) { return buffer; }
    }
    throw new Error('IntelHex386.read - address or length not appropriate');
  }

  /**
   * Writes data to the specified address.
   * @param address - The address to write to (can be a number or a hex string).
   * @param buffer - The data to write.
   * @returns True if the write was successful.
   */
  write(address:number|string,buffer:Buffer):boolean{
    if (typeof address === "string"){
      address = parseInt(address,16);
    }
    for (const block of this._blocks){
      const result = block.write(address,buffer);
      if (result) { return result; }
    }
    throw new Error('IntelHex386.write - address or length not appropriate');
  }


  /**
   * Finds the absolute address from a block index and a byte index.
   * @param blockIndex - The index of the block.
   * @param byteIndex - The index of the byte within the block.
   * @returns The absolute address.
   */
  findAbsoluteAddress(blockIndex:number,byteIndex:number):number{
    return this._blocks[blockIndex].getAbsoluteAddressFromIndex(byteIndex);
  }

  /**
   * Searches for a value in the blocks using a callback function.
   * @param callback - The function to execute for each block. It receives the block's buffer and should return a value if found, or null otherwise.
   * @returns A `FindInBlocksResult` object if the value is found, or null otherwise.
   */
  findInBlocks<T>(callback: (buffer:Buffer) => (T | null)): FindInBlocksResult<T> | null {
    for (let b = 0; b < this._blocks.length; b++){
      const result = callback(this._blocks[b].buffer);
      if (result) { 
        return {
          index: b,
          address: this._blocks[b].address,
          result
        }; 
      }
    }
    return null;
  }

  /**
   * Converts the object to an Intel HEX 386 document string.
   * @returns The Intel HEX 386 document as a string.
   */
  toIntelHex386Document():string{
    let intelHex386Document = this._header.join('\r\n');

    for (const block of this._blocks){
      intelHex386Document += block.getAsIntelHex386ExtendedLinearAddressBlock();
    }

    intelHex386Document += getRecordString(0,IntelHexRecordType.EndOfFile);

    return intelHex386Document;
  }

  /**
   * Converts the data to a single binary Buffer.
   * @returns A Buffer containing the concatenated data from all blocks.
   */
  toBinary():Buffer{
    return Buffer.concat(this._blocks.map(b => b.buffer));
  }

  /**
   * Converts the object to its JSON representation.
   * @returns The JSON representation of the object.
   * @private
   */
  private toJSON():IntelHex386ToJSON{
    return {
      _header: this._header,
      _blocks: this._blocks as unknown as BlockToJSON[]
    }
  }
}





