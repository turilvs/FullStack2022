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

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }