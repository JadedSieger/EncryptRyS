const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays help information'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('HiRys, It\'s EncryptRyS!')
            .setDescription('These are my current version\'s commands:')
            .addFields(
                { name: 'Encrypt', value: '`/encrypt <text> <method> <passkey (optional)>`' },
                { name: 'Methods', value: '`sha256`, `md5`, `aes`, `base64`, `rot13`, `hex`' },
                { name: 'Decrypt', value: '`/decrypt <text> <method> <passkey (if needed)>`' },
                { name: 'Methods', value: '`sha256`, `md5`, `aes`, `base64`, `rot13`, `hex`' },
                { name: 'GeneratePassword', value: '`/genpass <length> (default: 12)`' },
                { name: 'Morse', value: '`/morse <type> <value>`' },
                { name: 'Morse_types', value: '`encode`/`decode`' },
                { name: 'Ascii-Binary', value: '`/asc-bin_conv <type> <value>`' },
                { name: 'Ascii-Binary_types', value: '`asc-bin`/`bin-asc`' },
                { name: 'UserInfo', value: '`/userinfo <mention>`' }
            )
            .setTimestamp();
        return interaction.reply({ embeds: [embed] });
    }
};
