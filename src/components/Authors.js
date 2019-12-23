import React, { useState } from 'react'
import { useApolloClient, useQuery } from 'react-apollo'
import { gql } from 'apollo-boost'

const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    bookCount
  }
}
`

const Authors = (props) => {

  /* GraphQL Hooks */
  const authors = useQuery(ALL_AUTHORS)

  if (!props.show) {
    return null
  }

  if (authors.loading) {
    return "Loading..."
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}

export default Authors