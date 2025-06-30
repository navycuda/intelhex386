import Block from "./Block";

type Tuple<T> = T extends readonly unknown[] ? T : [];
export interface BlockDataChangeJsonObject{
  address: number;
  data: string;
}
type Endianness = "BigEndian"|"LittleEndian";
type BlockValue<T = number> = [ value:T|T[] ];
type BlockInteger = [ value:BlockValue, signed:boolean, length: (1|2|4) ];
type BlockFixedPoint = [ ...BlockInteger, scalar:number ];
export interface BlockDataType{
  byte: BlockValue
  floating_point: BlockValue;
  fixed_point: BlockFixedPoint;
  integer: BlockInteger;
  string: BlockValue<string>;
}

export default class BlockDataChange{
  address: number;
  data: Buffer;

  /** ## writeTo
   * Method to write the contents of this BlockDataChange to the output buffer
   * using the block for reference, since the buffer is a copy of the data
   * from the block.
   */
  writeTo(block:Block,buffer:Buffer){
    if (block.containsAddress(this.address,this.data.length)){
      const index = this.address - block.address;
      this.data.copy(buffer,index);
    } else {
      throw new Error('Writing to this block goes out of bounds.');
    }
  }

  constructor(blockDataChangeObject:BlockDataChangeJsonObject);
  constructor(address:number,data:Buffer)
  constructor(address:number|BlockDataChangeJsonObject,data?:Buffer){
    if (typeof address === 'object'){
      this.address = address.address;
      this.data = Buffer.from(address.data, 'base64');
    } else if (typeof address === 'number'){
      this.address = address;
      this.data = data!;
    } else {
      throw new Error('Invalid instantiation of BlockDataChange');
    }
  }





  get serializeAs() {
    const parent = this;
    return ({
      jsonObject(){
        return {
          address: parent.address,
          data: parent.data.toString('base64')
        };
      }
    });
  } // get serializeAs()




  static from<T extends keyof BlockDataType>(
    address:number,
    type: T,
    endianness: Endianness,
    ...params: Tuple<BlockDataType[T]>
  ){
    if (Array.isArray(params[0])){
      // Handle if it's an array of values
    } else {
      // It's one value, how fricken hard can this be?
    }



    switch (type){
      case "floating_point":{
        break;
      }
      case "fixed_point":{
        break;
      }
      case "integer":{
        break;
      }
      case "string":{
        break;
      }
    }


    // TODO: REAL RETURN VALUE!!!
    return new BlockDataChange(address,Buffer.from([ 0 ]))
  }
}