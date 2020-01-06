import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient } from 'react-apollo'

const BOOKS_BY_GENRE = gql`
  query booksByGenre($genreToSearch: String!) {
    allBooks(genre: $genreToSearch) {
      title
      published
      author {
        name
      }
    }
  }
`

const Books = ({ show, result }) => {

  const client = useApolloClient(BOOKS_BY_GENRE)

  /* State hooks */
  const [books, setBooks] = useState(null)
  const [currentGenre, setCurrentGenre] = useState(null)

  // It sends a parameterized query with the clicked genre
  // and sets books with the result obtained
  const showBooks = async (genre) => {
    const { data } = await client.query({
      query: BOOKS_BY_GENRE,
      variables: { genreToSearch: genre }
    })

    setBooks(data.allBooks)
    setCurrentGenre(genre)
  }

  if (!show) {
    return null
  }

  if (result.data === undefined) {
    return "Books cannot be gathered from backend"
  }

  if (result.loading) {
    return "Loading..."
  }

  // Rendered when there is a filter
  if (books) {
    return (
      <div>
      <h2>Filtered by genre: {currentGenre}</h2>
        <table>
          <tbody>
            <tr>
              <th>Title</th>
              <th>
                Author
            </th>
              <th>
                Published
            </th>
            </tr>
        {books.map(b => 
          <tr key={b.title}>
            <td>{b.title}</td>
            <td>{b.author.name}</td>
            <td>{b.published}</td>
          </tr> 
          )}
        </tbody>
      </table>
      <button onClick={() => setBooks(null)}>Remove filter</button>
      </div>
    )
  }

  // Get all genres and flat to a single array
  const allGenres = result.data.allBooks.map(b => b.genres).flat()

  // Remove duplicates
  const uniqueGenres = [...new Set(allGenres)]

  return (
    <div>
      <h2>All books</h2>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {result.data.allBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr> 
          )}
        </tbody>
      </table>

      {/* Filter */}
      {uniqueGenres.map(g => 
        <button
          key={g}
          onClick={() => showBooks(g)}>{g}</button>)
      }
    </div>
  )
}

export default Books