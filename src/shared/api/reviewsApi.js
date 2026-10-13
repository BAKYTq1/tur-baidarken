import { $api, API_BASE_URL } from './axiosInstance';
import { loc } from '../hooks/loc';
import { getLang, t } from '../i18n/i18n';
import { getTours } from './tourApi';

const asText = (value) => {
  if (value == null) return '';
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') return loc(value, getLang()) || '';
  return String(value).trim();
};

const formatDate = (value) => {
  if (!value) return t('publicUi.reviewFeed.recent_review');
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const locale = { ru: 'ru-RU', en: 'en-US', kg: 'ky-KG', ja: 'ja-JP' }[getLang()] || 'ru-RU';
  return d.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
};

export const normalizeReview = (item = {}, tourNames = new Map()) => {
  const rawText = item.text ?? item.comment ?? item.review ?? item.message ?? '';
  const author = asText(item.author_name ?? item.name ?? item.author) || t('publicUi.reviewFeed.guest');
  const role = asText(item.tour_title ?? item.tour_name ?? item.role ?? tourNames.get(String(item.tour_id))) || t('publicUi.reviewFeed.tour_guest');
  const rating = Number(item.rating ?? item.score ?? 5);
  const text = asText(rawText) || t('publicUi.reviewFeed.empty_text');

  return {
    id: item.id ?? `${author}-${role}`,
    tour_id: item.tour_id ?? null,
    name: author || 'Гость',
    role: role || 'Гость тура',
    rating: Number.isFinite(rating) ? Math.max(1, Math.min(5, rating)) : 5,
    text,
    date: formatDate(item.created_at ?? item.date ?? item.published_at ?? item.updated_at),
    note: item.is_confirmed || item.confirmed ? t('publicUi.reviewFeed.confirmed') : t('publicUi.reviewFeed.customer'),
    avatar: item.avatar || item.image || item.photo || item.avatar_url || '',
    is_published: item.is_published !== false,
  };
};

export function aggregateTourRatings(reviews = []) {
  const totals = new Map();

  reviews.forEach((review) => {
    const tourId = review.tour_id;
    const rating = Number(review.rating);
    if (!tourId || !Number.isFinite(rating) || rating < 1 || rating > 5) return;

    const current = totals.get(String(tourId)) || { total: 0, count: 0 };
    current.total += rating;
    current.count += 1;
    totals.set(String(tourId), current);
  });

  return new Map(
    [...totals].map(([tourId, { total, count }]) => [tourId, { rating: total / count, count }]),
  );
}

export async function getPublishedReviews() {
  try {
    const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/reviews`);

    if (!response.ok) {
      throw new Error(`Failed to load reviews: ${response.status}`);
    }

    const data = await response.json();
    const items = Array.isArray(data) ? data : data?.items || data?.data?.items || data?.data || data?.results || [];
    const published = (items || []).filter((item) => item.is_published !== false);

    if (published.length) {
      const tours = await getTours().catch(() => []);
      const tourNames = new Map(
        tours.map((tour) => [String(tour.id), asText(tour.title ?? tour.name)]),
      );
      return published.map((item) => normalizeReview(item, tourNames));
    }

    return [];
  } catch (error) {
    console.error('Reviews API request failed:', error);
    throw error;
  }
}

export async function postReview({ tourId, reviewData }) {
  const response = await $api.post(
    `/tours/${encodeURIComponent(tourId)}/reviews`,
    reviewData,
  );
  return response.data;
}
