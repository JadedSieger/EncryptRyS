const { morseEncode, morseDecode } = require('../utils/morseCode');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('morse')
        .setDescription('Encodes or decodes Morse code')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Mode: encode or decode')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Text to encode/decode')
                .setRequired(true)),
    async execute(interaction) {
        const mode = interaction.options.getString('mode');
        const text = interaction.options.getString('text');
        let result;
        if (mode === "encode") {
            result = morseEncode(text);
        } else if (mode === "decode") {
            result = morseDecode(text);
        } else {
            result = "Invalid mode! Use `encode` or `decode`.";
        }
        return interaction.reply(`Result: ${result}`);
    }
};