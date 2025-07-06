// Posts context for sharing blog posts data across components
import { createContext, useContext } from 'react'

const PostsContext = createContext([])

export const usePostsContext = () => {
  return useContext(PostsContext)
}

export const PostsProvider = ({ children, posts = [] }) => {
  return <PostsContext.Provider value={posts}>{children}</PostsContext.Provider>
}

export default PostsContext
