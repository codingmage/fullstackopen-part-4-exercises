const _ = require("lodash")

const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	return blogs.reduce(
		function (accumulator, numberOfLikes) {
			return accumulator + numberOfLikes.likes
		}, 0)
}

const favoriteBlog = (blogs) => {
	if (blogs.length === 0) {
		return "No blogs"
	}

	return blogs.reduce((mostLikes, thisLikes) => mostLikes.likes > thisLikes.likes ? mostLikes : thisLikes)

}

const mostBlogs = (blogs) => {
	if (blogs.length === 0) {
		return "No blogs"
	}

	const authorBlog = _.countBy(blogs, "author")

	const authorArray = _.chain(authorBlog)
		.map(function (times, name) { return { author: name, blogs: times }})
		.value()

	const sortedAuthors = _.sortBy(authorArray, "blogs")

	const authorWithMostBlogs = _.last(sortedAuthors)

	return authorWithMostBlogs
}

const mostLikes = (blogs) => {
	if (blogs.length === 0) {
		return "No blogs"
	}

	const omittedArray = blogs.map(blog => _.omit(blog, "title"))

	const likes = _.chain(omittedArray)
		.groupBy("author")
		.map((value, key) => ({
			"author": key,
			"likes": _.sumBy(value, "likes")
		}))
		.sortBy("likes")
		.value()

	const topLikes = _.last(likes)

	return topLikes
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}