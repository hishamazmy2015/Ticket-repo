import { TicketCreatedEvent, Subjects, Publisher } from "@haticket/common20";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
