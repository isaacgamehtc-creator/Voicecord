const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const http = require('http');

// Servidor web para UptimeRobot
http.createServer((req, res) => {
    res.write("Bot 24/7 Activo");
    res.end();
}).listen(process.env.PORT || 3000);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

// Función central para conectar al canal
function conectarVoz() {
    try {
        joinVoiceChannel({
            channelId: process.env.VOICE_CHANNEL_ID,
            guildId: client.guilds.cache.first().id,
            adapterCreator: client.guilds.cache.first().voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false
        });
        console.log("Intentando conectar/reconectar al canal de voz...");
    } catch (error) {
        console.error("Error en la conexión de voz:", error);
    }
}

client.on('ready', () => {
    console.log(`¡Bot conectado como ${client.user.tag}!`);
    conectarVoz();
});

// ¡EL TRUCO ANTIPANAS! Si tu amigo lo saca, el bot detecta el cambio de estado y vuelve a entrar
client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.id === client.user.id && newState.channelId === null) {
        console.log("El bot fue desconectado del canal. Reconectando en 5 segundos...");
        setTimeout(() => {
            conectarVoz();
        }, 5000); // Espera 5 segundos para limpiar la caché de Discord y vuelve a entrar
    }
});

client.login(process.env.DISCORD_TOKEN);
