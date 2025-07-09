import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { BlogSEO } from '@/components/SEO'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import Comments from '@/components/comments'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { useEffect } from 'react'

const editUrl = (fileName) => `${siteMetadata.siteRepo}/blob/master/data/blog/${fileName}`
const discussUrl = (slug) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `${siteMetadata.siteUrl}/blog/${slug}`
  )}`

const postDateTemplate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

function generateTableOfContents() {
  function isHeading(node) {
    return /^H[1-6]$/i.test(node.tagName)
  }
  const markdownInput = document.getElementById('content-container')

  let tocContent = '<ul>'

  for (const child of markdownInput.childNodes) {
    if (isHeading(child)) {
      const level = child.tagName[1]
      const text = child.textContent

      const slug = child.id // Inside your generateTableOfContents function
      tocContent += `<li><a id="toc-${slug}" href="#${slug}" style="margin-left: ${
        level * 8
      }px; font-size: ${15 - level}px;">${text}</a></li>`
    }
  }

  tocContent += '</ul>'

  // Create a new element to wrap the table of contents
  const tocWrapper = document.getElementById('toc')
  tocWrapper.innerHTML = tocContent
}

export default function PostLayout({ frontMatter, authorDetails, next, prev, children }) {
  const { slug, fileName, date, title, images, tags } = frontMatter

  useEffect(() => {
    generateTableOfContents() // Call the function to generate the Table of Contents

    // Add event listener for scroll
    window.addEventListener('scroll', handleScroll)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, []) // Run only once after the initial render

  // Function to handle scroll and adjust TOC position
  const handleScroll = () => {
    const toc = document.querySelector('.toc')
    if (toc) {
      const tocItems = document.querySelectorAll('.toc a')

      tocItems.forEach((tocItem) => {
        const targetId = tocItem.getAttribute('href').substring(1)
        const targetElement = document.getElementById(targetId)

        if (
          targetElement.offsetTop <= window.scrollY &&
          targetElement.offsetTop + targetElement.offsetHeight > window.scrollY
        ) {
          tocItem.classList.add('text-primary-600')
        } else {
          tocItem.classList.remove('text-primary-600')
        }
      })

      const isScrolledPast = window.scrollY > toc.offsetTop + 600
      if (isScrolledPast) {
        toc.classList.add('fixed', 'top-0')
      } else {
        toc.classList.remove('fixed', 'top-0')
      }
    }
  }

  return (
    <SectionContainer>
      <BlogSEO
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
        authorDetails={authorDetails}
        {...frontMatter}
      />
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0"
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            {/* <dl className="pt-6 pb-10 xl:border-b xl:border-gray-200 xl:pt-11 xl:dark:border-gray-700">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex justify-center space-x-8 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width="38px"
                          height="38px"
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <dl className="whitespace-nowrap text-sm font-medium leading-5">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                        <dt className="sr-only">Twitter</dt>
                        <dd>
                          {author.twitter && (
                            <Link
                              href={author.twitter}
                              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {author.twitter.replace('https://twitter.com/', '@')}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl> */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div id="content-container" className="prose max-w-none pb-8 pt-10 dark:prose-dark">
                {children}
              </div>
              {/* <div className="pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
                <Link href={discussUrl(slug)} rel="nofollow">
                  {'Discuss on Twitter'}
                </Link>
                {` • `}
                <Link href={editUrl(fileName)}>{'View on GitHub'}</Link>
              </div>
              <Comments frontMatter={frontMatter} /> */}
            </div>
            <footer className="md:pl-4">
              <div className="divide-gray-200 text-sm font-medium leading-5 dark:divide-gray-700 xl:col-start-1 xl:row-start-2 xl:divide-y">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Tags
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Previous Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/blog/${prev.slug}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && (
                      <div>
                        <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Next Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                          <Link href={`/blog/${next.slug}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href="/blog"
                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  &larr; Back to the blog
                </Link>
              </div>
              <div
                id="toc"
                className="toc hidden pt-4 text-sm text-gray-500 dark:text-gray-400 md:block xl:pt-8"
              >
                {/* Table of Contents section */}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
