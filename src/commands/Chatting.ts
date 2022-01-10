import {
  CommandInteraction,
  Message,
  MessageEmbed,
  MessageOptions,
} from "discord.js";
import { Discord, SimpleCommand, SimpleCommandMessage, Slash } from "discordx";

@Discord()
abstract class Chatting {
  @Slash("wave")
  async wave(interaction: CommandInteraction): Promise<void> {
    await interaction.reply("👋");
  }

  @SimpleCommand("vibecheck")
  async vibeCheck(command: SimpleCommandMessage): Promise<void> {
    command.message.reply(`you have passed the vibecheck`);
  }
}
