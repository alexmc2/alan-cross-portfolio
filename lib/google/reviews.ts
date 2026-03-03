// lib/google/reviews.ts

import { randomUUID } from "crypto";
import demoReviewsSource from "./demo-reviews.json";

const GOOGLE_PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";
const DEFAULT_REVIEW_LIMIT = 6;
const MAX_REVIEW_LIMIT = 10;

export type ReviewsSortOrder = "most_relevant" | "newest";
export type ReviewsDataSource = "google" | "demo";

export interface FetchGoogleReviewsOptions {
  placeId?: string | null;
  limit?: number | null;
  minimumRating?: number | null;
  sortOrder?: ReviewsSortOrder | null;
  languageCode?: string | null;
}

export interface GoogleReviewAuthor {
  name: string;
  profileUrl?: string;
  avatarUrl?: string;
}

export interface GoogleReview {
  id: string;
  rating: number;
  text?: string;
  languageCode?: string;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  author: GoogleReviewAuthor;
}

export interface GoogleReviewsResult {
  placeName?: string;
  averageRating?: number;
  userRatingCount?: number;
  reviews: GoogleReview[];
  source: ReviewsDataSource;
  error?: string;
}

interface GooglePlacesReviewPayload {
  name?: string;
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
}

interface GooglePlacesResponse {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  reviews?: GooglePlacesReviewPayload[];
}

interface DemoReviewPayload {
  id?: string;
  rating?: number;
  text?: string;
  languageCode?: string;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  author?: {
    name?: string;
    profileUrl?: string;
    avatarUrl?: string;
  };
}

interface DemoReviewsPayload {
  placeName?: string;
  averageRating?: number;
  userRatingCount?: number;
  reviews?: DemoReviewPayload[];
}

function parseMinimumRating(input?: number | null): number {
  if (!input || Number.isNaN(input)) return 0;
  return Math.min(Math.max(input, 0), 5);
}

function parseLimit(input?: number | null): number {
  if (!input || Number.isNaN(input)) return DEFAULT_REVIEW_LIMIT;
  return Math.min(Math.max(Math.floor(input), 1), MAX_REVIEW_LIMIT);
}

function parseSortOrder(input?: ReviewsSortOrder | null): ReviewsSortOrder {
  return input === "newest" ? "newest" : "most_relevant";
}

function normaliseRating(input?: number | null): number {
  if (typeof input !== "number" || Number.isNaN(input)) return 0;
  return Math.min(Math.max(input, 0), 5);
}

