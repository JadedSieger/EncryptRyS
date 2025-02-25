require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const crypto = require('crypto');
const { EmbedBuilder } = require('@discordjs/builders');

const prefix = process.env.prefix;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});



client.on('ready',() =>{
    console.log("HiRyS, it's EncryptRyS!");
    client.user.setActivity("Carbonated Love",  {type: ActivityType.Streaming});
});

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix)) return;

    // Extract command and arguments properly
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase(); // Extract command name

    let result = null;

    if (command === "help") {
        result = help(args[0], message);
    } else if (command === "genpass") {
        let length = parseInt(args[0]);
        if (isNaN(length) || length <= 0) length = 12; // Default to 12 if not specified
        result = securePassword(length);
    } else if (command === "encrypt" || command === "decrypt") {
        if (args.length < 2) {
            return message.reply("Please provide at least two arguments: value and method. Some methods may require a passkey.");
        }

        const [value, method, passkey] = args;
        result = command === "encrypt" ? encrypt(value, method, passkey) : decrypt(value, method, passkey);
    } else if (command === "morse") {
        if (args.length < 2) {
            return message.reply("Usage: `rys>morse <encode/decode> <text>`");
        }
        const mode = args.shift().toLowerCase();
        const text = args.join(' ');

        if (mode === "encode") {
            result = morseEncode(text);
        } else if (mode === "decode") {
            result = morseDecode(text);
        } else {
            result = "Invalid mode! Use `encode` or `decode`.";
        }
    } else if (command === "asc-bin_conv"){
        if(args.length < 2){
            return message.reply("Usage: `rys>asc-bin_conv <asc-bin/bin-asc> <text>");
        }
        const mode = args.shift().toLowerCase();
        const text = args.join(' ');

        if(mode === "asc-bin"){
            result = asciiToBinary(text);
        } else if(mode === "bin-asc"){
            result = binaryToAscii(text);
        } else{
            result = "Invalid mode."
        }
    } else if(command === "userinfo"){
        await userInfoCommand(message);
    }

    // Check if result is valid before sending a reply
    if (result) {
        if (result instanceof EmbedBuilder) {
            await message.reply({ embeds: [result] });
        } else {
            await message.reply(`Result: ${result}`);
        }
    }
    console.log(message);
});


