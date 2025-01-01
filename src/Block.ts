import { IntelHexRecordObject } from "./tools/parseRecord";

export default class Block{
  startingAddress:number;
  data:Bu

  constructor(startingAddress:number){
    this.startingAddress = startingAddress;
  }


  assembleRecords(){
    const data = [];

    return (record:IntelHexRecordObject):boolean => {
      // if we find that the record to be added cannot be added to this block
      // we need to return false.  However we also must finish the instantiation
      // of this block.




      const success = false;

      if (!success) {

      }

      return success;
    }
  }
}