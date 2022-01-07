import { Command, flags } from "@oclif/command";
import cli from "cli-ux";
import _ from "lodash";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import data from "./utils/data";
import table from "./utils/table";

class CliCorona extends Command {
  static description = "Coronavirus statistics by country.";

  static flags = {
    country: flags.string({
      char: "c",
      description: "country name",
      required: false,
    }),
  };

  async run() {
    let anim = chalkAnimation.rainbow(`\nC O V I D - S T A T I S T I C S\n`);
    await new Promise((res) => setTimeout(res, 1500));
    anim.stop();
    console.log("");
    const { flags } = this.parse(CliCorona);
    let covidData: { data: object } = { data: {} };
    if (flags.country) {
      cli.action.start("Fetching Statistics");
      covidData = await data.get(flags.country);
    } else {
      const country: string = await cli.prompt("Country Name", {
        default: "all",
        required: false,
      });
      cli.action.start("Fetching Statistics");
      covidData = await data.get(country);
    }

    const message = _.get(covidData, ["data", "message"]);
    if (message) {
      this.log(chalk.bold.red(message));
    } else {
      await table.draw(covidData);
    }
    let anim2 = chalkAnimation.neon("\n Be Safe \n");
    await new Promise((res) => setTimeout(res, 3500));
    anim2.stop();
  }
}

export = CliCorona;
