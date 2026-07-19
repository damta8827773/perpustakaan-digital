/* Primitif DRM level rendah untuk lisensi e-book. Bahasa: C. */
#include <stdint.h>

uint32_t license_checksum(const uint8_t *license, uint32_t len) {
    uint32_t sum = 0x811c9dc5u;
    for (uint32_t i = 0; i < len; i++) {
        sum = (sum ^ license[i]) * 0x01000193u;
    }
    return sum;
}
