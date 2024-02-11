import Imap from "imap";
import { SMPTConfiguration } from "./envLoader";

interface Mail {
  sender: string;
  subject: string;
  body: string;
}

export class MailAccount {
  private imap: Imap;

  constructor(configuration: SMPTConfiguration) {
    this.imap = new Imap({
      user: configuration.user,
      password: configuration.pass,
      host: configuration.host,
      port: configuration.port,
      tls: true,
    });
  }

  public connect() {
    this.imap.connect();
  }

  public disconnect() {
    this.imap.end();
  }

  public readNewMessages() {
    this.imap.once("ready", () => {
      this.imap.openBox("INBOX", false, (err, box) => {
        if (err) {
          throw new Error("Error opening mailbox");
        }

        const searchCriteria = ["UNSEEN"];
        // const fetchOptions = {
        //   bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)"],
        //   struct: true,
        // };

        this.imap.search(searchCriteria, (err, results) => {
          if (err) {
            throw new Error("Error searching for new messages");
          }

          const fetch = this.imap.fetch(results, { bodies: "" });
          fetch.on("message", (msg, seqno) => {
            msg.on("body", (stream, info) => {
              let buffer = "";
              stream.on("data", (chunk) => {
                buffer += chunk.toString("utf8");
              });
              stream.once("end", () => {
                console.log(buffer);
              });
            });
          });
          fetch.once("end", () => {
            this.disconnect();
          });
        });
      });
    });

    this.imap.once("error", (_err: any) => {
      throw new Error("Error connecting to mailbox");
    });

    this.imap.once("end", () => {
      console.log("Connection ended");
    });
  }
}
