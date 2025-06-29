import { IntelHexRecordObject, IntelHexRecordType } from "./tools/parseRecord";
import serializeRecord from "./tools/serializeRecord";

export interface BlockDataChangeObject{
  address: number;
  data: Buffer;
}
export interface BlockJsonObject{
  address: number;
  data: string;
  changes: BlockDataChangeObject[];
};
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

  /** ### AddRecord
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

    const finishBlock = () => {
      this.data = Buffer.from(this._tempData!);
      delete this._tempData;
    }

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
        finishBlock();
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
          finishBlock();
          return false;
        }
        break;
      }
    }

    return true;
  } // AddRecord
  /** ## ContainsAddress
   * Method to check if the block constains an address and if the data
   * length from that address is within the block.  No read can extend
   * beyond the end of a memory block
   */
  containsAddress(memoryAddress:number,length:number):boolean{
    const endAddress = (this.address + this.data!.length) >>> 0;
    const remaining = endAddress - memoryAddress;
    if (length > remaining) { 
      throw new Error('Requested Data length exceeds available bytes in block'); 
    }
    const hasAddress = this.address <= memoryAddress && endAddress >= memoryAddress;
    return hasAddress;
  }
  /** ### SerializeAs
   * Used to manage serialization of the block into JSON, IntelHex or binary
   */
  get serializeAs() {
    const block = this;
    return {
      binary():Buffer{ return block.data!; },
      intelHex386(){ return serializeAsIntelHex(block); },
      jsonObject(){ return serializeAsJsonObject(block); }
    }
  }
}

const serializeAsIntelHex = (block:Block) => {
  let blockRecords = "";
  let cursorPosition = 0 >>> 0;
  const endAddress = (block.address + block.data!.length) >>> 0;

  const getCurrentAddress = () => (block.address + cursorPosition);
  const getBytesRemaining = () => (endAddress - getCurrentAddress());

  do {
    const currentAddress = getCurrentAddress();
    const bytesRemaining = getBytesRemaining();

    if (!blockRecords){
      blockRecords += serializeRecord(currentAddress,IntelHexRecordType.ExtendedLinearAddress);
    } else if (currentAddress % 0x1000 === 0){ // Handle extra linear address setps
      blockRecords += serializeRecord(currentAddress,IntelHexRecordType.ExtendedLinearAddress);
    }

    const length = bytesRemaining >= 0x20 ? 0x20 : bytesRemaining;
    const data = [];

    for (let i = 0; i < length; i++){
      data.push(block.data![cursorPosition++]);
    }

    blockRecords += serializeRecord(currentAddress,IntelHexRecordType.Data,data);
  } while (getBytesRemaining() > 0);

  return blockRecords;
}

const serializeAsJsonObject = (block:Block):BlockJsonObject => {
  return {
    address: block.address!,
    data: block.data?.toString('base64') || "no data"
  };
}