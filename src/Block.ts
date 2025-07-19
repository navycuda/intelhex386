import getRecordString from "./tools/getRecordString.js";
import { IntelHexRecordObject, IntelHexRecordType } from "./tools/parseRecord.js";

export interface BlockToJSON {
  _address: string;
  _buffer: string;
}

export class Block {
  private _address: number = 0;
  private _tempArray: number[] | undefined = [];
  private _buffer: Buffer | undefined;


  get length(): number {
    return (this._tempArray
      ? this._tempArray.length
      : this._buffer!.length
    );
  }
  get buffer():Buffer{
    return this._buffer!;
  }
  get address():number{
    return this._address;
  }


  constructor();
  constructor(blockJson: BlockToJSON);
  constructor(blockJson?: BlockToJSON) {
    if (blockJson) {
      this._address = parseInt(blockJson._address, 16) >>> 0;
      this._buffer = Buffer.from(blockJson._buffer, 'base64');

      delete this._tempArray;
    }
  }


  private _buildBuffer(): void {
    this._buffer = Buffer.from(this._tempArray!);
    delete this._tempArray;
  }
  private _hasAddress(address:number):boolean{
    return address >= this._address && address <= (this._address + this.length);
  }


  getAbsoluteAddressFromIndex(byteIndex:number):number{
    return byteIndex + this._address;
  }
  getAsIntelHex386ExtendedLinearAddressBlock(){
    if (!this._buffer) { throw new Error ("Buffer is missing from block, cannot create intelhex386 document"); }
    let intelHex386Document = '';
    let cursorPosition = 0 >>> 0;

    const getCurrentAddress = () => (this._address + cursorPosition);
    const getBytesRemaining = () => ((this._address + this.length) - getCurrentAddress());

    let firstPass = true;

    do{
      const currentAddress = getCurrentAddress();
      const bytesRemaining = getBytesRemaining();

      if (firstPass){
        intelHex386Document += getRecordString(currentAddress,IntelHexRecordType.ExtendedLinearAddress);
        firstPass = false;
      } else if (currentAddress % 0x10000 === 0){
        intelHex386Document += getRecordString(currentAddress,IntelHexRecordType.ExtendedLinearAddress);
      }

      const length = bytesRemaining >= 0x20 ? 0x20 : bytesRemaining;
      const data = [];

      for (let d = 0; d < length; d++){
        data.push(this._buffer[cursorPosition++]);
      }

    } while (getBytesRemaining() > 0)
      
  
    return intelHex386Document;
  }


  addRecord(record: IntelHexRecordObject): boolean {
    const { address, type, data } = record;
    const currentAddress = () => this._address + this._tempArray!.length;


    switch (type) {
      case IntelHexRecordType.Data: {
        if (this._tempArray!.length === 0) {
          this._address += address;
        }
        this._tempArray!.push(...data);
        break;
      }
      case IntelHexRecordType.EndOfFile: {
        this._buildBuffer();
        break;
      }
      case IntelHexRecordType.ExtendedLinearAddress: {
        const ela = record.getExtendedLinearAddress()!;
        if (this.length === 0) {
          this._address += ela;
        }
        if (ela !== currentAddress()) {
          this._buildBuffer();
          return false;
        }
        break;
      }
    }

    return true;
  }
  read(address:number,length:number):Buffer|null{
    if (!this._hasAddress) { return null; }
    const start = address - this._address;
    const end = start + length;
    if (end > (this._address + this.length)) {
      throw new Error('Block - Read length exceeds size of buffer');
    }
    return this._buffer!.subarray(start,end);
  }
  write(address:number, buffer:Buffer):boolean{
    if (!this._hasAddress) { return false; }
    const start = address - this._address;
    const end = start + buffer.length;
    if (end > (this._address + this.length)) {
      throw new Error('Block - Read length exceeds size of buffer');
    }

    buffer.copy(this._buffer!, start);
    return true;
  }

  

  private toJSON(): BlockToJSON {
    return {
      _address: this._address.toString(16).padStart(8, "0"),
      _buffer: this._buffer!.toString('base64')
    };
  }
}

