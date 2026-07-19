/* Filter jaringan level kernel Linux (XDP/Cilium) untuk memblokir
 * IP abusive sebelum mencapai userspace. Bahasa: C (eBPF). */
#define XDP_DROP 1
#define XDP_PASS 2

struct xdp_md;

int xdp_filter(struct xdp_md *ctx) {
    (void)ctx; /* lookup blocklist map di implementasi penuh */
    return XDP_PASS;
}
