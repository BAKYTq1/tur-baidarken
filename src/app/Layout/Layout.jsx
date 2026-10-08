import 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../widgets/header/Header'
import Footer from '../../widgets/footer/Footer'
import styles from './Layout.module.css'

function Layout() {
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
