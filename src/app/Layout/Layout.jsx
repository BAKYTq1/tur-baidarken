import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '../../widgets/header/Header'
import Footer from '../../widgets/footer/Footer'
import styles from './Layout.module.css'

function Layout() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div>
      <Header />
      <div className={styles.headerSpacer} aria-hidden="true" />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout
