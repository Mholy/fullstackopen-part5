import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: 'blogID',
    title: 'Blog Title',
    url: 'blogurl.xyz',
    likes: 0,
    author: 'Blog author',
  }

  const likeBlog = jest.fn()

  let component
  beforeEach(() => {
    component = render(<Blog blog={blog} likeBlog={likeBlog} />)
  })

  test('only title visible by default', () => {
    const title = component.getByText('Blog Title')

    expect(title).toBeDefined()

    const blogDetails = component.container.querySelector('.blogDetails')

    expect(blogDetails).toHaveStyle('display: none')
  })

  test('after clicking the button, blog details are visible', () => {
    const button = component.getByText('view')
    const blogDetails = component.container.querySelector('.blogDetails')

    fireEvent.click(button)

    expect(blogDetails).not.toHaveStyle('display: none')
  })

  test('like button clicked twice', () => {
    const button = component.getByText('like')

    fireEvent.click(button)
    fireEvent.click(button)

    expect(likeBlog.mock.calls).toHaveLength(2)
  })
})
