const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
    '9': '----.', ' ': '/', '.': '.-.-.-', ',': '--..--', '?': '..--..',
    '!': '-.-.--', '-': '-....-', '/': '-..-.', '@': '.--.-.', '&': '.-...',
    '(': '-.--.', ')': '-.--.-'
};

const reverseMorse = Object.fromEntries(Object.entries(morseCode).map(([char, code]) => [code, char]));

function morseEncode(message) {
    return message.toUpperCase().split('').map(char => morseCode[char] || '?').join(' ');
}

function morseDecode(morse) {
    return morse.split(' ').map(code => reverseMorse[code] || '?').join('');
}

module.exports = { morseEncode, morseDecode };