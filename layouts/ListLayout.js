import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { useState, useCallback } from 'react'
import Pagination from '@/components/Pagination'
import formatDate from '@/lib/utils/formatDate'
import AdvancedSearch from '@/components/AdvancedSearch'

export default function ListLayout({ posts, title, initialDisplayPosts = [], pagination }) {
  const [searchResults, setSearchResults] = useState(posts)
  const [isSearchActive, setIsSearchActive] = useState(false)

  const handleSearchResults = useCallback(
    (results) => {
      setSearchResults(results)
      setIsSearchActive(
        results.length !== posts.length ||
          results.some((result, index) => result.slug !== posts[index]?.slug)
      )
    },
    [posts]
  )

  // Use search results when search is active, otherwise use initial display posts
  const displayPosts = isSearchActive
    ? searchResults
    : initialDisplayPosts.length > 0
    ? initialDisplayPosts
    : posts

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>

          {/* Advanced Search Component */}
          <AdvancedSearch
            posts={posts}
            onSearchResults={handleSearchResults}
            className="max-w-2xl"
          />
        </div>

        {/* Search Results Summary */}
        {isSearchActive && (
          <div className="border-b border-gray-200 py-4 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {searchResults.length === 0 ? (
                  'No posts found matching your search criteria.'
                ) : (
                  <>
                    Found <span className="font-medium">{searchResults.length}</span> post
                    {searchResults.length !== 1 ? 's' : ''}
                    {searchResults.length !== posts.length && (
                      <span className="text-gray-500"> out of {posts.length} total posts</span>
                    )}
                  </>
                )}
              </p>

              {/* Search Score Indicator for Development */}
              {process.env.NODE_ENV === 'development' &&
                searchResults.length > 0 &&
                searchResults[0].searchScore && (
                  <div className="text-xs text-gray-400">
                    Top score: {searchResults[0].searchScore.toFixed(1)}
                  </div>
                )}
            </div>
          </div>
        )}

        <ul>
          {displayPosts.length === 0 && (
            <li className="py-12">
              <div className="text-center">
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
                  No posts found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            </li>
          )}

          {displayPosts.map((frontMatter) => {
            const { slug, date, title, summary, tags, searchScore } = frontMatter
            return (
              <li key={slug} className="py-4">
                <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>{formatDate(date)}</time>

                      {/* Search Score for Development */}
                      {process.env.NODE_ENV === 'development' && searchScore && (
                        <div className="mt-1 text-xs text-gray-400">
                          Score: {searchScore.toFixed(1)}
                        </div>
                      )}
                    </dd>
                  </dl>
                  <div className="space-y-3 xl:col-span-3">
                    <div>
                      <h3 className="text-2xl font-bold leading-8 tracking-tight">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-gray-900 transition-colors hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400"
                        >
                          {title}
                        </Link>
                      </h3>
                      <div className="mt-2 flex flex-wrap">
                        {tags?.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                    </div>
                    <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                      {summary}
                    </div>

                    {/* Read More Link */}
                    <div className="text-base font-medium leading-6">
                      <Link
                        href={`/blog/${slug}`}
                        className="text-primary-500 transition-colors hover:text-primary-600 dark:hover:text-primary-400"
                        aria-label={`Read more about "${title}"`}
                      >
                        Read more &rarr;
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Pagination - Only show when not searching */}
      {pagination && pagination.totalPages > 1 && !isSearchActive && (
        <div className="mt-8">
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        </div>
      )}

      {/* Back to All Posts when searching */}
      {isSearchActive && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setSearchResults(posts)
              setIsSearchActive(false)
            }}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            Show All Posts
          </button>
        </div>
      )}
    </>
  )
}
