import { IntelHexRecordObject, IntelHexRecordType } from "./tools/parseRecord";

export default class Block{
  data:undefined|Buffer;
  address:undefined|number;
  private _tempData:undefined|number[];

  constructor();
  constructor(blockJsonObject:BlockJsonObject);
  constructor(blockJsonObject?:BlockJsonObject){
    if (blockJsonObject){
      this.address = blockJsonObject.address;
      this.data = Buffer.from(blockJsonObject.data, 'base64');
    }
  }

  /** ### Block.addRecord(record)
   * Method to add a record to the block.  Part of the Intel Hex 386 instantiation process.
   * 
   * Returns true as long as the block can accept a new record.  It returns false if the provided
   * record cannot be added sequentially to the block.
   */
  addRecord(record:IntelHexRecordObject):boolean{
    // if we find that the record to be added cannot be added to this block
    // we need to return false.  However we also must finish the instantiation
    // of this block.

    // If the address hasn't been set, this is the first record.
    if (this.address === undefined){
      // If the first record is not an extended linear address the block cannot be properly
      // instantiated and must throw an error
      if (record.type !== IntelHexRecordType.ExtendedLinearAddress){
        throw new Error('Tried to instantiate a block without providing an extended linear address first');
      }
      this.address = record.getEla();
      console.log(this);
      return true;
    }
    

    // If _tempData is still undefined, the address from the first data record must be
    // added to the block address to set the actual starting address of the block
    if (!this._tempData){
      this.address += record.address;
      this._tempData = [];
    }

    const length = this._tempData.length;
    const currentAddress = this.address + length;
    const recordAbsoluteAddress = (this.address & 0xFFFF0000) + record.address;

    // Check to see if the supplied record is sequential with this block
    // If it isn't, then finalize the instantiation of the block and return false.
    if (currentAddress !== recordAbsoluteAddress){
      this.data = Buffer.from(this._tempData as number[]);
      delete this._tempData;
      return false;
    }

    // Add the data to the temporary data storage.
    if (record.type === IntelHexRecordType.Data){
      for (const b of record.data){
        this._tempData.push(b & 0xFF);
      }
    }

    return true;
  }



  get serializeAs() {
    const block = this;
    return {
      intelHex386(){ return serializeAsIntelHex(block); },
      json(){ return serializeAsJson(block); }
    }
  }
}

const serializeAsIntelHex = (block:Block) => {
  const maximumRecordLength = 32; // The maximum length of the intel hex record
  let remaining = block.data!.length >>> 0;
  let serializedIntelHexData = '';

  while (remaining > 0) {

    // Create the first extended linear address

    // Create additional extended linear addresses as needed

    // Add the data records

  }

  return serializedIntelHexData;
}

export interface BlockJsonObject{
  address: number;
  data: string;
}

const serializeAsJson = (block:Block,pretty:boolean = false):string => {
  const newBlock = {
    address: block.address,
    data: block.data!.toString('base64')
  };
  return !pretty ? JSON.stringify(newBlock) : JSON.stringify(newBlock,null,2);
}