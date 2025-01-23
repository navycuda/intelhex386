import { IntelHexRecordObject, IntelHexRecordType } from "./tools/parseRecord";

export default class Block{
  data:undefined|Buffer;
  address:number;
  private _tempData:undefined|number[];

  constructor();
  constructor(blockJsonObject:BlockJsonObject);
  constructor(blockJsonObject?:BlockJsonObject){
    this.address = 0 >>> 0;
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


    // Another, possibily unneeded sanity check
    if (this.data && !this._tempData){
      throw new Error('This block is already complete.  Cannot add new record.');
    }

    // Setup the record for use
    const { length, address, type, data, getExtendedLinearAddress } = record;
    const currentAddress = () => this.address + this._tempData!.length;

    switch (type){
      case IntelHexRecordType.Data:{
        if (this._tempData!.length === 0){
          this.address! += address;
        }
        for (const byte of data){
          this._tempData!.push(byte);
        }
        break;
      }
      case IntelHexRecordType.EndOfFile:{
        break;
      }
      case IntelHexRecordType.ExtendedLinearAddress:{
        const ela = getExtendedLinearAddress();
        // If this is the first pass, initialize the tempData storage
        if (!this.data && !this._tempData){
          this._tempData = [];
          this.address += ela!;
        }
        if (ela !== currentAddress()) {
          this.data = Buffer.from(this._tempData!);
          delete this._tempData;
          return false;
        }
        break;
      }
    }

    return true;
  } // AddRecord



  get serializeAs() {
    const block = this;
    return {
      intelHex386(){ return serializeAsIntelHex(block); },
      jsonObject(){ return serializeAsJsonObject(block); }
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

const serializeAsJsonObject = (block:Block,pretty:boolean = false):BlockJsonObject => {
  return {
    address: block.address!,
    data: block.data?.toString('base64') || "no data"
  };
}