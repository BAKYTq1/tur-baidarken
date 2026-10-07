import  'react'
import Banner from '../../widgets/banner/Banner'
import ReviewsSummary from '../../shared/reviewssummary/Reviewssummary'
import ReviewsFeed from '../../shared/reviewsfeed/Reviewsfeed'
import Gallery from '../../shared/gallery/Gallery'
import ReviewCta from '../../shared/reviewcta/Reviewcta'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Newsletter from '../../shared/newsletter/Newsletter'

function Reviews() {
      const [draft, setDraft] = useState(null);

  const openReviewForm = (rating, tour) => {
    setDraft({ rating, tour });
    // здесь откройте модалку или перейдите на форму:
    Navigate(`/reviews/new?tour=${encodeURIComponent(tour)}&rating=${rating}`);
  };

  return (
    <div>
        <Banner
              title={'Впечатления, которые остаются'}
              subtitle={'Голоса путешественников    '}
              subtitle2={'Честные истории людей, которые уже прошли наши маршруты, встретили рассветы и нашли новых друзей.'}
              buttonText={'Смотреть истории'}
              showSearchForm={false}
            />
            <ReviewsSummary/>
            <ReviewsFeed/>
            <Gallery/>
            <ReviewCta onSubmit={({ rating, tour }) => openReviewForm(rating, tour)} />
            <Newsletter/>
    </div>
  )
}

export default Reviews
