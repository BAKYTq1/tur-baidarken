import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getTourBySlugOrId } from '../../shared/data/tours';
import { usePageMeta } from '../../shared/hooks/usePageMeta';
import { useI18n } from '../../shared/i18n';

const formatPrice = (value, lang, t) => `${t('publicUi.catalog.from')} ${new Intl.NumberFormat(
  { ru: 'ru-RU', en: 'en-US', kg: 'ky-KG', ja: 'ja-JP' }[lang] || 'ru-RU',
  { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 },
).format(Number(value || 0))}`;

export default function TourPage() {
  const { t, lang } = useI18n();
  const { slug } = useParams();
  const tour = useMemo(() => getTourBySlugOrId(slug), [slug]);

  const title = tour?.metaTitle || t('publicUi.catalog.tour_fallback');
  const description = tour?.metaDescription || t('publicUi.catalog.tour_fallback');
  const keywords = tour?.seoKeywords || '';
  const canonical = tour ? `https://baidarken.com/tours/${tour.slug}` : 'https://baidarken.com/tours';

  usePageMeta({
    title,
    description,
    keywords,
    image: tour?.image || 'https://baiderken.onrender.com/api/v1/static/og-tour.jpg',
    url: canonical,
    type: 'article',
    locale: 'ru_KG',
    jsonLd: tour
      ? {
          '@context': 'https://schema.org',
          '@type': 'TouristTrip',
          name: tour.title,
          description,
          image: tour.image,
          url: canonical,
          offers: {
            '@type': 'Offer',
            price: String(tour.price),
            priceCurrency: 'RUB',
            availability: 'https://schema.org/InStock',
          },
          provider: {
            '@type': 'Organization',
            name: 'Baidarken',
            url: 'https://baidarken.com',
          },
          areaServed: tour.location,
          tourType: tour.category,
        }
      : undefined,
  });

  if (!tour) {
    return (
      <main style={{ maxWidth: 900, margin: '48px auto', padding: '0 20px' }}>
        <h1>{t('publicUi.tourDetails.not_found')}</h1>
        <p>{t('publicUi.tourDetails.stale_link')}</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: '48px auto', padding: '0 20px' }}>
      <article style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24 }}>
        <div>
          <img
            src={tour.image}
            alt={tour.title}
            style={{ width: '100%', borderRadius: 18, objectFit: 'cover', maxHeight: 520 }}
          />
        </div>
        <div>
          <p style={{ textTransform: 'uppercase', letterSpacing: 1.2, color: '#66726d', fontSize: 12, fontWeight: 700 }}>
            {tour.location}
          </p>
          <h1 style={{ margin: '8px 0 12px', fontSize: 42, lineHeight: 1.1 }}>{tour.title}</h1>
          <p style={{ color: '#3d4d47', fontSize: 18, lineHeight: 1.7 }}>{tour.subtitle}</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 20 }}>
            <span style={{ background: '#eef4f2', padding: '8px 12px', borderRadius: 999 }}>{tour.duration}</span>
            <span style={{ background: '#eef4f2', padding: '8px 12px', borderRadius: 999 }}>{tour.groupSize}</span>
            <span style={{ background: '#eef4f2', padding: '8px 12px', borderRadius: 999 }}>{formatPrice(tour.price, lang, t)}</span>
          </div>

          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 22, marginBottom: 12 }}>{t('publicUi.tourDetails.about')}</h2>
            <p style={{ color: '#394841', lineHeight: 1.8 }}>
              {tour.description || t('publicUi.tourDetails.static_description')}
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
