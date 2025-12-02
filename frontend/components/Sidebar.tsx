'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Wallet,
  Settings,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react'
import { useAuth } from '@/hooks/auth'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Accounts', href: '/accounts', icon: Wallet },
  { name: 'Settings', href: '/settings/categories', icon: Settings },
]

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed')
    if (savedState !== null) {
      setCollapsed(savedState === 'true')
    }
  }, [])

  // Save collapsed state to localStorage whenever it changes
  const handleToggleCollapsed = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
    // Dispatch custom event to notify AppLayout of the change
    window.dispatchEvent(new Event('sidebar-toggle'))
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">Financial Freedom</h1>
        <div className="w-9" />
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
            {!collapsed && (
              <Link href="/dashboard" className="flex items-center space-x-2">
                <span className="font-bold text-lg text-sidebar-foreground">
                  Financial Freedom
                </span>
              </Link>
            )}
            <button
              onClick={handleToggleCollapsed}
              className="hidden lg:flex p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
            >
              <ChevronLeft className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0", collapsed && "mx-auto")} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-sidebar-border p-3">
            {!collapsed && (
              <div className="px-3 py-2 mb-2">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/70 truncate">
                  {user?.email}
                </p>
              </div>
            )}
            <button
              onClick={logout}
              className={cn(
                "flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors w-full",
                "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <LogOut className={cn("h-5 w-5 flex-shrink-0", collapsed && "mx-auto")} />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
