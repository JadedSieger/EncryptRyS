const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays information about a user')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to get info about')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;
        const member = interaction.guild?.members.cache.get(user.id);
        if (!member) {
            return interaction.reply("User info is only available in servers.");
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
            .setTimestamp();
        return interaction.reply({ embeds: [embed] });
    }
};
