import  'react'
import Banner from '../../widgets/banner/Banner'
import ReviewsSummary from '../../shared/reviewssummary/Reviewssummary'
import ReviewsFeed from '../../shared/reviewsfeed/Reviewsfeed'
import Gallery from '../../shared/gallery/Gallery'
import ReviewCta from '../../shared/reviewcta/Reviewcta'
import { useI18n } from '../../shared/i18n'
import { usePublishedReviews } from '../../shared/api/useReviews'

function Reviews() {
  const { t } = useI18n()
  const { data: reviews = [] } = usePublishedReviews()

  return (
    <div>
        <Banner
              title={t('reviews.page_title')}
              subtitle={t('reviews.page_eyebrow')}
              subtitle2={t('reviews.page_description')}
              buttonText={t('reviews.page_button')}
              showSearchForm={false}
            />
            <ReviewsSummary reviews={reviews} />
            <ReviewsFeed/>
            <Gallery/>
            <ReviewCta />
    </div>
  )
}

export default Reviews
