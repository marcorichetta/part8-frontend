import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Reccommendation from './components/Reccommendation'

import { gql } from 'apollo-boost'
import { useQuery, useMutation, useSubscription, useApolloClient } from 'react-apollo'

// Fragment used on ALL_BOOKS and BOOK_ADDED
const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    genres
    author {
      name
    }
  }
`

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
    ...BookDetails
  }
}
${BOOK_DETAILS}
`

const USER_INFO = gql`
{
  me {
    username
    favoriteGenre
  }
}
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
${BOOK_DETAILS}
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
  const userInfo = useQuery(USER_INFO)

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

  // Mantain the Apollo cache in sync with the subscriptions
  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map(p => p.id).includes(object.id)

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      dataInStore.allBooks.push(addedBook)
      client.writeQuery({
        query: ALL_BOOKS,
        data: dataInStore
      })
    }
  }

  // Subscribe to added books
  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {

      let newBook = subscriptionData.data.bookAdded

      // Show notification
      window.alert(`New book added: ${newBook.title} by ${newBook.author.name}`)

      // Update Apollo cache
      updateCacheWith(newBook)
    }
  })
  
  /* GraphQL Mutations Hooks */
  const [addBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query:  ALL_AUTHORS }, { query: ALL_BOOKS }],
    update: (store, response) => {
      updateCacheWith(response.data.addBook)
    }
  })

  const [editAuthor] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const [login] = useMutation(LOGIN, {
    onError: handleError,
    refetchQueries: [{ query: USER_INFO }]
  })


  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()

    setPage('authors')
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
              <button onClick={() => setPage('reccommendations')}>reccommendations</button>
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

      <Reccommendation
        show={page === 'reccommendations'}
        result={{
          "user": userInfo,
          "books": books
        }}
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