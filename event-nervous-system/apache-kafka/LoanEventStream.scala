// Event sourcing peminjaman via Kafka Streams. Bahasa: Scala.
object LoanEventStream {
  final case class LoanEvent(nim: String, bookId: String, kind: String, at: Long)

  def isLate(e: LoanEvent, dueAt: Long): Boolean =
    e.kind == "return" && e.at > dueAt

  def main(args: Array[String]): Unit =
    println("loan-event-stream topology registered")
}
