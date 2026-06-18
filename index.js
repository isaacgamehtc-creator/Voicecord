const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// Servidor web obligatorio para Render y UptimeRobot
http.createServer((req, res) => {
    res.write("Bot 24/7 Activo");
    res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

client.on('clientReady', () => {
    console.log(`¡Bot conectado con éxito a Discord como ${client.user.tag}!`);
    
    // Conexión automática agarrando el servidor donde esté metido el bot
    try {
        const guild = client.guilds.cache.first();
        if (!guild) return console.error("Error: El bot no encuentra ningún servidor en su lista.");
        
        joinVoiceChannel({
            channelId: process.env.VOICE_CHANNEL_ID,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false
        });
        console.log("¡Éxito! El bot ha enviado la orden de entrada al canal de voz.");
    } catch (error) {
        console.error("Error al conectar al canal de voz:", error);
    }
});

client.login(process.env.DISCORD_TOKEN);
