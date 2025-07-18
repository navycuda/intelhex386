import fs from 'fs';
import IntelHex386 from './IntelHex386.js';
console.log('Starting up index.js  --- debugging live with NavyCuda');
const intelHex386Document = fs.readFileSync("./237019FU5C.xcal", "utf-8");
const intelHex386 = new IntelHex386(intelHex386Document);
const log = () => {
    const itnTest = intelHex386.read("8002002C", 4);
    const littleEndian = itnTest.readUInt32LE();
    const bigEndian = itnTest.readUInt32BE();
    console.log({
        itnTest,
        littleEndian,
        bigEndian
    });
};
log();
const buffer = Buffer.from([0, 0, 0, 0]);
buffer.writeUInt32LE(1701);
intelHex386.write("8002002C", buffer);
log();
// fs.writeFileSync("debug.json",JSON.stringify(intelHex386,null,2),"utf-8");
