import 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../widgets/header/Header'
import Footer from '../../widgets/footer/Footer'

function Layout() {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout
