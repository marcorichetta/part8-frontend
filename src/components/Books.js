import React from 'react'


const Books = ({ show, result }) => {

  if (!show) {
    return null
  }

  if (result.data === undefined) {
    return "Books cannot be gathered from backend"
  }

  if (result.loading) {
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
          {result.data.allBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books