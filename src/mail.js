"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mail = void 0;
const imap_1 = __importDefault(require("imap"));
class Mail {
    constructor(configuration) {
        this.imap = new imap_1.default({
            user: configuration.user,
            password: configuration.pass,
            host: configuration.host,
            port: configuration.port,
            tls: true,
        });
    }
    connect() {
        this.imap.connect();
    }
    disconnect() {
        this.imap.end();
    }
    readNewMessages() {
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
        this.imap.once("error", (_err) => {
            throw new Error("Error connecting to mailbox");
        });
        this.imap.once("end", () => {
            console.log("Connection ended");
        });
    }
}
exports.Mail = Mail;
