import { CommandInteraction } from "discord.js";
import { Discord, SimpleCommand, SimpleCommandMessage, Slash } from "discordx";
import { Question } from "../types/Question";

@Discord()
export abstract class Ccp {
  private questions: Array<Question> = [
    {
      question: "Who is my favourite hololive character?",
      answers: ["Gawr Gura", "Ceres Fauna", "Kiara Takanashi", "Mori Calliope"],
      correctAnswer: "Ceres Fauna",
    },
    {
      question: "Do you like America?",
      answers: ["no", "yes"],
      correctAnswer: "no",
    },
    {
      question: "What happened in Tiananmen Square in 1989?",
      answers: ["Nothing", "Massacre", "Protest"],
      correctAnswer: "Nothing",
    },
    {
      question: "How many children can you have?",
      answers: ["0", "1", "2", "As many as you want"],
      correctAnswer: "2",
    },
    {
      question: "Dwayne the ______",
      answers: ["rock", "wok"],
      correctAnswer: "wok",
    },
    {
      question: "Who is our beloved Chairman",
      answers: ["Xi Jinping", "Winnie Pooh", "John Xina", "Person with highest Credit score"],
      correctAnswer: "Xi Jinping",
    },
  ];

  @Slash("ccp")
  async quiz(interaction: CommandInteraction): Promise<void> {
    interaction.channel?.send("Welcome to the Social Credit Quiz!\n");
    const selectedQuestion =
      this.questions[Math.floor(Math.random() * this.questions.length)];
    interaction.channel
      ?.send(
        `${selectedQuestion.question}\n${selectedQuestion.answers.join("\n")}`
      )
      .then(() => {
        interaction.channel
          ?.awaitMessages({
            filter: (m) => m.author.id === interaction.member.user.id,
            max: 1,
            time: 30000,
          })
          .then((collected) => {
            if (collected.first()?.content == selectedQuestion.correctAnswer) {
              interaction.channel?.send("+15 Social Credits");
            } else {
              interaction.channel?.send("-99999999999 Social Credits");
            }
          })
          .catch(() => {
            interaction.reply("Time's up!");
          });
      });
  }
}
