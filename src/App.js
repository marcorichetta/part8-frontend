import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

import { gql } from 'apollo-boost'
import { useQuery } from 'react-apollo'
import { useMutation } from 'react-apollo'

const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    bookCount
  }
}
`

const ALL_BOOKS = gql`
{
  allBooks {
    title
    author
    published
  }
}
`


const CREATE_BOOK = gql`
  mutation createBook($title: String!, $published: Int!, $author: String, $genres: [String]) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ) {
      title
      published
      author
    }
  }
`

const App = () => {

  /* GraphQL Hooks */
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)

  /* State Hooks */
  const [page, setPage] = useState('authors')

  const [errorMessage, setErrorMessage] = useState(null)

  const [addBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query:  ALL_AUTHORS }, { query: ALL_BOOKS }],
  })

  return (
    <div>
      {errorMessage &&
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
      }
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      <Authors
        show={page === 'authors'}
        result={authors}
      />

      <Books
        show={page === 'books'}
        result={books}
      />

      <NewBook
        show={page === 'add'}
        addBook={addBook}
      />

    </div>
  )
}

export default App