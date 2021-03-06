import { CommandInteraction, MessageReaction, User } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export abstract class Rpc {
  
  @Slash("rpc")
  async startGame(interaction: CommandInteraction): Promise<void> {
    interaction.channel?.send("Singleplayer Round started, react with Rock, Paper or Scissor!").then(
      sentMessage => {
        sentMessage.react('đŞ¨')
        .then(() => sentMessage.react('đď¸'))
        .then(() => sentMessage.react('âď¸'));

        const filter = (reaction: MessageReaction, user: User) => {
          if (reaction.emoji.name != null) {
            return ['đŞ¨', 'đď¸', 'âď¸'].includes(reaction.emoji.name) && user.id === interaction.user.id;
          }
          return false;
        };

        sentMessage.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
          const reaction = collected.first();
          const choices = ['đŞ¨', 'đď¸', 'âď¸'];
          const result = choices[Math.floor(Math.random() * 3)];
          if (reaction != undefined && interaction.channel != null) {
            if (reaction.emoji.name === result) {
              return interaction.channel.send(`It\'s a tie! \nWe both picked ${result}`);
            }
    
            switch (reaction.emoji.name) {
            case 'đŞ¨':
              if (result === 'đď¸') {
                return interaction.channel.send('I won! \nđď¸ covers đŞ¨');
              }
              return interaction.channel.send('You won! \nđŞ¨ smashes âď¸');
            case 'đď¸':
              if (result === 'âď¸') {
                return interaction.channel.send('I won! \nâď¸ cut đď¸');
              }
              return interaction.channel.send('You won! \nđď¸ covers đŞ¨');
            case 'âď¸':
              if (result === 'đŞ¨') {
                return interaction.channel.send('I won! \nđŞ¨ smashes âď¸');
              }
              return interaction.channel.send('You won! \nâď¸ cuts đď¸');
            }
          }
        })
        .catch(() => {
          interaction.reply("Time's up!");
        });
      }
    );
  }
}
