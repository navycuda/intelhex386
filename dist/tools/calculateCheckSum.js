"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculateCheckSum = (values) => {
    const sum = values.reduce((a, c) => (a + c), 0);
    return ((~sum + 1) & 0xFF);
};
exports.default = calculateCheckSum;
