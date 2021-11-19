import { CommandInteraction, MessageReaction, User } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export abstract class Rpc {
  
  @Slash("rpc")
  async startGame(interaction: CommandInteraction): Promise<void> {
    interaction.channel?.send("Singleplayer Round started, react with Rock, Paper or Scissor!").then(
      sentMessage => {
        sentMessage.react('🥌')
        .then(() => sentMessage.react('🗞️'))
        .then(() => sentMessage.react('✂️'));

        const filter = (reaction: MessageReaction, user: User) => {
          if (reaction.emoji.name != null) {
            return ['🥌', '🗞️', '✂️'].includes(reaction.emoji.name) && user.id === interaction.user.id;
          }
          return false;
        };

        sentMessage.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
        .then(collected => {
          const reaction = collected.first();
          const choices = ['🥌', '🗞️', '✂️'];
          const result = choices[Math.floor(Math.random() * 3)];
          if (reaction != undefined && interaction.channel != null) {
            if (reaction.emoji.name === result) {
              return interaction.channel.send(`It\'s a tie! \nWe both picked ${result}`);
            }
    
            switch (reaction.emoji.name) {
            case '🥌':
              if (result === '🗞️') {
                return interaction.channel.send('I won! \n🗞️ covers 🥌');
              }
              return interaction.channel.send('You won! \n🥌 smashes ✂️');
            case '🗞️':
              if (result === '✂️') {
                return interaction.channel.send('I won! \n✂️ cut 🗞️');
              }
              return interaction.channel.send('You won! \n🗞️ covers 🥌');
            case '✂️':
              if (result === '🥌') {
                return interaction.channel.send('I won! \n🥌 smashes ✂️');
              }
              return interaction.channel.send('You won! \n✂️ cuts 🗞️');
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
