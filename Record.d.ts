/** ## Intel Hex Record
 * A single line of the intel hex document.
 * 
 * @example
 * :02000004800278
 * |||||||||||||^^ Checksum
 * |||||||||^^^^ Data
 * |||||||^^ Type
 * |||^^^^ Address
 * |^^ Length in bytes
 * ^ Record prefix
 * 
 */
export default class Record{
  length:number;
  address:number;
  type:number;
  data:number[];
  checksum:number;
  constructor(intelHexRecord:string);
}