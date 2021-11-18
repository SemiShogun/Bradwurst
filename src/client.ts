import * as dotenv from "dotenv";
import "reflect-metadata";
import { Intents, Interaction, Message } from "discord.js";
import { Client } from "discordx";
import { dirname, importx } from "@discordx/importer";
dotenv.config({ path: ".env" });

async function start() {
  const client = new Client({
    simpleCommand: {
      prefix: "]",
    },
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
    // Glob string for loading classes
    classes: [`./commands/*.{js,ts}`],
    // If you only want to use guild commands, uncomment this line
    // botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
    // silent: true,
  });

  client.once("ready", async () => {
    // init all application commands
    await client.initApplicationCommands({
      guild: { log: true },
      global: { log: true },
    });
    client.user?.setActivity("Playing /bwhelp");
    // init permissions; enabled log to see changes
    await client.initApplicationPermissions(true);

    console.log("Bot started");
  });

  client.on("interactionCreate", (interaction: Interaction) => {
    client.executeInteraction(interaction);
  });

  client.on("messageCreate", (message: Message) => {
    client.executeCommand(message);
  });

  await importx(dirname(import.meta.url) + "/{events,commands}/**/*.{ts,js}");
  client.login(process.env.TOKEN!);
}

start();
