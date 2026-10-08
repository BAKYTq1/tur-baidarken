import 'react'
import Features from '../../shared/features/Features'
import Catalog from '../../shared/catalog/Catalog'
import TourPicker from '../../shared/Tourpicker/Tourpicker'
import Newsletter from '../../shared/newsletter/Newsletter'
import Banner from '../../widgets/banner/Banner'
function Tours() {
  return (
    <div>
      <Banner
      title="Туры, к которым хочется возвращаться"
        subtitle = 'Путешествия, собранные с заботой'
        subtitle2 = 'Небольшие группы, продуманные маршруты и проводники, которые знают каждую тропу.'
        buttonText = 'Смотреть каталог'
        showSearchForm = {false}
      />
      <Features/>
      <Catalog/>
      <TourPicker/>
      <Newsletter/>
    </div>
  )
}

export default Tours
