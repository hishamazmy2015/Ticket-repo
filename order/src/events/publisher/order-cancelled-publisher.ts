import { Publisher, Subjects, OrderCancelledEvent } from "@haticket/common20";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
