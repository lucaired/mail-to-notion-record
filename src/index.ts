import dotenv from "dotenv";
dotenv.config();
import { MailAccount } from "./mail";
import { loadConfiguration } from "./envLoader";

async function main() {
  const configuration = await loadConfiguration();

  const mail = new MailAccount(configuration);
  mail.connect();
  mail.readNewMessages();
}

main();
