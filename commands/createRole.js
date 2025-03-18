const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

// Map permission names to their corresponding bitfield values
const permissionMap = {
    'ADMINISTRATOR': PermissionsBitField.Flags.Administrator,
    'MANAGE_ROLES': PermissionsBitField.Flags.ManageRoles,
    'MANAGE_MESSAGES': PermissionsBitField.Flags.ManageMessages,
    'KICK_MEMBERS': PermissionsBitField.Flags.KickMembers,
    'BAN_MEMBERS': PermissionsBitField.Flags.BanMembers,
    'VIEW_CHANNEL': PermissionsBitField.Flags.ViewChannel,
    'SEND_MESSAGES': PermissionsBitField.Flags.SendMessages,
    'MANAGE_CHANNELS': PermissionsBitField.Flags.ManageChannels,
    'MENTION_EVERYONE': PermissionsBitField.Flags.MentionEveryone,
    'USE_EXTERNAL_EMOJIS': PermissionsBitField.Flags.UseExternalEmojis,
    'CHANGE_NICKNAME': PermissionsBitField.Flags.ChangeNickname,
    'MANAGE_NICKNAMES': PermissionsBitField.Flags.ManageNicknames,
    'MANAGE_WEBHOOKS': PermissionsBitField.Flags.ManageWebhooks,
    'MANAGE_GUILD': PermissionsBitField.Flags.ManageGuild,
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createrole')
        .setDescription('Creates a new role with the specified name, color, and permissions.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the role')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('The color of the role (in hex format, e.g., #FF0000)'))
        .addStringOption(option =>
            option.setName('permissions')
                .setDescription('A comma-separated list of permissions')),
    async execute(interaction) {
        // Check if the user has permission to manage roles
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'You do not have permission to create roles.', ephemeral: true });
        }

        // Extract role name, color, and permissions from options
        const roleName = interaction.options.getString('name');
        const roleColor = interaction.options.getString('color') || '#000000'; // Default to black if no color is provided
        const permissionsInput = interaction.options.getString('permissions');

        // Validate role color
        if (!/^#([0-9A-Fa-f]{6})$/.test(roleColor)) {
            return interaction.reply({ content: 'Invalid color format. Please use a hex color code (e.g., #FF0000).', ephemeral: true });
        }

        // Parse and validate permissions
        let permissionBits = 0n; // Initialize with no permissions
        if (permissionsInput) {
            const permissions = permissionsInput.split(',').map(perm => perm.trim().toUpperCase());
            for (const perm of permissions) {
                if (permissionMap[perm]) {
                    permissionBits |= permissionMap[perm]; // Add permission to the bitfield
                } else {
                    return interaction.reply({ content: `Invalid permission: ${perm}.`, ephemeral: true });
                }
            }
        }

        try {
            // Create the role
            const role = await interaction.guild.roles.create({
                name: roleName,
                color: roleColor,
                permissions: permissionBits, // Apply permissions
                hoist: true, // Display role separately
                mentionable: true, // Allow role to be mentioned
                reason: `Role created by ${interaction.user.tag}`,
            });

            // Send confirmation message
            await interaction.reply(`Role **${role.name}** created successfully with permissions: ${permissionsInput || 'None'}`);
        } catch (error) {
            console.error('Error creating role:', error);
            await interaction.reply({ content: 'An error occurred while creating the role.', ephemeral: true });
        }
    },
};