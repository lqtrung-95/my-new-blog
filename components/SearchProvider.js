import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import GlobalSearch from '@/components/GlobalSearch'

const SearchContext = createContext({})

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

const SearchProvider = ({ children, posts = [] }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const router = useRouter()

  const openSearch = useCallback(() => {
    setIsSearchOpen(true)
  }, [])

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false)
  }, [])

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev)
  }, [])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggleSearch()
        return
      }

      // Forward slash to open search (when not in input)
      if (e.key === '/' && !isInputFocused()) {
        e.preventDefault()
        openSearch()
        return
      }

      // Escape to close search
      if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault()
        closeSearch()
        return
      }
    }

    const isInputFocused = () => {
      const activeElement = document.activeElement
      return (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.contentEditable === 'true')
      )
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, toggleSearch, openSearch, closeSearch])

  // Close search on route change
  useEffect(() => {
    const handleRouteChange = () => {
      closeSearch()
    }

    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events, closeSearch])

  const value = {
    isSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch,
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
      <GlobalSearch posts={posts} isOpen={isSearchOpen} onClose={closeSearch} />
    </SearchContext.Provider>
  )
}

export default SearchProvider
