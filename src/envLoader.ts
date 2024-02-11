export interface NotionConfiguratation {
  notionToken: string;
  notionDatabaseId: string;
}

export interface SMPTConfiguration {
  host: string;
  port: number;
  user: string;
  pass: string;
}

interface Configuration extends NotionConfiguratation, SMPTConfiguration {}

export const loadEnv = (): Configuration => {
  const notionToken = process.env.NOTION_TOKEN;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!notionToken || !notionDatabaseId || !host || !port || !user || !pass) {
    throw new Error("Invalid configuration");
  }

  return {
    notionToken,
    notionDatabaseId,
    host,
    port: parseInt(port),
    user,
    pass,
  };
};
