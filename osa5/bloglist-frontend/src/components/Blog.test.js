import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Blog from "./Blog"

const blog = {
  title: "title",
  author: "author",
  url: "https://www.artsinBlogi.com/",
  likes: 0,
  user: {
    username: "username",
    name: "name",
  },
}

const mockHandler = jest.fn()

beforeEach(() => {
  render(
    <Blog key={blog.id} blog={blog} updateLikes={mockHandler} />
  )
})

test("renders title and author but not url or likes by default", () => {

  const title = screen.getByTestId("title")
  expect(title).toBeDefined()

  const author = screen.getByTestId("author")
  expect(author).toBeDefined()

  expect(screen.queryByTestId("url")).toBeNull()
  expect(screen.queryByTestId("likes")).toBeNull()

})

test("renders url and likes when view button is clicked", async () => {

  const user = userEvent.setup()
  const button = screen.getByTestId("info-btn")
  await user.click(button)

  const url = screen.getByTestId("url")
  expect(url).toBeInTheDocument()

  const likes = screen.getByTestId("likes")
  expect(likes).toBeInTheDocument()
})

test("clicking like-button twice calls event handler two times", async () => {

  const user = userEvent.setup()
  const info = screen.getByText("info")
  await user.click(info)

  const likebtn = screen.getByText("like")
  await user.click(likebtn)
  await user.click(likebtn)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
