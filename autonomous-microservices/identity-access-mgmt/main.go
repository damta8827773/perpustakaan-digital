// Wrapper Firebase Auth + penegakan kebijakan OPA. Bahasa: Go.
package main

import (
	"log"
	"net/http"
)

func healthz(w http.ResponseWriter, _ *http.Request) {
	w.WriteHeader(http.StatusOK)
	if _, err := w.Write([]byte("ok")); err != nil {
		log.Println("write:", err)
	}
}

func main() {
	http.HandleFunc("/healthz", healthz)
	log.Println("identity-access-mgmt listening on :8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
