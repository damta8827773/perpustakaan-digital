//! Lapisan enkripsi DRM (arsitektur siap post-quantum). Bahasa: Rust.
pub const KEY_BYTES: usize = 32;

pub fn derive_session_key(master: &[u8; KEY_BYTES], nonce: u64) -> [u8; KEY_BYTES] {
    let mut out = *master;
    for (i, b) in out.iter_mut().enumerate() {
        *b ^= nonce.rotate_left((i % 64) as u32).to_le_bytes()[i % 8];
    }
    out
}
