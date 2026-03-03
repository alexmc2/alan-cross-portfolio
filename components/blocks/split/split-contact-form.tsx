// components/blocks/split/split-contact-form.tsx
import ContactForm from "@/components/blocks/forms/contact-form";
import type { PAGE_QUERYResult } from "@/sanity.types";

type Block = NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number];
type SplitRow = Extract<Block, { _type: "split-row" }>;
type SplitContactFormColumn = Extract<
  NonNullable<SplitRow["splitColumns"]>[number],
  { _type: "split-contact-form" }
>;

export default function SplitContactForm(column: SplitContactFormColumn) {
  return (
    <ContactForm
      _type="form-contact"
      _key={column._key}
      heading={column.heading}
      body={column.body}
      formspreeFormId={column.formspreeFormId}
      submitButtonLabel={column.submitButtonLabel}
      successMessage={column.successMessage}
      padding={null}
      colorVariant={null}
      layout="inline"
    />
  );
}
