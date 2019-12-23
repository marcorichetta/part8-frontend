import React, { useState } from 'react'
import { useApolloClient, useQuery, useMutation } from 'react-apollo'
import { gql } from 'apollo-boost'

const Authors = ({ show, result, editAuthor }) => {

  const [author, setAuthor] = useState('')
  const [year, setYear] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    // Call the mutation function
    await editAuthor({
      variables: {
        author,
        year
      }
    })

    setAuthor('')
    setYear('')
  }

  if (!show) {
    return null
  }

  if (result.loading) {
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
          {result.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          Author
          <select onChange={({ target }) => setAuthor(target.value)}>
            {result.data.allAuthors.map(a => 
              <option key={a.id} value={a.name} >{a.name}</option>

              )}
          </select>
        </div>
        <div>
          born
            <input
            value={year}
            onChange={({ target }) => setYear(parseInt(target.value))}
          />
        </div>
        <button type='submit'>create book</button>

      </form>
    </div>
  )
}

export default Authors