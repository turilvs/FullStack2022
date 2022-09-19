import React from "react"
import "@testing-library/jest-dom/extend-expect"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BlogForm from "./BlogForm"

test("BlogForm uses right content in callback functions", async () => {

  const user = userEvent.setup()
  const createBlog = jest.fn()

  render( <BlogForm createBlog={createBlog} /> )

  const titleInput = screen.getByTestId("title")
  const authorInput = screen.getByTestId("author")
  const urlInput = screen.getByTestId("url")
  const createBtn = screen.getByText("create")

  await user.type(titleInput, "title")
  await user.type(authorInput, "author")
  await user.type(urlInput, "https://www.artsinBlogi.com/")
  await user.click(createBtn)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toBe("title")
  expect(createBlog.mock.calls[0][1]).toBe("author")
  expect(createBlog.mock.calls[0][2]).toBe("https://www.artsinBlogi.com/")
})