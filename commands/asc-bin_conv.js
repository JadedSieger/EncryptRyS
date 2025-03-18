const { SlashCommandBuilder } = require('discord.js');
const { asciiToBinary, binaryToAscii } = require('../utils/asciiBinary');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('asc-bin_conv')
        .setDescription('Converts between ASCII and binary')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Conversion mode: asc-bin or bin-asc')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Text to convert')
                .setRequired(true)),
    async execute(interaction) {
        const mode = interaction.options.getString('mode');
        const text = interaction.options.getString('text');
        let result;
        if (mode === "asc-bin") {
            result = asciiToBinary(text);
        } else if (mode === "bin-asc") {
            result = binaryToAscii(text);
        } else {
            result = "Invalid mode.";
        }
        return interaction.reply(`Result: ${result}`);
    }
};