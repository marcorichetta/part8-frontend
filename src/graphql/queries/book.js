import { gql } from "apollo-boost"
import { BOOK_DETAILS } from "../fragments/book"

export const ALL_BOOKS = gql`
  query {
    allBooks {
      ...BookDetails
    }
  }
${BOOK_DETAILS}
`
