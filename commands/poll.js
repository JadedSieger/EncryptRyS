const { PollBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createPoll')
        .setDescription('Create a poll.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title of the Poll.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('choices_count')
                .setDescription('Number of choices for the poll.')
                .setRequired(true)
                .setMinValue(2)
                .setMaxValue(10)), // Limit to 10 choices to avoid spam

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const choicesCount = interaction.options.getInteger('choices_count');

        if (choicesCount < 2 || choicesCount > 10) {
            return interaction.reply({
                content: 'Please provide a number between 2 and 10 for the choices.',
                ephemeral: true,
            });
        }

        // Dynamically add options for choices
        let pollChoices = [];
        for (let i = 1; i <= choicesCount; i++) {
            const choice = interaction.options.getString(`choice_${i}`);
            if (choice) {
                pollChoices.push(choice);
            }
        }

        const poll = new PollBuilder()
            .setQuestion(title);

        // Add all the choices to the poll
        pollChoices.forEach(choice => poll.addChoice(choice));

        // Send the poll to the channel
        await interaction.reply({
            content: `**Poll:** ${title}`,
            components: [poll.toJSON()],
        });
    }
};
