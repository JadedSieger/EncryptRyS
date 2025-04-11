const { Events, Collection } = require('discord.js');

// You can move this to a separate file or database if you want persistence
const pollVotes = new Collection(); // key: pollId => value: Collection<userId, choiceIndex>

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handle Slash Commands
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                });
            }
        }

        // Handle Button Polls
        if (interaction.isButton()) {
            const match = interaction.customId.match(/^poll_(\d+)_choice_(\d+)$/);
            if (!match) return;
        
            const pollId = match[1]; // Extract pollId from customId
            const choiceIndex = parseInt(match[2]);
            const userId = interaction.user.id;
        
            if (!pollVotes.has(pollId)) {
                pollVotes.set(pollId, new Collection());
            }
        
            const votes = pollVotes.get(pollId);
        
            if (votes.has(userId)) {
                return await interaction.reply({
                    content: '❗ You already voted in this poll.',
                    ephemeral: true
                });
            }
        
            votes.set(userId, choiceIndex);
        
            return await interaction.reply({
                content: `✅ Vote recorded for choice #${choiceIndex + 1}.`,
                ephemeral: true
            });
        }
        
    },
};
