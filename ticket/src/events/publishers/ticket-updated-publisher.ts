import { TicketUpdateEvent, Subjects, Publisher } from "@haticket/common20";

export class TicketUpdatedPublisher extends Publisher<TicketUpdateEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
