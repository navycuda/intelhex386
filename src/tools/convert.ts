const fromUIntToHex = (value:number, dataLength:(1|2|3|4)) => {
  const bits = dataLength * 2;
  return value.toString(16).padStart(bits, '0').toUpperCase();
}



const convert = {
  fromUIntToHex
};
export default convert;