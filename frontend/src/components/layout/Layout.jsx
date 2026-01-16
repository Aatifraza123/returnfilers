import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import WhatsAppWidget from '../common/WhatsAppWidget'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppWidget />
    </div>
  )
}

export default Layout
