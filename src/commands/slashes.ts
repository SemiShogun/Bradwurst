import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export abstract class slashes {
  @Slash("wave")
  async wave(interaction: CommandInteraction): Promise<void> {
    interaction.reply(`:wave: ${interaction.user}`);
  }

  @Slash("bwhelp")
  async help(interaction: CommandInteraction): Promise<void> {
    const embed = new MessageEmbed()
      .setTitle("**Bradwurst Help**")
      .setColor(10096370)
      .setDescription("Bradwurst is a fun, general, all-purpose bot.")
      .setImage(
        "https://i.kym-cdn.com/entries/icons/facebook/000/020/978/13664722_1118435051549227_802492048_n.jpg"
      )
      .setFields([
        {
          name: "]help",
          value:
            "Returns an overview of all the available commands in the bradwurst bot",
        },
        {
          name: "]vibecheck",
          value: "Will you pass the vibecheck?",
        },
        {
          name: "]ccp",
          value: "Can you pass the Social Credit Quiz?",
        },
        {
          name: "]m (music)",
          value: "Is currently in development...",
        },
      ]);
    await interaction.reply({
      embeds: [embed],
    });
    // command.message.reply({ embed });
  }
}
