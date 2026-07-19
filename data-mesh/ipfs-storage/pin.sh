#!/usr/bin/env bash
# Pin arsip e-book terdesentralisasi ke IPFS. Bahasa: Bash.
set -euo pipefail

CID="${1:?usage: pin.sh <cid>}"
ipfs pin add "$CID"
echo "pinned $CID"
