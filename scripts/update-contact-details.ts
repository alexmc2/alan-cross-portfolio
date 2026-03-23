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

type ContactDetail = {
  _id: string;
  label: string;
  detailType: string;
  value: string;
  linkUrl?: string | null;
  order?: number | null;
};

const CONTACT_UPDATES = [
  {
    label: "Facebook",
    detailType: "social",
    value: "facebook.com/alanxcross",
    linkUrl: "https://www.facebook.com/alanxcross",
  },
  {
    label: "Instagram",
    detailType: "social",
    value: "instagram.com/alanxaiuk",
    linkUrl: "https://www.instagram.com/alanxaiuk",
  },
  {
    label: "YouTube",
    detailType: "social",
    value: "youtube.com/@alanxuk",
    linkUrl: "https://www.youtube.com/@alanxuk",
  },
] as const;

async function updateContactDetails() {
  console.log("===========================================");
  console.log("Alan Cross Portfolio - Contact Detail Update");
  console.log(`Mode: ${DRY_RUN ? "DRY RUN" : "EXECUTE"}`);
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log("===========================================");
  console.log("");
  console.log("Updating contact details...");

  const existing = await client.fetch<ContactDetail[]>(
    '*[_type == "contactDetail"]{_id, label, detailType, value, linkUrl, order}'
  );

  for (const update of CONTACT_UPDATES) {
    const match = existing.find(
      (detail) => detail.label.toLowerCase() === update.label.toLowerCase()
    );

    const doc = {
      _type: "contactDetail" as const,
      label: update.label,
      detailType: update.detailType,
      value: update.value,
      linkUrl: update.linkUrl,
      ...(match?.order != null ? { order: match.order } : {}),
    };

    if (match) {
      console.log(`  Update existing: "${update.label}" (${match._id})`);
      console.log(`    value: "${match.value}" -> "${update.value}"`);
      console.log(`    linkUrl: "${match.linkUrl ?? ""}" -> "${update.linkUrl}"`);

      if (DRY_RUN) {
        continue;
      }

      await client.patch(match._id).set(doc).commit();
      console.log("    Updated.");
      continue;
    }

    console.log(`  Create new: "${update.label}"`);
    console.log(`    value: "${update.value}"`);
    console.log(`    linkUrl: "${update.linkUrl}"`);

    if (DRY_RUN) {
      continue;
    }

    const created = await client.create(doc);
    console.log(`    Created: ${created._id}`);
  }

  console.log("");
  console.log("===========================================");
  console.log(
    DRY_RUN
      ? "Dry run complete. Run with --execute to apply changes."
      : "Contact detail updates applied."
  );
  console.log("===========================================");
}

updateContactDetails().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
