import IntelHex386 from "./IntelHex386";
export default IntelHex386;


import fs from "fs";

const intelHex386Document = fs.readFileSync("/Users/navycuda/work/c/cummins_v2/ecm_data/xcal/23701EZ45C_mm/23701EZ45C_mm_V3_23.xcal",'utf-8');


const intelHex386 = new IntelHex386(intelHex386Document);

console.log(intelHex386);