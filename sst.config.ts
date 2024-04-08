import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack";
import dotenv from "dotenv";
dotenv.config();

export default {
  config(_input) {
    return {
      name: "MathQuiz",
      region: "ca-central-1",
    };
  },
  stacks(app) {
    app.stack(API);
  },
} satisfies SSTConfig;
