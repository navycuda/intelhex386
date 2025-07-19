const fromUIntToHex = (value, dataLength) => {
    const bits = dataLength * 2;
    return value.toString(16).padStart(bits, '0').toUpperCase();
};
const convert = {
    fromUIntToHex
};
export default convert;
