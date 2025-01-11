import Block, { BlockJsonObject } from "./Block";
import parseRecord from "./tools/parseRecord";


/** # Intel Hex 386
 * Instantiates an Intel Hex 386 object for reading and writing
 * intel hex 386 documents.
 */
export default class IntelHex386{
  blocks: Block[];
  timeToProcess: number|undefined;
  headerArray: string[];


  constructor(intelHex386Document:string);
  constructor(intelHex386JsonObject:IntelHex386JsonObject);
  constructor(value:string|IntelHex386JsonObject){
    const parseStartTime = Date.now();
    const setTimeToProcess = () => { this.timeToProcess = Date.now() - parseStartTime; }


    if (value instanceof Object){
      this.headerArray = value.headerArray;
      this.blocks = value.blocks.map(b => new Block(b));
      setTimeToProcess();
      return;
    }

    this.blocks = [
      new Block()
    ];
    const currentBlock = () => this.blocks[this.blocks.length - 1];

    // Remove carriage returns and split the document into an array of strings
    // at the new line characters.
    const intelHex386Lines = value.replace(/\r/g,'').split(/\n/);

    // Prepare the storage areas
    this.headerArray = [];
    const intelHexArray = [];

    // Sort out the file header items and the intel hex records
    for (const line of intelHex386Lines){
      if (line[0] !== ":" && intelHexArray.length === 0) { this.headerArray.push(line); }
      if (line[0] === ":") { intelHexArray.push(line); }
    }

    const records = intelHexArray.map(r => parseRecord(r));

    // Instantiate the blocks by feeding them records
    for (const record of records){
      console.log(record);
      if (!currentBlock().addRecord(record)){
        this.blocks.push(new Block());
        currentBlock().addRecord(record);
      }
    }

    setTimeToProcess();
  }


  serialize(){ return serializeAsIntelHex(this); }
  toJSON(){ return serializeAsJson(this); }
}

const serializeAsIntelHex = (intelHex386:IntelHex386):string => {
  let serializedIntelHex386 = '';

  // Add header array
  for (const header of intelHex386.headerArray){
    serializedIntelHex386 += header + '\r\n';
  }

  // Add blocks
  for (const block of intelHex386.blocks){
    serializedIntelHex386 += block.serializeAs.intelHex386();
  }

  // add the end of file record
  serializedIntelHex386 += ':00000001FF'

  return serializedIntelHex386;
}

interface IntelHex386JsonObject{
  headerArray: string[];
  blocks: BlockJsonObject[];
}

const serializeAsJson = (intelHex386:IntelHex386,pretty:boolean = false):string => {

  const jsonObject = {
    headerArray: intelHex386.headerArray,
    blocks: intelHex386.blocks.map(b => b.serializeAs.json())
  }


  return !pretty ? JSON.stringify(intelHex386) : JSON.stringify(intelHex386,null,2);
}