// app/api/sanity/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { parseBody } from 'next-sanity/webhook';

// This route handles Sanity webhook events and forces cache invalidation.
// It complements <SanityLive /> so updates never get stuck in production.

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    const { body, isValidSignature } = await parseBody(request, secret);

    if (secret && isValidSignature === false) {
      return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 });
    }

    if (!body) {
      return NextResponse.json({ ok: false, error: 'Missing body' }, { status: 400 });
    }

    // Heavy-hammer: invalidate all Sanity-tagged caches
    // All queries using `sanityFetch` include the `sanity` tag.
    revalidateTag('sanity', 'max');
    // Also invalidate the sync-tags shim so the next request refreshes computed tags
    revalidateTag('sanity:fetch-sync-tags', 'max');

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Failed to handle Sanity revalidate webhook', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
