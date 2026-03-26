/**
 * update-content.ts
 *
 * Updates all Sanity content according to Alan's specifications.
 * Covers: hero text, service descriptions, and portfolio items.
 *
 * Usage:
 *   npx tsx scripts/update-content.ts              # dry run (default)
 *   npx tsx scripts/update-content.ts --execute     # actually write to Sanity
 *
 * Required env vars (from your .env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET
 *   SANITY_API_WRITE_TOKEN          # needs editor/admin permissions
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const DRY_RUN = !process.argv.includes("--execute");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-10-31",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

// ─── HERO & SITE SETTINGS ────────────────────────────────────────────────────

async function updateSiteSettings() {
  console.log("\n📝 Updating Site Settings (hero text)...");

  const settings = await client.fetch(`*[_type == "siteSettings"][0]{_id}`);
  if (!settings) {
    console.log("  ❌ No siteSettings document found. Create one in the studio first.");
    return;
  }

  const patch = {
    heroTitle: "Cinematic Vision — Enhanced by AI",
    heroSubtitle:
      "Film, photography, motion and sound — crafting stories that connect",
  };

  console.log(`  _id: ${settings._id}`);
  console.log(`  heroTitle → "${patch.heroTitle}"`);
  console.log(`  heroSubtitle → "${patch.heroSubtitle}"`);

  if (!DRY_RUN) {
    await client.patch(settings._id).set(patch).commit();
    console.log("  ✅ Site settings updated.");
  } else {
    console.log("  🔍 Dry run — no changes written.");
  }
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────

const SERVICE_UPDATES: Record<string, { title: string; description: string }> =
  {
    // Keys are matched against existing service titles (case-insensitive contains)
    "ai video": {
      title: "AI Video Production",
      description:
        "Vision to Cinema: Directing high-end generative AI workflows from prompt to post, taking your concept to final render.",
    },
    "film": {
      title: "Film & Video",
      description:
        "Cinema-grade production, commercial campaigns, and social content. Complete execution, from script to screen.",
    },
    "drone": {
      title: "Drone and Aerial",
      description:
        "Professional aerial filming for cinematic landscapes, events, and property.",
    },
    "3d": {
      title: "3D Animation",
      description:
        "Elevate your brand with 3D modeling, dynamic motion graphics, and seamless visual effects.",
    },
    "screen": {
      title: "Screenwriting",
      description:
        "Professional screenwriter specializing in industry-standard scripts — from initial concept to production-ready pages, with structure and theme.",
    },
    "sound": {
      title: "Sound and Music",
      description:
        "High-impact composition and sound design. Signature atmospheric textures and professional scores to elevate brand storytelling and captivate audiences in film, digital and video.",
    },
  };

// Alan's preferred mobile order (also works as overall display order)
const SERVICE_ORDER: string[] = [
  "AI Video Production",
  "Film & Video",
  "Sound and Music",
  "3D Animation",
  "Drone and Aerial",
  "Screenwriting",
];

async function updateServices() {
  console.log("\n📝 Updating Services...");

  const services: Array<{ _id: string; title: string }> = await client.fetch(
    `*[_type == "service"]{_id, title}`
  );

  if (services.length === 0) {
    console.log("  ❌ No services found in Sanity.");
    return;
  }

  console.log(`  Found ${services.length} existing services.`);

  for (const service of services) {
    const matchKey = Object.keys(SERVICE_UPDATES).find((key) =>
      service.title.toLowerCase().includes(key)
    );

    if (!matchKey) {
      console.log(`  ⚠️  No match for "${service.title}" — skipping.`);
      continue;
    }

    const update = SERVICE_UPDATES[matchKey];
    const orderIndex = SERVICE_ORDER.indexOf(update.title);
    const order = orderIndex >= 0 ? orderIndex + 1 : 99;

    console.log(`  ${service.title} → "${update.title}" (order: ${order})`);
    console.log(`    description: "${update.description.slice(0, 60)}..."`);

    if (!DRY_RUN) {
      await client
        .patch(service._id)
        .set({
          title: update.title,
          description: update.description,
          order,
        })
        .commit();
      console.log(`    ✅ Updated.`);
    }
  }

  if (DRY_RUN) console.log("  🔍 Dry run — no changes written.");
}

// ─── PORTFOLIO ITEMS ──────────────────────────────────────────────────────────

const PORTFOLIO_ITEMS = [
  {
    title: "National Trust Birling Gap Loop",
    slug: "national-trust-birling-gap-loop",
    category: "Aerial",
    vimeoUrl: "https://vimeo.com/805099483",
    order: 1,
    featured: true, // first item spans full width
  },
  {
    title: "Storybook Waves",
    slug: "storybook-waves",
    category: "AI Video",
    vimeoUrl: "https://vimeo.com/1169342399",
    order: 2,
    featured: false,
  },
  {
    title: "Look Up",
    slug: "look-up",
    category: "AI Video",
    vimeoUrl: "https://vimeo.com/1165041768",
    order: 3,
    featured: false,
  },
  {
    title: "Spacestation",
    slug: "spacestation",
    category: "Animation",
    vimeoUrl: "https://vimeo.com/7851544",
    order: 4,
    featured: false,
  },
  {
    title: "The Briefcase Title Sequence",
    slug: "the-briefcase-title-sequence",
    category: "Animation",
    vimeoUrl: "https://vimeo.com/907204049",
    order: 5,
    featured: false,
  },
  {
    title: "The Briefcase Trailer",
    slug: "the-briefcase-trailer",
    category: "Other", // "Narrative" — update schema first or use "Other"
    vimeoUrl: "https://vimeo.com/1113761104",
    order: 6,
    featured: false,
  },
  {
    title: "Brighton Pride Awareness Campaign",
    slug: "brighton-pride-awareness-campaign",
    category: "Other", // "Motion Graphics" — update schema first or use "Other"
    vimeoUrl: "https://vimeo.com/280653206",
    order: 7,
    featured: false,
  },
];

async function updatePortfolio() {
  console.log("\n📝 Updating Portfolio Items...");

  const existing: Array<{ _id: string; title: string; vimeoUrl?: string }> =
    await client.fetch(`*[_type == "portfolioItem"]{_id, title, vimeoUrl}`);

  console.log(`  Found ${existing.length} existing portfolio items.`);

  for (const item of PORTFOLIO_ITEMS) {
    // Try to match by vimeo URL or title
    const match = existing.find(
      (e) =>
        (e.vimeoUrl && e.vimeoUrl.includes(item.vimeoUrl.split("/").pop()!)) ||
        e.title.toLowerCase() === item.title.toLowerCase()
    );

    const doc = {
      _type: "portfolioItem" as const,
      title: item.title,
      slug: { _type: "slug" as const, current: item.slug },
      category: item.category,
      vimeoUrl: item.vimeoUrl,
      order: item.order,
      featured: item.featured,
    };

    if (match) {
      console.log(`  🔄 Update existing: "${item.title}" (${match._id})`);
      if (!DRY_RUN) {
        await client.patch(match._id).set(doc).commit();
        console.log(`    ✅ Updated.`);
      }
    } else {
      console.log(`  ➕ Create new: "${item.title}"`);
      if (!DRY_RUN) {
        const created = await client.create(doc);
        console.log(`    ✅ Created: ${created._id}`);
      }
    }
  }

  // Optionally unpublish/remove old portfolio items not in the new list
  const newVimeoIds = PORTFOLIO_ITEMS.map((i) => i.vimeoUrl);
  const toRemove = existing.filter(
    (e) => !newVimeoIds.some((url) => e.vimeoUrl?.includes(url.split("/").pop()!))
  );

  if (toRemove.length > 0) {
    console.log(`\n  🗑️  ${toRemove.length} old items not in new list:`);
    for (const old of toRemove) {
      console.log(`    - "${old.title}" (${old._id})`);
    }
    console.log(
      "  ℹ️  These are NOT auto-deleted. Remove them manually in the studio if desired."
    );
  }

  if (DRY_RUN) console.log("  🔍 Dry run — no changes written.");
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════");
  console.log("  Alan Cross Portfolio — Content Update");
  console.log(`  Mode: ${DRY_RUN ? "🔍 DRY RUN" : "🚀 EXECUTE"}`);
  console.log(`  Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`  Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
  console.log("═══════════════════════════════════════════");

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error(
      "\n❌ SANITY_API_WRITE_TOKEN is required. Add it to .env.local.\n" +
        "   Create one at: https://www.sanity.io/manage → API → Tokens → Add token (Editor role)\n"
    );
    process.exit(1);
  }

  await updateSiteSettings();
  await updateServices();
  await updatePortfolio();

  console.log("\n═══════════════════════════════════════════");
  if (DRY_RUN) {
    console.log("  ✅ Dry run complete. Run with --execute to apply changes.");
  } else {
    console.log("  ✅ All updates applied!");
  }
  console.log("═══════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
