import { useRef, useState } from 'react'
import Banner from '../../widgets/banner/Banner'
import Newsletter from '../../shared/newsletter/Newsletter'
import { useI18n } from '../../shared/i18n'
import blogBannerImage from '../../shared/assets/горы.jpeg'
import mountainImage from '../../widgets/assets/hero-img.png'
import sunsetImage from '../../shared/assets/gory_zakat_pejzazh_144200_300x188.jpg'
import styles from './Blog.module.css'

const articlesData = [
  { id: 1, category: 'routes', image: blogBannerImage },
  { id: 2, category: 'practice', image: mountainImage },
  { id: 3, category: 'people', image: sunsetImage },
  { id: 4, category: 'food', image: blogBannerImage },
  { id: 5, category: 'photography', image: mountainImage },
  { id: 6, category: 'routes', image: sunsetImage },
  { id: 7, category: 'practice', image: blogBannerImage },
  { id: 8, category: 'people', image: mountainImage },
  { id: 9, category: 'food', image: sunsetImage },
  { id: 10, category: 'photography', image: blogBannerImage },
]

const INITIAL_ARTICLES_COUNT = 6

function Blog() {
  const { t } = useI18n()
  const sectionRef = useRef(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [visibleArticlesCount, setVisibleArticlesCount] = useState(INITIAL_ARTICLES_COUNT)
  const categories = [
    { id: 'all', label: t('blog.categories.all') },
    { id: 'routes', label: t('blog.categories.routes') },
    { id: 'practice', label: t('blog.categories.practice') },
    { id: 'people', label: t('blog.categories.people') },
    { id: 'food', label: t('blog.categories.food') },
    { id: 'photography', label: t('blog.categories.photography') },
  ]
  const filteredArticles = activeCategory === 'all'
    ? articlesData
    : articlesData.filter((item) => item.category === activeCategory)
  const visibleArticles = filteredArticles.slice(0, visibleArticlesCount)

  function handleCategoryClick(categoryId) {
    setActiveCategory(categoryId)
    setVisibleArticlesCount(INITIAL_ARTICLES_COUNT)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={styles.page}>
      <Banner
        subtitle={t('blog.subtitle')}
        title={t('blog.title')}
        description={t('blog.description')}
        buttonText={t('blog.button')}
        showSearchForm={false}
        bgImage={blogBannerImage}
      />
      <main className={styles.content}>
        <nav className={styles.categoryTabs} aria-label={t('blog.categories.label')}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.categoryButton} ${
                activeCategory === category.id ? styles.categoryButtonActive : ''
              }`}
              type="button"
              aria-pressed={activeCategory === category.id}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.label}
            </button>
          ))}
        </nav>

        <section className={styles.featuredSection} aria-labelledby="featured-title">
          <p className={styles.eyebrow}>{t('blog.featured.eyebrow')}</p>
          <h2 className={styles.sectionTitle} id="featured-title">
            {t('blog.featured.title')}
          </h2>
          <article className={styles.featuredCard}>
            <div className={styles.featuredImage}>
              <img src={blogBannerImage} alt={t('blog.featured.image_alt')} />
              <span className={styles.projectBadge}>{t('blog.featured.badge')}</span>
            </div>
            <div className={styles.featuredCopy}>
              <p className={styles.featuredMeta}>{t('blog.featured.meta')}</p>
              <h3 className={styles.featuredTitle}>{t('blog.featured.article_title')}</h3>
              <p className={styles.featuredDescription}>
                {t('blog.featured.description')}
              </p>
              <div className={styles.featuredAuthor}>
                <span className={styles.authorAvatar} aria-hidden="true">АМ</span>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{t('blog.featured.author')}</span>
                  <span className={styles.readTime}>{t('blog.featured.read_time')}</span>
                </div>
                <span className={styles.articleArrow} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M6 18 18 6M7 6h11v11" />
                  </svg>
                </span>
              </div>
            </div>
          </article>
        </section>

        <section
          className={styles.articlesSection}
          ref={sectionRef}
          aria-labelledby="articles-title"
        >
          <p className={styles.eyebrow}>{t('blog.articles.eyebrow')}</p>
          <h2 className={styles.articlesTitle} id="articles-title">
            {t('blog.articles.title')}
          </h2>
          <p className={styles.articlesDescription}>{t('blog.articles.description')}</p>
          <div className={styles.articlesGrid}>
            {visibleArticles.map((article) => (
              <article className={styles.articleCard} key={article.id}>
                <div className={styles.articleImage}>
                  <img src={article.image} alt={t(`blog.articles.items.${article.id - 1}.image_alt`)} />
                  <span className={styles.articleCategory}>
                    {t(`blog.categories.${article.category}`)}
                  </span>
                </div>
                <h3 className={styles.articleTitle}>
                  {t(`blog.articles.items.${article.id - 1}.title`)}
                </h3>
                <p className={styles.articleDescription}>
                  {t(`blog.articles.items.${article.id - 1}.description`)}
                </p>
                <p className={styles.articleMeta}>
                  <span>{t(`blog.articles.items.${article.id - 1}.read_time`)}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{t(`blog.articles.items.${article.id - 1}.date`)}</span>
                </p>
              </article>
            ))}
          </div>
          {visibleArticlesCount < filteredArticles.length && (
            <button
              className={styles.loadMoreButton}
              type="button"
              onClick={() => setVisibleArticlesCount((count) => count + INITIAL_ARTICLES_COUNT)}
            >
              {t('blog.articles.load_more')}
            </button>
          )}
        </section>
      </main>
      <section className={styles.guideSection} aria-labelledby="guide-title">
        <div className={styles.guideInner}>
          <img
            className={styles.guideImage}
            src={blogBannerImage}
            alt={t('blog.guide.image_alt')}
            loading="lazy"
          />
          <div className={styles.guideCopy}>
            <p className={styles.guideEyebrow}>{t('blog.guide.eyebrow')}</p>
            <h2 className={styles.guideTitle} id="guide-title">
              {t('blog.guide.title')}
            </h2>
            <p className={styles.guideDescription}>{t('blog.guide.description')}</p>
            <a
              className={styles.guideButton}
              href="https://www.instagram.com/turgon_baidarka/"
              target="_blank"
              rel="noreferrer"
            >
              {t('blog.guide.button')}
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      <Newsletter />
    </div>
  )
}

export default Blog
