const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs'); // To read/write files

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklistAppeal')
        .setDescription('Send your appeal to being blacklisted.')
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Give a reason why you should be removed from the blacklist')
                .setRequired(true)),

    async execute(interaction) {
        const userId = interaction.user.id; // Get user ID
        const reason = interaction.options.getString('reason'); // Get the appeal reason

        // Load the current appeals data (if it exists)
        let appealsData = {};
        try {
            const data = fs.readFileSync('appeals.json', 'utf8');
            appealsData = JSON.parse(data);
        } catch (error) {
            console.log("No existing appeals file or failed to read.");
        }

        // Add the new appeal to the data
        appealsData[userId] = reason;

        // Write the updated data back to the JSON file
        fs.writeFileSync('appeals.json', JSON.stringify(appealsData, null, 2));

        // Respond to the user
        await interaction.reply(`Your appeal has been submitted. Reason: ${reason}`);
    }
};
