import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import FormPage from './pages/FormPage'
import SubmissionsPage from './pages/SubmissionsPage'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <header className="border-b bg-white">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <span className="text-lg font-semibold tracking-tight">
                Dynamic Form Builder
              </span>
              <nav className="flex gap-4 text-sm">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `transition-colors hover:text-blue-600 ${
                      isActive
                        ? 'font-semibold text-blue-600'
                        : 'text-gray-500'
                    }`
                  }
                >
                  Form
                </NavLink>
                <NavLink
                  to="/submissions"
                  className={({ isActive }) =>
                    `transition-colors hover:text-blue-600 ${
                      isActive
                        ? 'font-semibold text-blue-600'
                        : 'text-gray-500'
                    }`
                  }
                >
                  Submissions
                </NavLink>
              </nav>
            </div>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<FormPage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
