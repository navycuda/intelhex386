/**
 * Converts an unsigned integer to a hexadecimal string.
 * @param value - The unsigned integer to convert.
 * @param dataLength - The desired length of the hexadecimal string in bytes.
 * @returns The hexadecimal representation of the value.
 */
const fromUIntToHex = (value:number, dataLength:(1|2|3|4)) => {
  const bits = dataLength * 2;
  return value.toString(16).padStart(bits, '0').toUpperCase();
}


/**
 * A collection of conversion utility functions.
 */
const convert = {
  fromUIntToHex
};
export default convert;