// app/api/sanity/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';

// This route handles Sanity webhook events and forces cache invalidation.
// It complements <SanityLive /> so updates never get stuck in production.

type SanityWebhookBody = {
  _id?: string;
  _type?: string;
  _rev?: string;
};

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    const { body, isValidSignature } = await parseBody<SanityWebhookBody>(request, secret);

    if (secret && isValidSignature === false) {
      return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 });
    }

    if (!body) {
      return NextResponse.json({ ok: false, error: 'Missing body' }, { status: 400 });
    }

    // Use immediate expiration for webhooks so the next request blocks for fresh data
    // instead of serving stale content once and revalidating in the background.
    revalidateTag('sanity', { expire: 0 });
    revalidateTag('sanity:fetch-sync-tags', { expire: 0 });

    console.info('Sanity webhook revalidated cache tags', {
      documentId: body._id ?? null,
      documentType: body._type ?? null,
      revision: body._rev ?? null,
    });

    return NextResponse.json({
      ok: true,
      revalidated: ['sanity', 'sanity:fetch-sync-tags'],
      documentId: body._id ?? null,
      documentType: body._type ?? null,
    });
  } catch (err) {
    console.error('Failed to handle Sanity revalidate webhook', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
