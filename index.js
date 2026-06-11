const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

client.on('ready', () => {
    console.log(`¡Bot conectado como ${client.user.tag}!`);
    
    try {
        joinVoiceChannel({
            channelId: process.env.VOICE_CHANNEL_ID,
            guildId: client.guilds.cache.first().id,
            adapterCreator: client.guilds.cache.first().voiceAdapterCreator,
            selfMute: false,
            selfDeaf: true
        });
        console.log("Conectado exitosamente al canal de voz.");
    } catch (error) {
        console.error("Error al conectar al canal de voz:", error);
    }
});

client.login(process.env.DISCORD_TOKEN);
