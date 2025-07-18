import { Block, BlockToJSON } from "./Block.js";
import parseRecord, { IntelHexRecordObject, IntelHexRecordType } from "./tools/parseRecord.js";



export interface IntelHex386ToJSON{
  _header: string[];
  _blocks: BlockToJSON[];
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


  private toJSON():IntelHex386ToJSON{
    return {
      _header: this._header,
      _blocks: this._blocks as unknown as BlockToJSON[]
    }
  }
}





