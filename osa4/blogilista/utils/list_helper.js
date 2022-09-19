const lodash = require("lodash");

const dummy = (blogs) => {
    return Number(1)
  }

const totalLikes = (blogs) => {

    var likes = blogs.reduce((sum, blog) =>  sum + blog.likes, 0)
    return blogs.length === 0 ? 0: likes
}

const favoriteBlog = (blogs) => {

    var mostLikes = blogs.reduce((most, current) => most.likes > current.likes ? most : current);
    delete mostLikes['__v']
    delete mostLikes['_id']
    delete mostLikes['url']
    return mostLikes
}

const mostBlogs = (blogs) => {

  if (blogs.length === 0) return null

  const countedBlogs = lodash.countBy(blogs, "author")

  const authorWithMostBlogs = Object.keys(countedBlogs).reduce((a, b) => {
    return countedBlogs[a] > countedBlogs[b] ? a : b
  })

  return {
    author: authorWithMostBlogs,
    blogs: countedBlogs[authorWithMostBlogs]
  }
}

const mostLikes = (blogs) => {

  if (blogs.length === 0) return null

  const authors = lodash(blogs)
  .groupBy("author")

  const countedLikes = authors.map((obj, key) => ({
      author: key,
      likes: lodash.sumBy(obj, "likes"),
    }))
    .value()

  const mostLikes = countedLikes.reduce((a, b) => {
    return a.likes > b.likes ? a : b
  })
  
  return mostLikes
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }