import { useState, useRef, useEffect } from 'react'
import { useAdvancedSearch, useSearchAnalytics } from '@/lib/search'
import Tag from '@/components/Tag'

const AdvancedSearch = ({ posts, onSearchResults, className = '' }) => {
  const [showFilters, setShowFilters] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const searchInputRef = useRef(null)
  const suggestionsRef = useRef(null)

  const {
    query,
    setQuery,
    filters,
    updateFilter,
    clearFilters,
    clearSearch,
    searchResults,
    suggestions,
    isSearching,
    hasActiveFilters,
  } = useAdvancedSearch(posts)

  const { searchHistory, popularSearches, clearHistory } = useSearchAnalytics()

  // Update parent component with search results
  useEffect(() => {
    onSearchResults(searchResults)
  }, [searchResults, onSearchResults])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSuggestions || suggestions.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedSuggestion((prev) => (prev > 0 ? prev - 1 : prev))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedSuggestion >= 0) {
            setQuery(suggestions[selectedSuggestion])
            setShowSuggestions(false)
            setSelectedSuggestion(-1)
          }
          break
        case 'Escape':
          setShowSuggestions(false)
          setSelectedSuggestion(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSuggestions, suggestions, selectedSuggestion, setQuery])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false)
        setSelectedSuggestion(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleQueryChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setShowSuggestions(value.length > 0)
    setSelectedSuggestion(-1)
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion)
    setShowSuggestions(false)
    setSelectedSuggestion(-1)
    searchInputRef.current?.focus()
  }

  const handleTagFilter = (tag) => {
    const currentTags = filters.tags || []
    const isSelected = currentTags.includes(tag)

    if (isSelected) {
      updateFilter(
        'tags',
        currentTags.filter((t) => t !== tag)
      )
    } else {
      updateFilter('tags', [...currentTags, tag])
    }
  }

  const getAllTags = () => {
    const tagSet = new Set()
    posts.forEach((post) => {
      if (post.tags) {
        post.tags.forEach((tag) => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  }

  const getDateRangeOptions = () => {
    const now = new Date()
    const options = [
      { label: 'Last 7 days', value: { start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } },
      {
        label: 'Last 30 days',
        value: { start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
      },
      {
        label: 'Last 3 months',
        value: { start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) },
      },
      { label: 'Last year', value: { start: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) } },
    ]
    return options
  }

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setShowSuggestions(query.length > 0)}
            placeholder="Search articles... (Press '/' to focus)"
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pl-10 pr-12 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-primary-400"
            aria-label="Search articles"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
          />

          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Loading/Clear Button */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {isSearching ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
            ) : query || hasActiveFilters ? (
              <button
                onClick={clearSearch}
                className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Clear search"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            ) : null}
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-700 dark:focus:bg-gray-700 ${
                  index === selectedSuggestion ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
                role="option"
                aria-selected={index === selectedSuggestion}
              >
                <div className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4 text-gray-400"
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
                  <span className="text-gray-900 dark:text-gray-100">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
            />
          </svg>
          Advanced Filters
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center rounded-full bg-primary-100 px-2 py-1 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-200">
              Active
            </span>
          )}
        </button>

        {/* Search Results Count */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-4">
            {/* Tag Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {getAllTags().map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      filters.tags?.includes(tag)
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                    {filters.tags?.includes(tag) && (
                      <svg className="ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Date
              </label>
              <div className="flex flex-wrap gap-2">
                {getDateRangeOptions().map((option) => (
                  <button
                    key={option.label}
                    onClick={() => updateFilter('dateRange', option.value)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      filters.dateRange?.start?.getTime() === option.value.start.getTime()
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Time Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reading Time (minutes)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.readingTime?.min || ''}
                  onChange={(e) =>
                    updateFilter('readingTime', {
                      ...filters.readingTime,
                      min: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-20 rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.readingTime?.max || ''}
                  onChange={(e) =>
                    updateFilter('readingTime', {
                      ...filters.readingTime,
                      max: e.target.value ? parseInt(e.target.value) : undefined,
                    })
                  }
                  className="w-20 rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="border-t border-gray-200 pt-2 dark:border-gray-600">
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search History */}
      {!query && !hasActiveFilters && (searchHistory.length > 0 || popularSearches.length > 0) && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          {popularSearches.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.slice(0, 5).map((search) => (
                  <button
                    key={search.query}
                    onClick={() => setQuery(search.query)}
                    className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    {search.query}
                    <span className="ml-1 text-xs opacity-75">({search.count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchHistory.length > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recent Searches
                </h4>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((search, index) => (
                  <button
                    key={`${search.query}-${index}`}
                    onClick={() => setQuery(search.query)}
                    className="rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    {search.query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdvancedSearch
