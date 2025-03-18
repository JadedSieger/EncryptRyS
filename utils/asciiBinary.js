function binaryToAscii(binary) {
    if (!/^[01\s]+$/.test(binary)) return "Invalid binary input!";
    return binary.split(' ')
        .map(bin => String.fromCharCode(parseInt(bin, 2)))
        .join('');
}

function asciiToBinary(text) {
    if (typeof text !== 'string') return "Invalid input!";
    return text.split('')
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');
}

module.exports = { binaryToAscii, asciiToBinary };