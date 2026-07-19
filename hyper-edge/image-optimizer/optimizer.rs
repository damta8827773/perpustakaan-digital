//! Edge image optimizer: resize sampul buku secara real-time. Bahasa: Rust.
pub struct ResizeSpec {
    pub width: u32,
    pub quality: u8,
}

pub fn negotiate_format(accept: &str) -> &'static str {
    if accept.contains("image/avif") {
        "avif"
    } else if accept.contains("image/webp") {
        "webp"
    } else {
        "jpeg"
    }
}

pub fn clamp_spec(spec: ResizeSpec) -> ResizeSpec {
    ResizeSpec {
        width: spec.width.min(2048),
        quality: spec.quality.clamp(40, 90),
    }
}
