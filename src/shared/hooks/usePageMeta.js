import { useEffect } from 'react';

const setMeta = (selector, value, attr = 'content') => {
  if (!value) return;

  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    if (selector.startsWith('meta[name=')) {
      tag.setAttribute('name', selector.match(/name="([^"]+)"/)[1]);
    } else if (selector.startsWith('meta[property=')) {
      tag.setAttribute('property', selector.match(/property="([^"]+)"/)[1]);
    }
    document.head.appendChild(tag);
  }

  tag.setAttribute(attr, value);
};

const setLink = (selector, href) => {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('link');
    document.head.appendChild(tag);
  }
  tag.setAttribute('rel', selector.match(/rel="([^"]+)"/)[1]);
  tag.setAttribute('href', href);
};

const setHreflang = (alternates = []) => {
  document.querySelectorAll('link[rel="alternate"]').forEach((el) => el.remove());
  alternates.forEach(({ lang, href }) => {
    const tag = document.createElement('link');
    tag.setAttribute('rel', 'alternate');
    tag.setAttribute('hreflang', lang);
    tag.setAttribute('href', href);
    document.head.appendChild(tag);
  });
};

const setJsonLd = (data) => {
  if (!data) return;

  let script = document.head.querySelector('script[data-seo-jsonld]');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-jsonld', 'true');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

export function usePageMeta({
  title,
  description,
  image,
  url,
  keywords,
  type = 'website',
  locale,
  alternates = [],
  jsonLd,
}) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) setMeta('meta[name="description"]', description);
    if (keywords) setMeta('meta[name="keywords"]', keywords);
    if (locale) setMeta('meta[property="og:locale"]', locale);
    if (image) {
      setMeta('meta[property="og:image"]', image);
      setMeta('meta[name="twitter:image"]', image);
      setMeta('meta[property="twitter:image"]', image);
    }
    if (url) {
      setMeta('meta[property="og:url"]', url);
      setLink('link[rel="canonical"]', url);
    }
    if (title) {
      setMeta('meta[property="og:title"]', title);
      setMeta('meta[name="twitter:title"]', title);
    }
    if (description) {
      setMeta('meta[property="og:description"]', description);
      setMeta('meta[name="twitter:description"]', description);
    }
    if (type) {
      setMeta('meta[property="og:type"]', type);
    }
    if (alternates.length) {
      setHreflang(alternates);
    }

    if (jsonLd) {
      setJsonLd(jsonLd);
    }

    return () => {
      document.querySelectorAll('link[rel="alternate"]').forEach((el) => el.remove());
      const jd = document.head.querySelector('script[data-seo-jsonld]');
      if (jd) jd.remove();
    };
  }, [title, description, image, url, keywords, type, locale, alternates, jsonLd]);
}
