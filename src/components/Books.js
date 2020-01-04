import React, { useState } from 'react'


const Books = ({ show, result }) => {

  const [booksToShow, setBooksToShow] = useState('')
  const [filter, setFilter] = useState('ALL')

  const handleFilter = (event) => {
    setFilter(event.target.textContent)
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

  // Get all genres and flat to a single array
  const allGenres = result.data.allBooks.map(b => b.genres).flat()

  // Remove duplicates
  const uniqueGenres = [...new Set(allGenres)]

  let booksByGenre = result.data.allBooks

  if (filter !== 'ALL') {
    booksByGenre = result.data.allBooks.filter(b => b.genres.includes(filter))
  }
  
  //Return an array with the books which contain the genre (filter)

  return (
    <div>
      <h2>books</h2>

      {filter === 'ALL' 
      ? <h4>No filter</h4>
      : <>
          <h4>Filtered by {filter}</h4>
          <button onClick={() => setFilter('ALL')}>Remove filter</button>
        </>
      }
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
          {result.data && 
            booksByGenre.map(a =>
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
          onClick={handleFilter}>{g}</button>)
      }
    </div>
  )
}

export default Books