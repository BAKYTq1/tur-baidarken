import  'react'
import Banner from '../../widgets/banner/Banner'
import ReviewsSummary from '../../shared/reviewssummary/Reviewssummary'
import ReviewsFeed from '../../shared/reviewsfeed/Reviewsfeed'
import Gallery from '../../shared/gallery/Gallery'
import ReviewCta from '../../shared/reviewcta/Reviewcta'

function Reviews() {
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
            <ReviewCta />
    </div>
  )
}

export default Reviews
