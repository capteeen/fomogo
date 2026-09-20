# FOMOGO

Pump.fun launchpad that routes creator fees to `@handles`. Tagline: *where launches become paydays.*

**Not affiliated with FOMO Labs, fomo.family, or fomo.claims.** Visual language is inspired by that cosmic void/indigo system; the product mark is the attached **GO infinity logo**, not the FOMO interlocking logo.

## Stack

- Next.js App Router + TypeScript + Tailwind v4
- Solana wallet adapter (Wallet Standard / Phantom etc.)
- `@pump-fun/pump-sdk` on **devnet**
- Aeonik + JetBrains Mono in `/public/fonts`
- Higgsfield-generated hero in `/public/hero`, brand in `/public/brand`

## Run

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Env | Purpose |
|-----|---------|
| `NEXT_PUBLIC_SOLANA_CLUSTER` | `devnet` (default) |
| `NEXT_PUBLIC_SOLANA_RPC` | RPC URL |
| `FOMOGO_FEE_PAYER` | optional base58 secret for a future gasless claim relayer |

## Product routes

| Route | What |
|-------|------|
| `/` | Landing |
| `/app/launch` | `createV2` on pump + metadata |
| `/app/route` | `create_fee_sharing_config` then `update_fee_shares_v2` (≤10 handles, bps = 10_000, one-shot) |
| `/app/migrate` | Same sharing flow for an existing mint (creator signature) |
| `/app/claim` | `distribute_creator_fees_v2` (permissionless) |
| `/app/feed` | Launch feed |
| `/app/leaderboard` | Fee legends |
| `/app/alerts` | Fee alerts |
| `/app/account` | Link `@handle` → wallet via message signature |

Handle resolution lives in `data/handles.json` (created at runtime). Unlinked handles fall back to the connected creator wallet so a launch can still complete.

## Pump fee sharing

Authoritative docs: [CREATOR_FEE_SHARING.md](https://github.com/pump-fun/pump-public-docs/blob/main/docs/instructions/CREATOR_FEE_SHARING.md) (local copy in `docs/`).

Lifecycle used by FOMOGO:

1. `create_fee_sharing_config` — opt the coin in (initial shareholder = creator @ 10_000 bps)
2. `update_fee_shares_v2` — set the handle-resolved wallets; **admin is revoked after**
3. `transfer_creator_fees_to_pump_v2` — AMM sweep when graduated (permissionless)
4. `distribute_creator_fees_v2` — pay shareholders (permissionless)

FOMOGO routing fee is **0%** (disclosed on the landing). Pump creator fee remains 0.30% of volume.

Token metadata URI is served from `/metadata/<mint>.json`. Pump's metadata fetch needs a publicly reachable URL — use a tunnel or deploy before expecting metadata to render on pump.fun itself.

## Brand / Higgsfield

- Canonical mark: white fused **G+O** infinity (`/public/brand/logo-primary.png`)
- Hero: original cosmic stills (`space-bg.webp`, `astronaut.webp`, orbits) — not FOMO production files
- Kit screenshots stay off the live site; they were layout/color refs only

Aeonik is a commercial face included here as a visual-match font from the public landings. License it for production or swap to Inter with tracking `-0.05em`.

## Risk

Memecoins can go to zero. Nothing here is financial advice. Username routing is not a custody product — shareholders are Solana addresses resolved from handles.
