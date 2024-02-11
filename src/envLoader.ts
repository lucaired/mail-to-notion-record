import keytar from "keytar";
export interface NotionConfiguratation {
  notionToken: string;
  notionDatabaseId: string;
}

export interface SMPTConfiguration {
  mailService: string;
  host: string;
  port: number;
  user: string;
  pass: string;
}

interface Configuration extends NotionConfiguratation, SMPTConfiguration {}

async function getPassword(service: string, account: string): Promise<string> {
  const password = await keytar.getPassword(service, account);
  if (!password) {
    throw new Error(`Password not found for ${service}:${account}`);
  }
  return password;
}

export const loadConfiguration = async (): Promise<Configuration> => {
  const notionToken = process.env.NOTION_TOKEN;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;
  const mailService = process.env.MAIL_SERVICE;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;

  if (
    !notionToken ||
    !notionDatabaseId ||
    !host ||
    !port ||
    !user ||
    !mailService
  ) {
    throw new Error("Invalid configuration");
  }

  const pass = await getPassword(mailService, user);

  return {
    notionToken,
    notionDatabaseId,
    mailService,
    host,
    port: parseInt(port),
    user,
    pass,
  };
};
