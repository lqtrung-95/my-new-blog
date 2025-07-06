import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from '@/components/Link'
import { useAdvancedSearch } from '@/lib/search'
import formatDate from '@/lib/utils/formatDate'

const GlobalSearch = ({ posts, isOpen, onClose }) => {
  const [selectedResult, setSelectedResult] = useState(0)
  const searchInputRef = useRef(null)
  const resultsRef = useRef(null)
  const router = useRouter()

  const { query, setQuery, searchResults, suggestions, isSearching } = useAdvancedSearch(posts)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setSelectedResult(0)
    }
  }, [isOpen, setQuery])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      const maxResults = Math.min(searchResults.length, 10) // Limit displayed results

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedResult((prev) => (prev < maxResults - 1 ? prev + 1 : prev))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedResult((prev) => (prev > 0 ? prev - 1 : prev))
          break
        case 'Enter':
          e.preventDefault()
          if (searchResults[selectedResult]) {
            handleResultClick(searchResults[selectedResult])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, searchResults, selectedResult, onClose])

  // Scroll selected result into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedResult]
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
    }
  }, [selectedResult])

  const handleResultClick = useCallback(
    (post) => {
      router.push(`/blog/${post.slug}`)
      onClose()
    },
    [router, onClose]
  )

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose()
      }
    },
    [onClose]
  )

  const highlightText = (text, query) => {
    if (!query) return text

    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="rounded bg-yellow-200 px-1 dark:bg-yellow-800">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  if (!isOpen) return null

  const displayResults = searchResults.slice(0, 10) // Limit to 10 results

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-start justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={handleOverlayClick}
        ></div>

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
          {/* Search input */}
          <div className="bg-white px-4 pb-4 pt-5 dark:bg-gray-800 sm:p-6 sm:pb-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="block w-full rounded-md border border-gray-300 bg-white py-3 pl-10 pr-3 text-lg leading-5 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>

          {/* Search results */}
          <div className="max-h-96 overflow-y-auto bg-gray-50 px-4 py-3 dark:bg-gray-900">
            {!query && (
              <div className="py-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  Search articles
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {posts.length > 0
                    ? 'Start typing to search through all blog posts'
                    : 'Search is available on pages with blog content'}
                </p>
              </div>
            )}

            {query && displayResults.length === 0 && !isSearching && (
              <div className="py-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                  No results found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try different keywords or check your spelling
                </p>
              </div>
            )}

            {displayResults.length > 0 && (
              <div ref={resultsRef} className="space-y-1">
                {displayResults.map((post, index) => (
                  <button
                    key={post.slug}
                    onClick={() => handleResultClick(post)}
                    className={`w-full rounded-md p-3 text-left transition-colors ${
                      index === selectedResult
                        ? 'border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-900'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="mt-2 h-2 w-2 rounded-full bg-primary-500"></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                          {highlightText(post.title, query)}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                          {highlightText(post.summary || '', query)}
                        </p>
                        <div className="mt-2 flex items-center space-x-2">
                          <time className="text-xs text-gray-400">{formatDate(post.date)}</time>
                          {post.tags &&
                            post.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                              >
                                {tag}
                              </span>
                            ))}
                          {post.searchScore && process.env.NODE_ENV === 'development' && (
                            <span className="text-xs text-gray-400">
                              Score: {post.searchScore.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}

                {searchResults.length > 10 && (
                  <div className="border-t border-gray-200 py-3 text-center dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Showing first 10 of {searchResults.length} results.{' '}
                      <Link href="/blog" className="text-primary-500 hover:text-primary-600">
                        View all results
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with keyboard shortcuts */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <kbd className="rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700">↵</kbd>
                  <span>to select</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700">↑↓</kbd>
                  <span>to navigate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="rounded bg-gray-200 px-2 py-1 text-xs dark:bg-gray-700">esc</kbd>
                  <span>to close</span>
                </div>
              </div>
              <div className="text-xs">Powered by advanced search</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalSearch
