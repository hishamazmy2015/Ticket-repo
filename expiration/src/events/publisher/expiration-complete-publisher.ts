import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@haticket/common20";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  
}
