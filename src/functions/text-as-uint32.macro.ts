export const textAsUint32 = (text: string): number => {
    const textEncoder = new TextEncoder();

    if (text.length !== 4) {
        throw new Error('The string to convert should contain 4 characters.');
    }

    const dataView = new DataView(textEncoder.encode(text).buffer);

    return dataView.getUint32(0);
};
