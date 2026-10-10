import { useRef, useState } from 'react'
import { useI18n } from '../../shared/i18n'
import { getLang } from '../../shared/i18n/i18n'
import { useCreateBooking } from '../../shared/api/useCreateBooking'
import { useFaq } from '../../features/faq/model/useFaq'
import ContactHero from './ContactHero'
import './ContactsPage.scss'

function Contact() {
  const { t } = useI18n()
  const [openQuestion, setOpenQuestion] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [isAgreed, setIsAgreed] = useState(false)
  const submittingRef = useRef(false)
  const { mutate, isPending } = useCreateBooking()
  const { data, isLoading, isError } = useFaq()
  const faqItems = data?.items || []
  const address = t('contactPage.address')
  const contactPhone = '+998 555 48 20 20'
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  function handleContactSubmit(event) {
    event.preventDefault()

    if (!isAgreed) {
      alert('Подтвердите согласие на обработку персональных данных')
      return
    }

    const contact = phone.trim() || email.trim()
    if (!contact || !name.trim() || !note.trim() || submittingRef.current) return

    submittingRef.current = true
    mutate({
      name: name.trim(),
      contact,
      people_count: 1,
      tour_id: null,
      preferred_date: new Date().toISOString().split('T')[0],
      note: note.trim(),
      lang: getLang() || 'ru',
    }, {
      onSuccess: () => {
        setName('')
        setPhone('')
        setEmail('')
        setNote('')
        setIsAgreed(false)
      },
      onSettled: () => {
        submittingRef.current = false
      },
    })
  }

  return (
    <main className="contact-page">
      <ContactHero />

      <section className="contact-details" aria-label={t('contacts.title')}>
        <div className="contact-container contact-details__grid">
          <article className="contact-detail-card">
            <span className="contact-detail-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7.2 3.5h2.2l1.1 4.1-1.8 1.8a15 15 0 0 0 5.9 5.9l1.8-1.8 4.1 1.1v2.2a2 2 0 0 1-2.2 2A15.6 15.6 0 0 1 5.2 5.7a2 2 0 0 1 2-2.2Z" />
              </svg>
            </span>
            <div className="contact-detail-card__content">
              <h2>{t('contactPage.call')}</h2>
              <a className="contact-detail-card__primary" href="tel:+998555482020">{contactPhone}</a>
              <p>
                <a href="https://wa.me/998555482020" target="_blank" rel="noreferrer">WhatsApp</a>
                <span aria-hidden="true"> · </span>
                <a href="https://t.me/+998555482020" target="_blank" rel="noreferrer">Telegram</a>
              </p>
            </div>
          </article>

          <article className="contact-detail-card">
            <span className="contact-detail-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3.5" y="5" width="17" height="14" rx="2" />
                <path d="m4.5 7 7.5 6 7.5-6" />
              </svg>
            </span>
            <div className="contact-detail-card__content">
              <h2>{t('contactPage.write')}</h2>
              <a className="contact-detail-card__primary" href="mailto:hello@baidarken.travel">hello@baidarken.travel</a>
              <p>{t('contactPage.reply_time')}</p>
            </div>
          </article>

          <article className="contact-detail-card">
            <span className="contact-detail-card__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </span>
            <div className="contact-detail-card__content">
              <h2>{t('contactPage.visit')}</h2>
              <a className="contact-detail-card__primary" href={mapUrl} target="_blank" rel="noreferrer">
                {t('contactPage.address_card')}
              </a>
              <p>{t('contactPage.office')}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="contact-callback" id="contact-callback" aria-labelledby="contact-callback-title">
        <div className="contact-container contact-callback__grid">
          <div className="contact-callback__form-panel">
            <span className="contact-eyebrow">{t('contactPage.callback_eyebrow')}</span>
            <h2 id="contact-callback-title">{t('contactPage.callback_title')}</h2>
            <p className="contact-callback__description">{t('contactPage.callback_description')}</p>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <div className="contact-form__fields">
                <label className="contact-form__field">
                  <span>{t('contactPage.form.name')}</span>
                  <input name="name" type="text" autoComplete="name" placeholder={t('contactPage.form.name_placeholder')} value={name} onChange={(event) => setName(event.target.value)} required />
                </label>
                <label className="contact-form__field">
                  <span>{t('contactPage.form.phone')}</span>
                  <input name="phone" type="tel" autoComplete="tel" placeholder="+998" value={phone} onChange={(event) => setPhone(event.target.value)} required={!email.trim()} />
                </label>
                <label className="contact-form__field">
                  <span>{t('contactPage.form.email')}</span>
                  <input name="email" type="email" autoComplete="email" placeholder="name@email.com" value={email} onChange={(event) => setEmail(event.target.value)} required={!phone.trim()} />
                </label>
                <label className="contact-form__field contact-form__field--wide">
                  <span>{t('contactPage.form.message')}</span>
                  <textarea name="message" rows="4" placeholder={t('contactPage.form.message_placeholder')} value={note} onChange={(event) => setNote(event.target.value)} required />
                </label>
              </div>

              <label className="contact-form__consent">
                <input type="checkbox" checked={isAgreed} onChange={(event) => setIsAgreed(event.target.checked)} />
                <span>{t('contactPage.form.consent')}</span>
              </label>
              <button className="contact-form__submit" type="submit" disabled={isPending}>
                {isPending ? t('contactPage.form.sending') : t('contactPage.form.submit')}
                <span aria-hidden="true">→</span>
              </button>
              <p className="contact-form__note">{t('contactPage.form.request_note')}</p>
            </form>
          </div>

          <aside className="contact-hours" aria-labelledby="contact-hours-title">
            <span className="contact-hours__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.5 2" />
              </svg>
            </span>
            <span className="contact-hours__eyebrow">{t('contactPage.hours_eyebrow')}</span>
            <h2 id="contact-hours-title">{t('contactPage.hours_title')}</h2>
            <p className="contact-hours__intro">{t('contactPage.hours_description')}</p>
            <dl className="contact-hours__schedule">
              <div>
                <dt>{t('contactPage.weekdays')}</dt>
                <dd>{t('contactPage.weekdays_hours')}</dd>
              </div>
              <div>
                <dt>{t('contactPage.saturday')}</dt>
                <dd>{t('contactPage.saturday_hours')}</dd>
              </div>
              <div>
                <dt>{t('contactPage.sunday')}</dt>
                <dd>{t('contactPage.sunday_hours')}</dd>
              </div>
            </dl>
            <div className="contact-hours__status">
              <span aria-hidden="true" />
              {t('contactPage.online_status')}
            </div>
          </aside>
        </div>
      </section>

      <section className="contact-location" id="contacts" aria-labelledby="contact-location-title">
        <div className="contact-container">
          <div className="contact-section-heading">
            <span className="contact-eyebrow">{t('contactPage.map_eyebrow')}</span>
            <h2 id="contact-location-title">{t('contactPage.map_title')}</h2>
            <p>{t('contactPage.map_description')}</p>
          </div>

          <div className="contact-map">
            <div className="contact-map__streets" aria-hidden="true">
              <span className="contact-map__park" />
              <span className="contact-map__road contact-map__road--one" />
              <span className="contact-map__road contact-map__road--two" />
              <span className="contact-map__road contact-map__road--three" />
              <span className="contact-map__road contact-map__road--four" />
              <span className="contact-map__marker">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <span className="contact-map__street-label contact-map__street-label--one">{t('contactPage.street_label')}</span>
              <span className="contact-map__street-label contact-map__street-label--two">пр. Чуй</span>
            </div>

            <div className="contact-map__address">
              <span className="contact-map__address-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </span>
              <div>
                <span className="contact-map__address-label">{t('contactPage.address_label')}</span>
                <p>{t('contactPage.map_address')}</p>
                <a href={mapUrl} target="_blank" rel="noreferrer">
                  {t('contactPage.map_link')}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-faq" id="faq" aria-labelledby="contact-faq-title">
        <div className="contact-container contact-faq__layout">
          <div className="contact-section-heading contact-faq__intro">
            <span className="contact-eyebrow">{t('contactPage.faq_eyebrow')}</span>
            <h2 id="contact-faq-title">{t('faq.title')}</h2>
            <p>{t('faq.subtitle')}</p>
          </div>

          <div className="contact-faq__list">
            {isLoading ? (
              <div className="contact-faq__state">Загружаем частые вопросы...</div>
            ) : isError ? (
              <div className="contact-faq__state">Не удалось загрузить список вопросов</div>
            ) : faqItems.length === 0 ? (
              <div className="contact-faq__state">Пока нет вопросов</div>
            ) : (
              faqItems.map((item, index) => {
                const isOpen = openQuestion === item.id
                const answerId = `contact-faq-answer-${item.id || index}`

                return (
                  <article className={`contact-faq__item${isOpen ? ' is-open' : ''}`} key={item.id || item.question || index}>
                    <h3>
                      <button
                        className="contact-faq__question"
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => setOpenQuestion(isOpen ? null : item.id)}
                      >
                        <span>{item.question}</span>
                        <span className="contact-faq__toggle" aria-hidden="true">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                    </h3>
                    {isOpen && (
                      <div className="contact-faq__answer" id={answerId}>
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </article>
                )
              })
            )}
          </div>
        </div>
      </section>

    </main>
  )
}

export default Contact
