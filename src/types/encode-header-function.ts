export type TEncodeHeaderFunction = (
    dataView: DataView,
    bitRate: number,
    numberOfChannels: number,
    numberOfSamples: number,
    sampleRate: number
) => void;
