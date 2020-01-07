import { gql } from "apollo-boost";

export const CREATE_BOOK = gql`
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