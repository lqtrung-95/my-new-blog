// Advanced search utilities for blog posts
import { useMemo, useCallback, useState, useEffect } from 'react'

// Fuzzy search implementation
export function fuzzySearch(needle, haystack, threshold = 0.6) {
  if (!needle || !haystack) return false

  const needleLower = needle.toLowerCase()
  const haystackLower = haystack.toLowerCase()

  // Exact match gets highest score
  if (haystackLower.includes(needleLower)) return true

  // Levenshtein distance for fuzzy matching
  const distance = levenshteinDistance(needleLower, haystackLower)
  const maxLength = Math.max(needleLower.length, haystackLower.length)
  const similarity = 1 - distance / maxLength

  return similarity >= threshold
}

// Levenshtein distance calculation
function levenshteinDistance(str1, str2) {
  const matrix = []

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i]
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }

  return matrix[str2.length][str1.length]
}

// Advanced search with weighted scoring
export function searchPosts(posts, query, filters = {}) {
  if (!query && !Object.keys(filters).length) return posts

  const searchTerms = query
    .toLowerCase()
    .split(' ')
    .filter((term) => term.length > 0)

  return posts
    .map((post) => ({
      ...post,
      searchScore: calculateSearchScore(post, searchTerms, filters),
    }))
    .filter((post) => post.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore)
}

// Calculate weighted search score
function calculateSearchScore(post, searchTerms, filters) {
  let score = 0
  const weights = {
    title: 10,
    summary: 5,
    tags: 8,
    content: 3,
    date: 2,
  }

  // Apply filters first
  if (!passesFilters(post, filters)) return 0

  // If no search terms, return base score for filtered posts
  if (searchTerms.length === 0) return 1

  const title = post.title?.toLowerCase() || ''
  const summary = post.summary?.toLowerCase() || ''
  const tags = post.tags?.join(' ').toLowerCase() || ''

  searchTerms.forEach((term) => {
    // Exact matches get higher scores
    if (title.includes(term)) score += weights.title
    if (summary.includes(term)) score += weights.summary
    if (tags.includes(term)) score += weights.tags

    // Fuzzy matches get lower scores
    if (fuzzySearch(term, title, 0.7)) score += weights.title * 0.7
    if (fuzzySearch(term, summary, 0.7)) score += weights.summary * 0.7
    if (fuzzySearch(term, tags, 0.8)) score += weights.tags * 0.8

    // Boost score for title starts with term
    if (title.startsWith(term)) score += weights.title * 0.5
  })

  // Boost recent posts slightly
  const postDate = new Date(post.date)
  const daysSincePost = (Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24)
  if (daysSincePost < 30) score += weights.date

  return score
}

// Filter posts based on criteria
function passesFilters(post, filters) {
  const { tags, dateRange, author } = filters

  // Tag filter
  if (tags && tags.length > 0) {
    const postTags = post.tags || []
    const hasMatchingTag = tags.some((tag) =>
      postTags.some((postTag) => postTag.toLowerCase().includes(tag.toLowerCase()))
    )
    if (!hasMatchingTag) return false
  }

  // Date range filter
  if (dateRange && (dateRange.start || dateRange.end)) {
    const postDate = new Date(post.date)
    if (dateRange.start && postDate < new Date(dateRange.start)) return false
    if (dateRange.end && postDate > new Date(dateRange.end)) return false
  }

  // Author filter
  if (author && post.author && !post.author.toLowerCase().includes(author.toLowerCase())) {
    return false
  }

  return true
}

// Search suggestions based on existing content
export function getSearchSuggestions(posts, query, limit = 5) {
  if (!query || query.length < 2) return []

  const suggestions = new Set()
  const queryLower = query.toLowerCase()

  posts.forEach((post) => {
    // Add matching titles
    if (post.title && post.title.toLowerCase().includes(queryLower)) {
      suggestions.add(post.title)
    }

    // Add matching tags
    if (post.tags) {
      post.tags.forEach((tag) => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag)
        }
      })
    }

    // Add matching words from summary
    if (post.summary) {
      const words = post.summary.split(' ')
      words.forEach((word) => {
        const cleanWord = word.replace(/[^\w]/g, '').toLowerCase()
        if (cleanWord.includes(queryLower) && cleanWord.length > 3) {
          suggestions.add(cleanWord)
        }
      })
    }
  })

  return Array.from(suggestions).slice(0, limit)
}

// Debounced search hook
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Search analytics
export function useSearchAnalytics() {
  const [searchHistory, setSearchHistory] = useState([])
  const [popularSearches, setPopularSearches] = useState([])

  const addSearch = useCallback((query, resultCount) => {
    if (!query.trim()) return

    const searchEntry = {
      query: query.trim(),
      timestamp: Date.now(),
      resultCount,
    }

    setSearchHistory((prev) => [searchEntry, ...prev.slice(0, 9)]) // Keep last 10

    // Update popular searches
    setPopularSearches((prev) => {
      const existing = prev.find((item) => item.query === query)
      if (existing) {
        return prev
          .map((item) =>
            item.query === query ? { ...item, count: item.count + 1, lastUsed: Date.now() } : item
          )
          .sort((a, b) => b.count - a.count)
      } else {
        return [...prev, { query, count: 1, lastUsed: Date.now() }]
          .sort((a, b) => b.count - a.count)
          .slice(0, 10) // Keep top 10
      }
    })
  }, [])

  const clearHistory = useCallback(() => {
    setSearchHistory([])
  }, [])

  return {
    searchHistory,
    popularSearches,
    addSearch,
    clearHistory,
  }
}

// Advanced search hook
export function useAdvancedSearch(posts) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [isSearching, setIsSearching] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const { addSearch } = useSearchAnalytics()

  const searchResults = useMemo(() => {
    if (!debouncedQuery && !Object.keys(filters).length) return posts

    setIsSearching(true)
    const results = searchPosts(posts, debouncedQuery, filters)
    setIsSearching(false)

    // Track search analytics
    if (debouncedQuery) {
      addSearch(debouncedQuery, results.length)
    }

    return results
  }, [posts, debouncedQuery, filters, addSearch])

  const suggestions = useMemo(() => {
    return getSearchSuggestions(posts, query)
  }, [posts, query])

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  const clearSearch = useCallback(() => {
    setQuery('')
    setFilters({})
  }, [])

  return {
    query,
    setQuery,
    filters,
    updateFilter,
    clearFilters,
    clearSearch,
    searchResults,
    suggestions,
    isSearching,
    hasActiveFilters: Object.keys(filters).length > 0,
  }
}

// Export search utilities
export default {
  fuzzySearch,
  searchPosts,
  getSearchSuggestions,
  useDebounce,
  useSearchAnalytics,
  useAdvancedSearch,
}