function publishTimeToEpoch(input?: string): number {
  if (!input) return 0;
  const parsed = Date.parse(input);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function applyReviewFilters(
  reviews: GoogleReview[],
  minimumRating: number,
  maxReviews: number,
  sortOrder: ReviewsSortOrder,
): GoogleReview[] {
  const sorted =
    sortOrder === "newest"
      ? [...reviews].sort(
          (a, b) => publishTimeToEpoch(b.publishTime) - publishTimeToEpoch(a.publishTime),
        )
      : reviews;

  return sorted
    .filter((review) => review.rating >= minimumRating)
    .slice(0, maxReviews);
}

function normaliseGoogleReview(payload: GooglePlacesReviewPayload): GoogleReview {
  const rating = normaliseRating(payload.rating);
  const id = payload.name ?? randomUUID();
  const text = payload.text?.text?.trim() || payload.originalText?.text?.trim();

  return {
    id,
    rating,
    text,
    languageCode: payload.text?.languageCode || payload.originalText?.languageCode,
    relativePublishTimeDescription: payload.relativePublishTimeDescription,
    publishTime: payload.publishTime,
    author: {
      name: payload.authorAttribution?.displayName || "Google reviewer",
      profileUrl: payload.authorAttribution?.uri,
      avatarUrl: payload.authorAttribution?.photoUri,
    },
  };
}

function normaliseDemoReview(payload: DemoReviewPayload, index: number): GoogleReview {
  return {
    id: payload.id || `demo-review-${index + 1}`,
    rating: normaliseRating(payload.rating),
    text: payload.text?.trim(),
    languageCode: payload.languageCode,
    relativePublishTimeDescription: payload.relativePublishTimeDescription,
    publishTime: payload.publishTime,
    author: {
      name: payload.author?.name?.trim() || "Google reviewer",
      profileUrl: payload.author?.profileUrl,
      avatarUrl: payload.author?.avatarUrl,
    },
  };
}

function buildDemoReviewsResult({
  limit,
  minimumRating,
  sortOrder,
}: FetchGoogleReviewsOptions): GoogleReviewsResult {
  const demoData = demoReviewsSource as DemoReviewsPayload;
  const minimumRatingValue = parseMinimumRating(minimumRating);
  const maxReviews = parseLimit(limit);
  const resolvedSortOrder = parseSortOrder(sortOrder);

  const allReviews = Array.isArray(demoData.reviews)
    ? demoData.reviews.map((review, index) => normaliseDemoReview(review, index))
    : [];

  const filteredReviews = applyReviewFilters(
    allReviews,
    minimumRatingValue,
    maxReviews,
    resolvedSortOrder,
  );

  const fallbackAverage =
    allReviews.length > 0
      ? Number(
          (allReviews.reduce((total, review) => total + review.rating, 0) / allReviews.length).toFixed(
            1,
          ),
        )
      : undefined;

  return {
    source: "demo",
    placeName: demoData.placeName,
    averageRating: demoData.averageRating ?? fallbackAverage,
    userRatingCount: demoData.userRatingCount ?? allReviews.length,
    reviews: filteredReviews,
  };
}

export async function fetchGoogleReviews({
  placeId,
  limit,
  minimumRating,
  sortOrder,
  languageCode,
}: FetchGoogleReviewsOptions): Promise<GoogleReviewsResult> {
  const resolvedSortOrder = parseSortOrder(sortOrder);
  const fallbackOptions: FetchGoogleReviewsOptions = {
    limit,
    minimumRating,
    sortOrder: resolvedSortOrder,
    languageCode,
  };

  // Default to local demo content unless explicitly switched to live Google data.
  if ((process.env.GOOGLE_REVIEWS_DATA_SOURCE ?? "demo").toLowerCase() !== "google") {
    return buildDemoReviewsResult(fallbackOptions);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const fallbackPlaceId = process.env.GOOGLE_PLACES_PLACE_ID;

  const resolvedPlaceId = placeId || fallbackPlaceId;

  if (!apiKey) {
    return buildDemoReviewsResult(fallbackOptions);
  }

  if (!resolvedPlaceId) {
    return buildDemoReviewsResult(fallbackOptions);
  }

  const params = new URLSearchParams();
  const maxReviews = parseLimit(limit);

  // Keep request simple and compatible: only pass languageCode.
  // We'll sort and slice locally to satisfy UI needs.
  const locale = languageCode || process.env.GOOGLE_PLACES_LANGUAGE || "en-GB";
  params.set("languageCode", locale);

  const requestUrl = `${GOOGLE_PLACES_ENDPOINT}/${resolvedPlaceId}?${params.toString()}`;

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
      },
      // Cache responses for an hour to avoid hammering the quota while keeping content fresh
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      return buildDemoReviewsResult(fallbackOptions);
    }

    const data = (await response.json()) as GooglePlacesResponse;

    const minRatingValue = parseMinimumRating(minimumRating);
    const rawReviews = Array.isArray(data.reviews) ? data.reviews : [];

    const normalisedReviews = rawReviews.map((review) => normaliseGoogleReview(review));
    const filteredReviews = applyReviewFilters(
      normalisedReviews,
      minRatingValue,
      maxReviews,
      resolvedSortOrder,
    );

    return {
      source: "google",
      placeName: data.displayName?.text,
      averageRating: data.rating,
      userRatingCount: data.userRatingCount,
      reviews: filteredReviews,
    };
  } catch {
    return buildDemoReviewsResult(fallbackOptions);
  }
}
