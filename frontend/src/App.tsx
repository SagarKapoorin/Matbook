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
        <div className="app-shell text-slate-50">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/85 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 via-cyan-400 to-emerald-400 text-sm font-semibold text-slate-950 shadow-[0_10px_40px_rgba(56,189,248,0.45)]">
                  M
                </span>
                <div className="leading-tight">
                  <span className="block text-sm font-semibold tracking-tight">
                    Matbook Studio
                  </span>
                  <span className="block text-xs text-slate-400">
                    Dynamic form builder & submissions
                  </span>
                </div>
              </div>
              <nav className="flex items-center gap-1 rounded-full bg-slate-900/80 px-1 py-1 text-xs font-medium text-slate-400 shadow-[0_0_0_1px_rgba(148,163,184,0.35)]">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    [
                      'px-3 py-1.5 rounded-full transition-all duration-200',
                      'hover:text-slate-100 hover:bg-slate-800/80',
                      isActive
                        ? 'bg-slate-100 text-slate-900 shadow-sm'
                        : 'text-slate-400',
                    ].join(' ')
                  }
                >
                  Form
                </NavLink>
                <NavLink
                  to="/submissions"
                  className={({ isActive }) =>
                    [
                      'px-3 py-1.5 rounded-full transition-all duration-200',
                      'hover:text-slate-100 hover:bg-slate-800/80',
                      isActive
                        ? 'bg-slate-100 text-slate-900 shadow-sm'
                        : 'text-slate-400',
                    ].join(' ')
                  }
                >
                  Submissions
                </NavLink>
              </nav>
            </div>
          </header>
          <main className="relative z-10">
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
