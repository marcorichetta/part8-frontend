import React, { useState } from 'react'


const Reccommendation = ({ show, result }) => {

    if (!show) {
        return null
    }

    console.log('asd', result)
    // Only checking books (Also should include the other query)
    if (result.books.data === undefined || result.user.data === undefined) {
        return "No reccommendation or not logged in"
    }

    if (result.books.loading) {
        return "Loading..."
    }

    // Destructuring
    const { user, books } = result

    const userFavoriteGenre = user.data.me.favoriteGenre
    const userFavoriteBooks = books.data.allBooks.filter(b => b.genres.includes(userFavoriteGenre))

    return (
        <div>
            <h2>Your Reccommendations</h2>

            <h4>Based on your favorite genre: {userFavoriteGenre}</h4>
            
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {userFavoriteBooks.map(a =>
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

export default Reccommendation