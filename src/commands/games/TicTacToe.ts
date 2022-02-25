import { ButtonComponent, Discord, Slash, SlashOption } from "discordx";
import {
  ButtonInteraction,
  CommandInteraction,
  GuildCacheMessage,
  GuildMember, MessageActionRow,
  MessageButton,
  MessageEmbed,
  MessageReaction,
  User
} from "discord.js";
import { APIInteractionGuildMember } from "discord-api-types";
import { TicTacToeField } from "../../types/TicTacToeField";

@Discord()
export abstract class TicTacToe {

  private winningCombinations: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  private gameBoard: TicTacToeField[] = [];

  private buttonArr: MessageButton[] = [];

  private player1: GuildMember | APIInteractionGuildMember;
  private player2: GuildMember;

  private player1Turn = true;

  generateButtonArr() {
    this.buttonArr = [];
    for (let i = 1; i < 10; i++) {
      const btn = new MessageButton()
        .setEmoji("⬜")
        .setStyle("SECONDARY")
        .setCustomId(i.toString());
      this.buttonArr.push(btn);
    }
  }

  protected constructor(player1: GuildMember | APIInteractionGuildMember, player2: GuildMember) {
    this.player1 = player1;
    this.player2 = player2;
  }

  @Slash("tictactoe", { description: "Play a game of Tic Tac Toe with somebody!" })
  async ticTacToe(@SlashOption("opponent", {
                    description: "The player to play against",
                    required: true
                  }) secondPlayer: GuildMember,
                  interaction: CommandInteraction) {
    await interaction.deferReply();

    this.generateButtonArr();

    this.player1 = interaction.member;
    this.player2 = secondPlayer;

    const splicedComponents = this.splitArray(this.buttonArr, 3);

    const row = new MessageActionRow().setComponents(splicedComponents[0]);
    const row2 = new MessageActionRow().setComponents(splicedComponents[1]);
    const row3 = new MessageActionRow().setComponents(splicedComponents[2]);

    await interaction.editReply({
      content: `${this.player1.user.username} vs ${this.player2.user.username}! \nIt's ${this.player1.user.username} turn!`,
      components: [row, row2, row3]
    });

  }

  @ButtonComponent("1")
  @ButtonComponent("2")
  @ButtonComponent("3")
  @ButtonComponent("4")
  @ButtonComponent("5")
  @ButtonComponent("6")
  @ButtonComponent("7")
  @ButtonComponent("8")
  @ButtonComponent("9")
  async gameButton(interaction: ButtonInteraction): Promise<void> {
    if (this.player1Turn && interaction.member.user.id !== this.player1.user.id) return;
    if (!this.player1Turn && interaction.member.user.id !== this.player2.user.id) return;
    const updatedButtons = await this.updateButtons(interaction);
    if (await this.checkWin(interaction)) {
      await this.endGame(interaction);
      return;
    }
    await interaction.update({
      content: `${interaction.user.username} clicked! \nIt's ${this.player1Turn ? this.player2.user.username : this.player1.user.username}'s turn`,
      components: updatedButtons
    });
    this.player1Turn = !this.player1Turn;
  }

  splitArray(array: MessageButton[], chunkSize: number): MessageButton[][] {
    const clone = array.slice();
    const results = [];
    while (array.length) {
      const spliced = array.splice(0, chunkSize);
      results.push(spliced);
    }
    this.buttonArr = clone;
    return results;
  }

  async updateButtons(interaction: ButtonInteraction): Promise<MessageActionRow[]> {
    const btn = await this.buttonArr.find(button => button.customId === interaction.customId);

    if (btn) {
      btn.setEmoji(interaction.member.user.id === this.player1.user.id ? "❌" : "⭕");
      btn.setStyle(interaction.member.user.id === this.player1.user.id ? "SUCCESS" : "PRIMARY");
      btn.setDisabled(true);

      this.buttonArr[this.buttonArr.findIndex((button) => button.customId === interaction.customId)] = btn;
    }

    const splicedComponents = this.splitArray(this.buttonArr, 3);

    const row = new MessageActionRow().setComponents(splicedComponents[0]);
    const row2 = new MessageActionRow().setComponents(splicedComponents[1]);
    const row3 = new MessageActionRow().setComponents(splicedComponents[2]);

    return [row, row2, row3];
  }

  async checkWin(interaction: ButtonInteraction): Promise<boolean> {

    this.gameBoard.push({
      field: interaction.customId,
      player: interaction.user.id === this.player1.user.id ? this.player1.user.id : this.player2.user.id
    });

    return false;

  }

  async endGame(interaction: ButtonInteraction): Promise<void> {

    this.buttonArr.forEach(button => {
      button.setDisabled(true);
    });

    const splicedComponents = this.splitArray(this.buttonArr, 3);

    const row = new MessageActionRow().setComponents(splicedComponents[0]);
    const row2 = new MessageActionRow().setComponents(splicedComponents[1]);
    const row3 = new MessageActionRow().setComponents(splicedComponents[2]);

    await interaction.update({
      content: `${interaction.user.username} won!`,
      components: [row, row2, row3]
    });
  }

}
