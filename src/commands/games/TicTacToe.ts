import { Discord, Slash } from "discordx";
import { CommandInteraction } from "discord.js";

@Discord()
export abstract class TicTacToe {

  @Slash("tictactoe")
  @Slash("ttt")
  async ticTacToe(interaction: CommandInteraction) {
    await interaction.reply("Tic Tac Toe is not implemented yet.");
  }
}
