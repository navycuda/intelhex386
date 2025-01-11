"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IntelHex386_1 = __importDefault(require("./IntelHex386"));
exports.default = IntelHex386_1.default;
const fs_1 = __importDefault(require("fs"));
const intelHex386Document = fs_1.default.readFileSync("/Users/navycuda/work/c/cummins_v2/ecm_data/xcal/23701EZ45C_mm/23701EZ45C_mm_V3_23.xcal", 'utf-8');
const intelHex386 = new IntelHex386_1.default(intelHex386Document);
console.log(intelHex386);
