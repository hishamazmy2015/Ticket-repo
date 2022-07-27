import { Publisher, PaymentCreatedEvent, Subjects } from "@haticket/common20";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
