# intelhex386

A lightweight and robust library for parsing and manipulating Intel HEX 386 files in Node.js.

This library provides a simple interface for working with Intel HEX records, handling data blocks, and converting between the HEX format and binary data.

## Features

- Parse Intel HEX files (including headers).
- Read data from and write data to specific memory addresses.
- Support for Extended Linear Address (ELA) records.
- Convert the entire HEX structure to a single binary buffer.
- Written in TypeScript, providing full type safety.

## Installation

Install the package using npm:

```bash
npm install intelhex386
```

## Basic Usage

### Parsing and Modifying an Existing Intel HEX File

You can easily load, parse, and modify an existing `.hex` file.

```typescript
import { IntelHex386 } from 'intelhex386';
import * as fs from 'fs';

// Read the content of your hex file
const hexFileContent = fs.readFileSync('path/to/your/file.hex', 'utf-8');

// Create a new IntelHex386 instance
const intelHex = new IntelHex386(hexFileContent);

// Read 16 bytes from address 0x1000
try {
  const data = intelHex.read(0x1000, 16);
  console.log('Data read:', data);
} catch (error) {
  console.error(error.message);
}

// Create some new data to write
const myData = Buffer.from('Hello, Intel HEX World!');

// Write the new data to address 0x2500
try {
  intelHex.write(0x2500, myData);
  console.log('Data written successfully.');
} catch (error) {
  console.error(error.message);
}

// Convert the object back to an Intel HEX format string
const hexString = intelHex.toIntelHex386Document();

// Save the modified HEX file
fs.writeFileSync('modified_file.hex', hexString);

console.log('Modified HEX file saved.');
```

## API Reference

### `IntelHex386`

The main class for working with Intel HEX 386 files.

#### `constructor(intelHex386: string | IntelHex386ToJSON)`

Creates a new `IntelHex386` instance from an existing Intel HEX formatted string or a JSON object.

- An Intel HEX formatted string.
- A JSON object (for serialization/deserialization).

#### `read(address: number | string, length: number): Buffer`

Reads a specified number of bytes from a given memory address. Throws an error if the address range is not found within any data block.

- `address`: The starting memory address (can be a number or a hexadecimal string like `'0x1000'`).
- `length`: The number of bytes to read.

Returns a `Buffer` containing the requested data.

#### `write(address: number | string, buffer: Buffer): boolean`

Writes a `Buffer` of data to a specified memory address. Throws an error if the address range does not fit within an existing data block.

- `address`: The starting memory address (can be a number or a hexadecimal string).
- `buffer`: The `Buffer` containing the data to write.

Returns `true` if the write was successful.

#### `toIntelHex386Document(): string`

Converts the internal representation of the HEX file back into a standard Intel HEX 386 formatted string, including all headers, data records, and the end-of-file record.

#### `toBinary(): Buffer`

Concatenates all data blocks into a single, contiguous binary `Buffer`.

#### `findInBlocks<T>(callback: (buffer: Buffer) => T | null): FindInBlocksResult<T> | null`

Searches through all data blocks using a callback function to find a specific value or pattern.

- `callback`: A function that receives each block's buffer and returns a value if a match is found, or `null` otherwise.

Returns a `FindInBlocksResult` object (containing the block index, address, and result) or `null` if nothing is found.

## License

This project is licensed under the AGPL-3.0 License.
