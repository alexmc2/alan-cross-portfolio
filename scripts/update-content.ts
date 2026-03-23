import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const DRY_RUN = !process.argv.includes("--execute");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${name} is required in .env.local.`);
  }

  return value;
}

const client = createClient({
  projectId: requireEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", projectId),
  dataset: requireEnv("NEXT_PUBLIC_SANITY_DATASET", dataset),
  apiVersion: "2024-10-31",
  token: requireEnv("SANITY_API_WRITE_TOKEN", token),
  useCdn: false,
});

type ServiceUpdate = {
  title: string;
  description: string;
};

type ServiceDocument = {
  _id: string;
  title: string;
};

type PortfolioDocument = {
  _id: string;
  title: string;
  vimeoUrl?: string;
};

const SERVICE_UPDATES: Record<string, ServiceUpdate> = {
  "ai video": {
    title: "AI Video Production",
    description:
      "Vision to Cinema: Directing high-end generative AI workflows from prompt to post, taking your concept to final render.",
  },
  film: {
    title: "Film & Video",
    description:
      "Cinema-grade production, commercial campaigns, and social content. Complete execution, from script to screen.",
  },
  drone: {
    title: "Drone and Aerial",
    description:
      "Professional aerial filming for cinematic landscapes, events, and property.",
  },
  "3d": {
    title: "3D Animation",
    description:
      "Elevate your brand with 3D modeling, dynamic motion graphics, and seamless visual effects.",
  },
  screen: {
    title: "Screenwriting",
    description:
      "Professional screenwriter specializing in industry-standard scripts from initial concept to production-ready pages, with structure and theme.",
  },
  sound: {
    title: "Sound and Music",
    description:
      "High-impact composition and sound design. Signature atmospheric textures and professional scores to elevate brand storytelling and captivate audiences in film, digital and video.",
  },
};

const SERVICE_ORDER = [
  "AI Video Production",
  "Film & Video",
  "Sound and Music",
  "3D Animation",
  "Drone and Aerial",
  "Screenwriting",
];

const PORTFOLIO_ITEMS = [
  {
    title: "National Trust Birling Gap Loop",
    slug: "national-trust-birling-gap-loop",
    category: "Aerial",
    vimeoUrl: "https://vimeo.com/805099483",
    order: 1,
    featured: true,
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
    category: "Narrative",
    vimeoUrl: "https://vimeo.com/1113761104",
    order: 6,
    featured: false,
  },
  {
    title: "Brighton Pride Awareness Campaign",
    slug: "brighton-pride-awareness-campaign",
    category: "Motion Graphics",
    vimeoUrl: "https://vimeo.com/280653206",
    order: 7,
    featured: false,
  },
] as const;

async function updateSiteSettings() {
  console.log("");
  console.log("Updating site settings...");

  const settings = await client.fetch<{ _id: string } | null>(
    '*[_type == "siteSettings"][0]{_id}'
  );

  if (!settings) {
    console.log("  No siteSettings document found. Create one in Studio first.");
    return;
  }

  const patch = {
    heroTitle: "Cinematic Vision - Enhanced by AI",
    heroSubtitle:
      "Film, photography, motion and sound - crafting stories that connect",
  };

  console.log(`  _id: ${settings._id}`);
  console.log(`  heroTitle -> "${patch.heroTitle}"`);
  console.log(`  heroSubtitle -> "${patch.heroSubtitle}"`);

  if (DRY_RUN) {
    console.log("  Dry run - no changes written.");
    return;
  }

  await client.patch(settings._id).set(patch).commit();
  console.log("  Site settings updated.");
}

async function updateServices() {
  console.log("");
  console.log("Updating services...");

  const services = await client.fetch<ServiceDocument[]>(
    '*[_type == "service"]{_id, title}'
  );

  if (services.length === 0) {
    console.log("  No services found in Sanity.");
    return;
  }

  console.log(`  Found ${services.length} existing services.`);

  for (const service of services) {
    const matchKey = Object.keys(SERVICE_UPDATES).find((key) =>
      service.title.toLowerCase().includes(key)
    );

    if (!matchKey) {
      console.log(`  No match for "${service.title}" - skipping.`);
      continue;
    }

    const update = SERVICE_UPDATES[matchKey];
    const orderIndex = SERVICE_ORDER.indexOf(update.title);
    const order = orderIndex >= 0 ? orderIndex + 1 : 99;

    console.log(`  ${service.title} -> "${update.title}" (order: ${order})`);
    console.log(`    description: "${update.description.slice(0, 60)}..."`);

    if (DRY_RUN) {
      continue;
    }

    await client
      .patch(service._id)
      .set({
        title: update.title,
        description: update.description,
        order,
      })
      .commit();

    console.log("    Updated.");
  }

  if (DRY_RUN) {
    console.log("  Dry run - no changes written.");
  }
}

async function updatePortfolio() {
  console.log("");
  console.log("Updating portfolio items...");

  const existing = await client.fetch<PortfolioDocument[]>(
    '*[_type == "portfolioItem"]{_id, title, vimeoUrl}'
  );

  console.log(`  Found ${existing.length} existing portfolio items.`);

  for (const item of PORTFOLIO_ITEMS) {
    const vimeoId = item.vimeoUrl.split("/").pop();
    const match = existing.find(
      (entry) =>
        (entry.vimeoUrl && vimeoId && entry.vimeoUrl.includes(vimeoId)) ||
        entry.title.toLowerCase() === item.title.toLowerCase()
    );

    const doc = {
      _type: "portfolioItem" as const,
      title: item.title,
      slug: {
        _type: "slug" as const,
        current: item.slug,
      },
      category: item.category,
      vimeoUrl: item.vimeoUrl,
      order: item.order,
      featured: item.featured,
    };

    if (match) {
      console.log(`  Update existing: "${item.title}" (${match._id})`);

      if (DRY_RUN) {
        continue;
      }

      await client.patch(match._id).set(doc).commit();
      console.log("    Updated.");
      continue;
    }

    console.log(`  Create new: "${item.title}"`);

    if (DRY_RUN) {
      continue;
    }

    const created = await client.create(doc);
    console.log(`    Created: ${created._id}`);
  }

  const newVimeoUrls = PORTFOLIO_ITEMS.map((item) => item.vimeoUrl);
  const toRemove = existing.filter(
    (entry) =>
      !newVimeoUrls.some((url) => {
        const vimeoId = url.split("/").pop();
        return Boolean(entry.vimeoUrl && vimeoId && entry.vimeoUrl.includes(vimeoId));
      })
  );

  if (toRemove.length > 0) {
    console.log("");
    console.log(`  ${toRemove.length} old items are not in the new list:`);

    for (const oldItem of toRemove) {
      console.log(`    - "${oldItem.title}" (${oldItem._id})`);
    }

    console.log("  These are not auto-deleted. Remove them manually in Studio if needed.");
  }

  if (DRY_RUN) {
    console.log("  Dry run - no changes written.");
  }
}

async function main() {
  console.log("===========================================");
  console.log("Alan Cross Portfolio - Content Update");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "EXECUTE"}`);
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log("===========================================");

  await updateSiteSettings();
  await updateServices();
  await updatePortfolio();

  console.log("");
  console.log("===========================================");
  console.log(
    DRY_RUN
      ? "Dry run complete. Run with --execute to apply changes."
      : "All updates applied."
  );
  console.log("===========================================");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
