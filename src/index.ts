import dotenv from "dotenv";
dotenv.config();
import { MailAccount } from "./mail";
import { loadEnv } from "./envLoader";

console.log(process.env.NOTION_TOKEN);
const configuration = loadEnv();

const mail = new MailAccount(configuration);
mail.connect();
mail.readNewMessages();
