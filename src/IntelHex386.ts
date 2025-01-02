import Block from "./Block";
import parseRecord from "./tools/parseRecord";


/** # Intel Hex 386 Class
 * Instantiates an Intel Hex 386 object for reading, writing and generating
 * intel hex 386 documents.
 */
export default class IntelHex386{
  blocks: Block[];
  timeToProcess: number;



  constructor(intelHex386Document:string){
    const parseStartTime = Date.now();
    this.blocks = [
      new Block()
    ];
    const currentBlock = () => this.blocks[this.blocks.length - 1];

    const intelHex386Lines = intelHex386Document.split(/\r?\n/);

    const headerArray = [];
    const intelHexArray = [];

    for (const line of intelHex386Lines){
      if (line[0] !== ":" && intelHexArray.length === 0) { headerArray.push(line); }
      if (line[0] === ":") { intelHexArray.push(line); }
    }



    const records = intelHexArray.map(r => parseRecord(r));




    for (const record of records){
      if (!currentBlock().addRecord(record)){
        this.blocks.push(new Block());
        currentBlock().addRecord(record);
      }
    }



    this.timeToProcess = Date.now() - parseStartTime;
  }




  /** ## serialize
   * Method to return the intel hex 386 object back to a utf-8 text document
   */
  serialize(){
    return '';
  }
}