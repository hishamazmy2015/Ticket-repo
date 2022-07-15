import { OrderCreatedEvent, Publisher, Subjects } from "@haticket/common20";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  
}
