import React from 'react'
import { gql } from 'apollo-boost'
import { useQuery } from 'react-apollo'

const ALL_BOOKS = gql`
{
  allBooks {
    title
    author
    published
  }
}
`

const Books = (props) => {

  /* GraphQL Hooks */
  const books = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  if (books.loading) {
    return "Loading..."
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.data.allBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books