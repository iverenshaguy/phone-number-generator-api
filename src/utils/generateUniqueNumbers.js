import fs from 'fs';
import { config } from 'dotenv';

import getUniqueNumber from './getUniqueNumber';
import logger from './logger';

config();

const defaultCount = process.env.DEFAULT_COUNT || 5000;

/* fs.promises is experimental so might still remove */
const fsPromises = fs.promises;

/**
 * Generate a file of unique numbers
 *
 * @param {number} count count
 *
 * @returns {number} the unique number
 */
const generateUniqueNumbers = async (count = defaultCount) => {
  let i = count;
  const almostFourMegabytes = 4190000;
  const stream = fs.createWriteStream('./database/numbers.txt', { flags: 'w' });
  const oldStream = fs.createWriteStream('./database/numbers-old.txt', { flags: 'w' });

  const prevNumbers = await fsPromises.readFile('./database/numbers-old.txt');

  stream.on('error', logger.error);

  /**
   * Function to write numbers to file using fs
   *
   * @return {void} returns nothing
   */
  async function writeToFile() {
    let okToWrite = true;
    do {
      const written = await fsPromises.readFile('./database/numbers.txt'); // eslint-disable-line

      i--;
      if (i === 0 || stream.bytesWritten === almostFourMegabytes) {
        /* write the last number if we have gotten to the last count
          or the bytes written is already almost 4MB */
        const uniqueNumber = getUniqueNumber(written + prevNumbers);

        stream.write(`${uniqueNumber}`);
        stream.end();

        // replace existing file data with newly created data
        const readStream = fs.createReadStream('./database/numbers.txt', { flags: 'r' });
        readStream.pipe(oldStream);
        oldStream.end();
      } else {
        /* ensure we get unique numbers by running through newly generated numbers
          and previously generated numbers */
        const uniqueNumber = getUniqueNumber(written + prevNumbers);
        okToWrite = stream.write(`${uniqueNumber},`);
      }
      /* while => keep generating numbers strem.write returns true
        and we still have more numbers to generate */
    } while (i > 0 && okToWrite);
    if (i > 0) {
      /* stream.write retruned false but there's still data to write so
        we drain the stream and write to the file some more once it drains */
      stream.once('drain', writeToFile);
    }
  }

  await writeToFile();
};

export default generateUniqueNumbers;
