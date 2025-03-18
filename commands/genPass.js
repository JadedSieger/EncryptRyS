const securePassword = require('../utils/securePassword');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('genpass')
        .setDescription('Generates a secure password')
        .addIntegerOption(option =>
            option.setName('length')
                .setDescription('Length of the password (default: 12)')
                .setRequired(false)),
    async execute(interaction) {
        const length = interaction.options.getInteger('length') || 12;
        const password = securePassword(length);
        return interaction.reply(`Generated Password: \`${password}\``);
    }
};
