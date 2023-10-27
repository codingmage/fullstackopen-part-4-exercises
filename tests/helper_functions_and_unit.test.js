const listHelper = require("../utils/list_helper")

test("dummy returns one", () => {
	const blogs = []

	const result = listHelper.dummy(blogs)
	expect(result).toBe(1)
})

describe("sum", () => {
	test("of total likes in array", () => {
		expect(listHelper.totalLikes([{ body: 2, likes: 1 }, { body: 2, likes: 2 }, { body: 2, likes: 3 }])).toBe(6)
	})

	test("of a one item array", () => {
		expect(listHelper.totalLikes([{ likes: 2 }])).toBe(2)
	})

	test("of an empty array is zero", () => {
		expect(listHelper.totalLikes([])).toBe(0)
	})
})

const blogs = [
	{
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		likes: 12,
	},
	{
		title: "React patterns",
		author: "Michael Chan",
		likes: 7,
	},
	{
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		likes: 5,
	},
	{
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		likes: 12,
	},
	{
		title: "First class tests",
		author: "Robert C. Martin",
		likes: 10,
	},
	{
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		likes: 0,
	},
	{
		title: "Type wars",
		author: "Robert C. Martin",
		likes: 2,
	}
]

describe("favorite", () => {

	const result = {
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		likes: 12
	}

	test("in this array", () => {
		expect(listHelper.favoriteBlog(blogs)).toEqual(result)
	})

	test("in an array with 1 element", () => {
		expect(listHelper.favoriteBlog([result])).toEqual(result)
	})

	test("in empty array", () => {
		expect(listHelper.favoriteBlog([])).toEqual("No blogs")
	})
})

describe("mostBlogs", () => {

	const result = { author: "Robert C. Martin", blogs: 3 }

	test("in this array", () => {
		expect(listHelper.mostBlogs(blogs)).toEqual(result)
	})

	test("in one element array", () => {
		expect(listHelper.mostBlogs([result])).toEqual({ author: "Robert C. Martin", blogs: 1 })
	})

	test("in empty array", () => {
		expect(listHelper.mostBlogs([])).toEqual("No blogs")
	})
})

describe("mostLikes", () => {

	const result = { author: "Edsger W. Dijkstra", likes: 29, }

	const singleArray = [  {
		title: "Type wars",
		author: "Robert C. Martin",
		likes: 2,
	}  ]

	test("in this array", () => {
		expect(listHelper.mostLikes(blogs)).toEqual(result)
	})

	test("in a single element array", () => {
		expect(listHelper.mostLikes(singleArray)).toEqual({    author: "Robert C. Martin", likes: 2 })
	})

	test("in an empty array", () => {
		expect(listHelper.mostLikes([])).toEqual("No blogs")
	})



})