const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const http = require('http');

// Servidor web obligatorio para Render y UptimeRobot
http.createServer((req, res) => {
    res.write("Bot 24/7 Activo");
    res.end();
}).listen(process.env.PORT || 3000, () => {
    console.log("Servidor web listo para recibir tráfico de UptimeRobot.");
});

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

// Función de conexión ultra estable usando IDs fijos
function conectarVoz() {
    try {
        const connection = joinVoiceChannel({
            channelId: process.env.VOICE_CHANNEL_ID,
            guildId: process.env.GUILD_ID, // <--- Ahora usa tu ID directo sin fallar en caché
            adapterCreator: client.guilds.cache.get(process.env.GUILD_ID).voiceAdapterCreator,
            selfMute: false,
            selfDeaf: false
        });
        console.log("¡Éxito! El bot ha enviado la orden de entrada al canal de voz.");
    } catch (error) {
        console.error("Error crítico al intentar conectar al canal de voz:", error);
    }
}

client.on('ready', () => {
    console.log(`¡Bot conectado con éxito a Discord como ${client.user.tag}!`);
    conectarVoz();
});

// Filtro Anti-Desconexiones de amigos
client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.member.id === client.user.id && newState.channelId === null) {
        console.log("Se detectó una expulsión del canal de voz. Reconectando en 5 segundos...");
        setTimeout(() => {
            conectarVoz();
        }, 5000);
    }
});

client.login(process.env.DISCORD_TOKEN);
