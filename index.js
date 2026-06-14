const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// 1. Crear un servidor web falso para engañar a Render y UptimeRobot
http.createServer((req, res) => {
    res.write("Bot 24/7 Activo");
    res.end();
}).listen(process.env.PORT || 3000, () => {
    console.log("Servidor web listo para recibir tráfico de UptimeRobot.");
});

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
            selfDeaf: false
        });
        console.log("Conectado exitosamente al canal de voz.");
    } catch (error) {
        console.error("Error al conectar al canal de voz:", error);
    }
});

client.login(process.env.DISCORD_TOKEN);
