import { Suspense } from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Dealopia</h1>
          <nav className="space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/deals" className="hover:underline">Deals</Link>
            <Link to="/shops" className="hover:underline">Shops</Link>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      
      <footer className="bg-secondary-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Dealopia. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}