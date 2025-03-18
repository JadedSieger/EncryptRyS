const crypto = require('crypto');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('decrypt')
        .setDescription('Decrypts a value using a specified method')
        .addStringOption(option =>
            option.setName('value')
                .setDescription('Value to decrypt')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('method')
                .setDescription('Decryption method')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('passkey')
                .setDescription('Passkey for AES decryption (if needed)')
                .setRequired(false)),
    async execute(interaction) {
        const value = interaction.options.getString('value');
        const method = interaction.options.getString('method');
        const passkey = interaction.options.getString('passkey') || "N/A";
        const result = decrypt(value, method, passkey);
        return interaction.reply(`Decrypted: ${result}`);
    }
};

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
