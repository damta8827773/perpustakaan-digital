# Kebijakan akses role-based. Bahasa: Rego (Open Policy Agent).
package perpus.authz

default allow := false

allow if {
	input.role == "admin"
}

allow if {
	input.role == "student"
	input.action in {"read_book", "borrow_book", "read_ebook"}
}
