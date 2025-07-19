import { Block, BlockToJSON } from "./Block.js";
import getRecordString from "./tools/getRecordString.js";
import parseRecord, { IntelHexRecordObject, IntelHexRecordType } from "./tools/parseRecord.js";



export interface IntelHex386ToJSON{
  _header: string[];
  _blocks: BlockToJSON[];
}

export interface FindInBlocksResult<T>{
  /** the block index */
  index: number;
  /** starting address of the block */
  address: number;
  /** the result of the callback */
  result: T;
}


export default class IntelHex386{
  private _header:string[] = [];
  private _blocks:Block[] = [ new Block() ];


  constructor(intelHex386:string);
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


  /** ## findAbsoluteAddress
   * Method to search for the absolute address from a block index
   * and byte index.
   * 
   * Used to get the address from certain 
   */
  findAbsoluteAddress(blockIndex:number,byteIndex:number):number{
    return this._blocks[blockIndex].getAbsoluteAddressFromIndex(byteIndex);
  }


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


  toIntelHex386Document():string{
    let intelHex386Document = this._header.join('\r\n');

    for (const block of this._blocks){
      intelHex386Document += block.getAsIntelHex386ExtendedLinearAddressBlock();
    }

    intelHex386Document += getRecordString(0,IntelHexRecordType.EndOfFile);

    return intelHex386Document;
  }
  toBinary():Buffer{
    return Buffer.concat(this._blocks.map(b => b.buffer));
  }


  private toJSON():IntelHex386ToJSON{
    return {
      _header: this._header,
      _blocks: this._blocks as unknown as BlockToJSON[]
    }
  }
}





