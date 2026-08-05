import { getCliClient } from "sanity/cli";
import {
  countNonBreakingSpaces,
  normalizePortableTextWhitespace,
} from "../lib/portable-text-whitespace";

const API_VERSION = "2024-10-31";
const APPLY_CHANGES = process.argv.includes("--apply");

type PortableTextValue = Array<Record<string, unknown>>;

type ContentDocument = {
  _id: string;
  _rev: string;
  _type: string;
  title?: string;
  body?: PortableTextValue;
  aboutBody?: PortableTextValue;
};

type NormalizedDocument = ContentDocument & {
  replacements: number;
  updates: Partial<Pick<ContentDocument, "body" | "aboutBody">>;
};

const client = getCliClient({ apiVersion: API_VERSION }).withConfig({
  perspective: "raw",
  useCdn: false,
});

async function main() {
  const documents = await client.fetch<ContentDocument[]>(
    '*[defined(body) || defined(aboutBody)]{_id, _rev, _type, title, body, aboutBody}',
    {},
    { perspective: "raw" }
  );

  const affectedDocuments = documents
    .map<NormalizedDocument>((document) => {
      const bodyReplacements = countNonBreakingSpaces(document.body);
      const aboutBodyReplacements = countNonBreakingSpaces(document.aboutBody);
      const updates: NormalizedDocument["updates"] = {};

      if (bodyReplacements > 0 && document.body) {
        updates.body = normalizePortableTextWhitespace(document.body);
      }

      if (aboutBodyReplacements > 0 && document.aboutBody) {
        updates.aboutBody = normalizePortableTextWhitespace(document.aboutBody);
      }

      return {
        ...document,
        replacements: bodyReplacements + aboutBodyReplacements,
        updates,
      };
    })
    .filter((document) => document.replacements > 0);

  console.log(
    JSON.stringify(
      {
        mode: APPLY_CHANGES ? "apply" : "dry-run",
        documentsScanned: documents.length,
        affectedDocuments: affectedDocuments.map((document) => ({
          _id: document._id,
          _type: document._type,
          title: document.title,
          replacements: document.replacements,
        })),
      },
      null,
      2
    )
  );

  if (!APPLY_CHANGES || affectedDocuments.length === 0) {
    return;
  }

  const transaction = affectedDocuments.reduce(
    (currentTransaction, document) =>
      currentTransaction.patch(document._id, (patch) =>
        patch.ifRevisionId(document._rev).set(document.updates)
      ),
    client.transaction()
  );

  await transaction.commit({ visibility: "sync" });

  console.log(
    `Normalized ${affectedDocuments.reduce(
      (total, document) => total + document.replacements,
      0
    )} spaces across ${affectedDocuments.length} documents.`
  );
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
