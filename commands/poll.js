const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createpoll')
        .setDescription('Create a poll with multiple answers.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Title of the poll.')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('choices_count')
                .setDescription('Number of choices for the poll (2-10).')
                .setRequired(true)
                .setMinValue(2)
                .setMaxValue(10))
        .addStringOption(option => option.setName('choice_1').setDescription('Choice 1'))
        .addStringOption(option => option.setName('choice_2').setDescription('Choice 2'))
        .addStringOption(option => option.setName('choice_3').setDescription('Choice 3'))
        .addStringOption(option => option.setName('choice_4').setDescription('Choice 4'))
        .addStringOption(option => option.setName('choice_5').setDescription('Choice 5'))
        .addStringOption(option => option.setName('choice_6').setDescription('Choice 6'))
        .addStringOption(option => option.setName('choice_7').setDescription('Choice 7'))
        .addStringOption(option => option.setName('choice_8').setDescription('Choice 8'))
        .addStringOption(option => option.setName('choice_9').setDescription('Choice 9'))
        .addStringOption(option => option.setName('choice_10').setDescription('Choice 10')),

    async execute(interaction) {
        const title = interaction.options.getString('title');
        const choicesCount = interaction.options.getInteger('choices_count');

        const choices = [];
        for (let i = 1; i <= choicesCount; i++) {
            const choice = interaction.options.getString(`choice_${i}`);
            if (choice) {
                choices.push(choice);
            } else {
                return interaction.reply({
                    content: `Missing input for choice_${i}. Please provide all ${choicesCount} choices.`,
                    ephemeral: true
                });
            }
        }

        // Defer the reply if processing takes time
        await interaction.deferReply(); // Defer the response first

        // Create buttons for each choice
        const rows = [];
        for (let i = 0; i < choices.length; i += 5) {
            const row = new ActionRowBuilder();
            const chunk = choices.slice(i, i + 5);
            for (let j = 0; j < chunk.length; j++) {
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(`poll_${interaction.id}_choice_${i + j}`) // Poll id is based on interaction id here
                        .setLabel(chunk[j])
                        .setStyle(ButtonStyle.Primary)
                );
            }
            rows.push(row);
        }

        // Send the poll with buttons
        const message = await interaction.editReply({
            content: `📊 **${title}**\nClick a button below to vote.`,
            components: rows
        });

        // Store poll ID for later tracking
        const pollId = message.id; 
    }
};
