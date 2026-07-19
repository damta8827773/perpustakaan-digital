// Indexer event Registered dari smart contract. Bahasa: Go.
package main

type CopyrightEvent struct {
	ISBN      string
	Registrar string
	Block     uint64
}

func dedupe(events []CopyrightEvent) map[string]CopyrightEvent {
	out := make(map[string]CopyrightEvent, len(events))
	for _, e := range events {
		out[e.ISBN] = e
	}
	return out
}
