import { unlink } from 'fs/promises';
import { join } from 'path';

export const removeFile = async (path: string) => {
  try {
    const absolutePath = join(__dirname, '..', '..', '..', path);

    await unlink(absolutePath);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {}
};
