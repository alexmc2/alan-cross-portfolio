// components/blocks/forms/contact-map.tsx
'use client';
import { useCallback, useMemo } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Loader2 } from '@/lib/icons';
import { stegaClean } from 'next-sanity';

import SectionContainer from '@/components/ui/section-container';
import { Button } from '@/components/ui/button1';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormContactMap as SanityFormContactMap } from '@/sanity.types';

const GOOGLE_MAPS_EMBED_BASE = 'https://www.google.com/maps/embed/v1/place';

const contactFormSchema = z.object({
  name: z.string().min(1, {
    message: 'Please enter your name',
  }),
  email: z
    .string()
    .min(1, {
      message: 'Please enter your email',
    })
    .email({
      message: 'Please enter a valid email',
    }),
  message: z.string().min(1, {
    message: 'Please share a message',
  }),
});

export type FormContactMapBlock = SanityFormContactMap & { _key: string };

const cleanString = (value?: string | null) =>
  value ? stegaClean(value) : undefined;

export default function FormContactMap({
  padding,
  colorVariant,
  heading,
  body,
  formspreeFormId,
  submitButtonLabel,
  successMessage,
  locationName,
  address,
  latitude,
  longitude,
  mapZoom,
}: FormContactMapBlock) {
  const cleanedColor = colorVariant ? stegaClean(colorVariant) : undefined;
  const cleanedHeading = cleanString(heading) ?? 'Get in touch';
  const cleanedBody = cleanString(body);
  const cleanedLocationName = cleanString(locationName) ?? 'Our location';
  const cleanedAddress = cleanString(address);
  const cleanedFormId = cleanString(formspreeFormId);
  const cleanedSubmitLabel = cleanString(submitButtonLabel) ?? 'Send message';
  const cleanedSuccessMessage = cleanString(successMessage);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const { isSubmitting } = form.formState;

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const mapSrc = useMemo(() => {
    if (
      !googleMapsApiKey ||
      typeof latitude !== 'number' ||
      typeof longitude !== 'number'
    ) {
      return null;
    }

    const params = new URLSearchParams({
      key: googleMapsApiKey,
      q: `${latitude},${longitude}`,
    });

    if (mapZoom) {
      params.set('zoom', String(mapZoom));
    }

    return `${GOOGLE_MAPS_EMBED_BASE}?${params.toString()}`;
  }, [googleMapsApiKey, latitude, longitude, mapZoom]);

  const handleSubmit = useCallback(
    async (values: z.infer<typeof contactFormSchema>) => {
      if (!cleanedFormId) {
        toast.error('The contact form is not configured yet.');
        return;
      }

      try {
        const response = await fetch(
          `https://formspree.io/f/${cleanedFormId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(values),
          }
        );

        const result = await response.json();

        if (response.ok) {
          const message =
            cleanedSuccessMessage || 'Your message has been sent.';
          toast.success(message);
          form.reset();
        } else {
          toast.error(
            result?.errors?.[0]?.message ||
              'Something went wrong. Please try again.'
          );
        }
      } catch (error: any) {
        toast.error(error.message || 'Unable to send your message right now.');
      }
    },
    [cleanedFormId, cleanedSuccessMessage, form]
  );

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    await handleSubmit(values);
  }

  const hasMap = Boolean(mapSrc);

  return (
    <SectionContainer color={cleanedColor} padding={padding}>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
              {cleanedHeading}
            </h2>
            {cleanedBody && (
              <p className="text-muted-foreground whitespace-pre-line">
                {cleanedBody}
              </p>
            )}
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your name"
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="you@yourbusiness.co.uk"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        rows={5}
                        className="flex min-h-[140px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="How can we help?"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {cleanedSubmitLabel || 'Send message'}
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-6">
          <div className="rounded-lg border bg-background shadow-sm">
            {hasMap ? (
              <iframe
                title={cleanedLocationName || 'Map'}
                src={mapSrc ?? undefined}
                width="100%"
                height="320"
                loading="lazy"
                allowFullScreen
                className="h-[320px] w-full rounded-t-lg"
              />
            ) : (
              <div className="flex h-[320px] w-full items-center justify-center rounded-t-lg bg-muted text-center text-sm text-muted-foreground">
                Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to display an embedded
                map.
              </div>
            )}
            <div className="space-y-3 p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Our location
              </div>
              <div className="text-lg font-semibold text-foreground">
                {cleanedLocationName}
              </div>
              <p className="text-base whitespace-pre-line text-muted-foreground/90">
                {cleanedAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
