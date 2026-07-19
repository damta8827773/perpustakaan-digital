// Binding Emscripten untuk renderer DRM (C -> WebAssembly). Bahasa: C++.
#include <cstdint>
#include <string>
#include <vector>

extern "C" void xor_stream(uint8_t *, size_t, const uint8_t *, size_t);

std::vector<uint8_t> decrypt_page(std::vector<uint8_t> page, const std::string &key) {
    xor_stream(page.data(), page.size(),
               reinterpret_cast<const uint8_t *>(key.data()), key.size());
    return page;
}
