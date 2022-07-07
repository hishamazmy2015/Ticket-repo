import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";
interface Event {
  subject: Subjects;
  data: any;
}
export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }
  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(
        "------------------------ JSON.stringify(data) ------------------------ ",
        typeof data
      );
      this.client.publish(
        this.subject,
        typeof data === "string" ? JSON.parse(data) : JSON.stringify(data),
        (err) => {
          if (err) return reject(err);
          console.log("Event published to subject > ", this.subject);
          resolve();
        }
      );
    });
  }
}
// JSON.parse(data.toString("utf8"))
