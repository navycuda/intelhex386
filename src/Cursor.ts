import Block from "./Block"

export default class Cursor{
  private block:Block;
  startingAddress:number;
  index: number;

  constructor(block:Block,memoryAddress:number){
    this.block = block;
    this.startingAddress = memoryAddress;
    this.index = memoryAddress - block.address;
  }

  reset(){
    this.index = (this.startingAddress - this.block.address) >>> 0;
  }

  private advanceCursor():number{
    if (this.index >= this.block.data!.length){
      throw new Error('Cursor advanced beyond end of the block');
    }
    return this.index++;
  }

  read(){
    console.log('read()',this);
    return this.block.data![this.advanceCursor()];
  }
  readSequentially(length:number){
    return Buffer.from(Array.from({length}, this.read));
  }


  // MAJOR REFACTOR NEEDED TO INCLUDE BLOCK DATA CHANGE
  // AKA CHANGE AUDITING.
  write(byte:number){
    this.block.data![this.advanceCursor()] = byte & 0xFF;
  }
  writeSequentially(bytes:Buffer|number[]){
    for (const byte of bytes){
      this.write(byte);
    }
  }
}