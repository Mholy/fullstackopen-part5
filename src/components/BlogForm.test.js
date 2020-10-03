import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('<BlogForm /> calls submit handler with right details', () => {
  const createBlog = jest.fn()
  const component = render(<BlogForm createBlog={createBlog} />)

  fireEvent.change(component.container.querySelector('#title'), {
    target: {
      value: 'Blog Title',
    },
  })
  fireEvent.change(component.container.querySelector('#author'), {
    target: {
      value: 'Author Name',
    },
  })
  fireEvent.change(component.container.querySelector('#url'), {
    target: {
      value: 'blogurl.com',
    },
  })
  fireEvent.click(component.getByText('create'))

  const formSubmitValue = createBlog.mock.calls[0][0]
  expect(formSubmitValue.title).toBe('Blog Title')
  expect(formSubmitValue.author).toBe('Author Name')
  expect(formSubmitValue.url).toBe('blogurl.com')
})
