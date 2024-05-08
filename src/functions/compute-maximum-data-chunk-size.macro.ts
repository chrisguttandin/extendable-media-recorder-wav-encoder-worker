const MAXIMUM_RIFF_FILE_SIZE = 0xffffffff;

export const computeMaximumDataChunkSize = (consumedBytes: number) => MAXIMUM_RIFF_FILE_SIZE - consumedBytes;
