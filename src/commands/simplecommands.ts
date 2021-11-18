import {
  CommandInteraction,
  Message,
  MessageEmbed,
  MessageOptions,
} from "discord.js";
import { Discord, SimpleCommand, SimpleCommandMessage, Slash } from "discordx";

@Discord()
abstract class chat {

  @SimpleCommand("vibecheck")
  async vibeCheck(command: SimpleCommandMessage): Promise<void> {
    command.message.reply(`you have passed the vibecheck`);
  }

}
