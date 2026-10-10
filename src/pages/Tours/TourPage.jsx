import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { getTourBySlugOrId } from '../../shared/data/tours';
import { usePageMeta } from '../../shared/hooks/usePageMeta';

const formatPrice = (value) => `от ${Number(value || 0).toLocaleString('ru-RU')} ₽`;

export default function TourPage() {
  const { slug } = useParams();
  const tour = useMemo(() => getTourBySlugOrId(slug), [slug]);

  const title = tour?.metaTitle || 'Тур';
  const description = tour?.metaDescription || 'Тур';
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
        <h1>Тур не найден</h1>
        <p>Такого тура в каталоге больше нет или ссылка устарела.</p>
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
            <span style={{ background: '#eef4f2', padding: '8px 12px', borderRadius: 999 }}>{formatPrice(tour.price)}</span>
          </div>

          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 22, marginBottom: 12 }}>О туре</h2>
            <p style={{ color: '#394841', lineHeight: 1.8 }}>
              Этот маршрут создан для тех, кто хочет совместить комфорт, живописные локации и ощущение настоящего путешествия.
              Программа рассчитана на небольшую группу, а логистика продумана так, чтобы каждое путешествие было максимально комфортным.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
