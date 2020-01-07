import { gql } from "apollo-boost"

// Fragment used on ALL_BOOKS and BOOK_ADDED
export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    published
    genres
    author {
      name
    }
  }
`