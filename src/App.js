import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

import { gql } from 'apollo-boost'
import { useQuery, useApolloClient } from 'react-apollo'
import { useMutation } from 'react-apollo'

const ALL_AUTHORS = gql`
{
  allAuthors {
    id
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
    published
    genres
    author {
      name
    }
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
      author {
        name
      }
    }
  }
`

const EDIT_BIRTHYEAR = gql`
mutation editBirthYear($author: String!, $year: Int!) {
    editAuthor(name: $author, setBornTo: $year ) {
        name
        born
      }
}
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const App = () => {

  // Used to reset the cache when a user logs out
  const client = useApolloClient()

  /* GraphQL Hooks */
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)

  /* State Hooks */
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  /* Show error for 10 seconds */
  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  /* GraphQL Mutations Hooks */
  const [addBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query:  ALL_AUTHORS }, { query: ALL_BOOKS }],
  })

  const [editAuthor] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const errorNotification = () => errorMessage &&
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  
  return (

    <div>
      {errorNotification()}
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>


        {/* Conditional rendering based on existence of token */}
        {token 
          ? (
            <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={logout}>logout</button>
            </>
          )
          : (
            <button onClick={() => setPage('login')}>login</button>
          )
        }
      </div>

      <Authors
        show={page === 'authors'}
        result={authors}
        editAuthor={editAuthor}
      />

      <Books
        show={page === 'books'}
        result={books}
      />

      <NewBook
        show={page === 'add'}
        addBook={addBook}
      />

      <LoginForm
        show={page === 'login'}
        login={login}
        setToken={(token) => setToken(token)}
        setPage={(page) => setPage(page)}
      />

    </div>
  )
}

export default App