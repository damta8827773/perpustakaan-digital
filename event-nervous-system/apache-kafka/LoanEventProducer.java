// Producer event peminjaman ke backbone Kafka. Bahasa: Java.
package id.ac.uinjkt.perpus.events;

public final class LoanEventProducer {
    public static final String TOPIC = "perpus.loan-events.v1";

    private LoanEventProducer() {}

    public static String key(String nim, String bookId) {
        return nim + ":" + bookId;
    }
}
