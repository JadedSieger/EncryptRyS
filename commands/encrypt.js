const crypto = require('crypto');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('encrypt')
        .setDescription('Encrypts a value using a specified method')
        .addStringOption(option =>
            option.setName('value')
                .setDescription('Value to encrypt')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('method')
                .setDescription('Encryption method')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('passkey')
                .setDescription('Passkey for AES encryption (if needed)')
                .setRequired(false)),
    async execute(interaction) {
        const value = interaction.options.getString('value');
        const method = interaction.options.getString('method');
        const passkey = interaction.options.getString('passkey') || "N/A";
        const result = encrypt(value, method, passkey);
        return interaction.reply(`Encrypted: ${result}`);
    }
};


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
