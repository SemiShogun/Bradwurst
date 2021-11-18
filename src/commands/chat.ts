import { CommandInteraction } from "discord.js";
import { Discord, SimpleCommand, SimpleCommandMessage, Slash } from "discordx";

@Discord()
abstract class chat {
  @Slash("wave")
  async wave(interaction: CommandInteraction) {
    interaction.reply(`:wave: ${interaction.user}`);
  }

  @SimpleCommand("vibecheck")
  async vibeCheck(command: SimpleCommandMessage) {
    command.message.reply(`you have passed the vibecheck`);
  }
}
