/* Dekripsi halaman e-book di dalam sandbox WebAssembly. Bahasa: C. */
#include <stdint.h>
#include <stddef.h>

void xor_stream(uint8_t *buf, size_t len, const uint8_t *key, size_t klen) {
    for (size_t i = 0; i < len; i++) {
        buf[i] ^= key[i % klen];
    }
}