function encrypt(value, method, passkey = "N/A") {
    try {
        switch (method.toLowerCase()) {
            case 'sha256':
                return crypto.createHash('sha256').update(value).digest('hex');
            case 'md5':
                return crypto.createHash('md5').update(value).digest('hex');
            case 'aes':
                if (!passkey || passkey === "N/A") throw new Error('AES encryption requires a passkey');

                const key = crypto.scryptSync(passkey, 'salt', 32);
                const iv = crypto.randomBytes(16);
                const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

                let encrypted = cipher.update(value, 'utf8', 'hex');
                encrypted += cipher.final('hex');

                return iv.toString('hex') + ':' + encrypted;
            case 'base64':
                return Buffer.from(value).toString('base64');
            case 'rot13':
                return value.replace(/[a-zA-Z]/g, (char) => {
                    let offset = char <= 'Z' ? 65 : 97;
                    return String.fromCharCode(((char.charCodeAt(0) - offset + 13) % 26) + offset);
                });
            case 'hex':
                return Buffer.from(value).toString('hex');
            default:
                return 'Unsupported encryption method';
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}


//Encryption Functions
function decrypt(value, method, passkey = "N/A") {
    try {
        switch (method.toLowerCase()) {
            case 'aes':
                if (!passkey || passkey === "N/A") throw new Error('AES decryption requires a passkey');

                const [ivHex, encryptedData] = value.split(':');
                if (!ivHex || !encryptedData) throw new Error('Invalid AES encrypted data');

                const key = crypto.scryptSync(passkey, 'salt', 32);
                const iv = Buffer.from(ivHex, 'hex');

                const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

                let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
                decrypted += decipher.final('utf8');

                return decrypted;
            case 'base64':
                return Buffer.from(value, 'base64').toString('utf8');
            case 'rot13':
                return value.replace(/[a-zA-Z]/g, (char) => {
                    let offset = char <= 'Z' ? 65 : 97;
                    return String.fromCharCode(((char.charCodeAt(0) - offset + 13) % 26) + offset);
                });
            case 'hex':
                return Buffer.from(value, 'hex').toString('utf8');
            default:
                return 'Unsupported decryption method';
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}


//Help Function
function help(command, message) {
    if (!command) {
        const embed = new EmbedBuilder()
            .setTitle('HiRys, It\'s EncryptRyS!')
            .setDescription('These are my current version\'s commands:')
            .addFields(
                { name: 'Encrypt', value: '`rys>encrypt <text> <method> <passkey (optional)>`' },
                { name: 'Methods', value: '`sha256`, `md5`, `aes`, `base64`, `rot13`, `hex`' },
                { name: 'Decrypt', value: '`rys>decrypt <text> <method> <passkey (if needed)>`' },
                { name: 'Methods', value: '`sha256`, `md5`, `aes`, `base64`, `rot13`, `hex`' },
                { name: 'GeneratePassword', value: '`rys>genPass <length>(will default to 12 when no input is given.`'},
                { name: 'Morse', value: '`rys>morse <type> <value>`'},
                { name: 'Morse_types', value: '`encode`/`decode`'},
                { name: 'Ascii-Binary', value: '`rys>asc-bin_conv <type> <value>`'},
                { name: 'Ascii-Binary_types', value: '`asc-bin`/`bin-asc`'},
                { name: 'UserInfo', value: '`rys>userinfo <mention>`'}

            )
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();
        
        return embed;
    }
}


//GenPass function
function securePassword(length) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}


//Morse Code Encode and Decode
const morseCode = {
    'A': '.-',   'B': '-...', 'C': '-.-.', 'D': '-..',  'E': '.',
    'F': '..-.', 'G': '--.',  'H': '....', 'I': '..',   'J': '.---',
    'K': '-.-',  'L': '.-..', 'M': '--',   'N': '-.',   'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.',  'S': '...',  'T': '-',
    'U': '..-',  'V': '...-', 'W': '.--',  'X': '-..-', 'Y': '-.--',
    'Z': '--..', '0': '-----','1': '.----','2': '..---','3': '...--',
    '4': '....-', '5': '.....','6': '-....','7': '--...','8': '---..',
    '9': '----.', ' ': '/', '.': '.-.-.-', ',': '--..--', '?': '..--..',
    '!': '-.-.--', '-': '-....-', '/': '-..-.', '@': '.--.-.', '&': '.-...',
    '(': '-.--.', ')': '-.--.-'
};

// Reverse lookup for decoding
const reverseMorse = Object.fromEntries(Object.entries(morseCode).map(([char, code]) => [code, char]));

function morseEncode(message) {
    return message.toUpperCase().split('').map(char => morseCode[char] || '?').join(' ');
}

function morseDecode(morse) {
    return morse.split(' ').map(code => reverseMorse[code] || '?').join('');
}


//ascii to binary
function binaryToAscii(binary){
    if (!/^[01\s]+$/.test(binary)) return "Invalid binary input!";

    return binary.split(' ')
    .map(bin => String.fromCharCode(parseInt(bin, 2)))
    .join('');
}

function asciiToBinary(text){
    if (typeof text !== 'string') return "Invalid input!";

    return text.split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
}

async function userInfoCommand(message) {
    try {
        const user = message.mentions.users.first() || message.author; // Get mentioned user or the command sender
        const member = message.guild?.members.cache.get(user.id); // Get member details (only in guilds)

        if (!member) {
            return message.reply("User info is only available in servers.");
        }

        const embed = new EmbedBuilder()
            .setTitle(`${user.username}'s Info`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "Username", value: user.tag, inline: true },
                { name: "ID", value: user.id, inline: true },
                { name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: "Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: "Roles", value: member.roles.cache.map(role => role.name).join(", ") || "None" }
            )
            .setColor(0x3498db)
            .setFooter({ text: `Requested by ${message.author.tag}` })
            .setTimestamp();

        await message.reply({ embeds: [embed] });
    } catch (error) {
        console.error("Error fetching user info:", error);
        message.reply("There was an error retrieving user info.");
    }
}

client.login(process.env.token);