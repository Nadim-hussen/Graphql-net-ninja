// https://www.apollographql.com/docs/react/get-started

import { ApolloServer } from "@apollo/server";
import {startStandaloneServer} from "@apollo/server/standalone"

// import typeDefs from schema.js
import {typeDefs} from './schema.js'

// import database file
import db from './_db.js'

const resolvers ={
    Query:{
        // 1.
        games(){
            return db.games
        },
        reviews(){
            return db.reviews
        },
        authors(){
            return db.authors
        },
        // query ExampleQuery {
        //     reviews {
        //       id,
        //     }
        //     games {
        //       id
        //     }
        //   }

        // 2.
        // review(parent, args, context) context use with authentication purpose
        // query ExampleQuery($id: ID!) {
        //     review(id:$id) {
        //       content,
        //       rating
        //     }
        //   }
        // variable o json data {"id":"1",} pass
        review(_, args) {
            return db.reviews.find((review) => review.id === args.id)
          },
        game(_, args) {
            return db.games.find((game) => game.id === args.id)
          },
        author(_, args) {
            return db.authors.find((author) => author.id === args.id)
          }
    },
    Game: {
        reviews(parent) {
          return db.reviews.filter((r) => r.game_id === parent.id)
        }
    },
    Review: {
        author(parent) {
          return db.authors.find((a) => a.id === parent.author_id)
        },
        game(parent) {
          return db.games.find((g) => g.id === parent.game_id)
        }
        // query ReviewQuery($id: ID!, ) {
        //     review(id: $id) {
        //       id,
        //       game{
        //         id,
        //         title
        //       },
        //       author{
        //         id
        //         name
        //       }
        //     }
        //   } variable o json data {"id":"1",} pass
    },
    Author: {
        reviews(parent) {
          return db.reviews.filter((r) => r.author_id === parent.id)
        }
        // query AuthorQuery($id: ID!, ) {
        //     author(id: $id) {
        //       id,
        //       reviews{
        //         id,
        //         rating
        //       }
        //     }
        //   } variable o json data {"id":"1",} pass
    },
    Mutation:{
        addGame(_, args) {
            let game = {
              ...args.game,
              id: Math.floor(Math.random() * 10000).toString()
            }
            db.games.push(game)

            return game
          },
        //   mutation addMUtation($game: AddGameInput!, ) {
        //     addGame(game: $game) {
        //       id,
        //       title,
        //       platform
        //     }
        //   }{"game" : {"title":"A New Game Added","platform":["Ps5","Cricket"] } }


          deleteGame(_, args) {
            db.games = db.games.filter((g) => g.id !== args.id)

            return db.games
          },
        //   mutation DeleteMutation($id:ID!){
        //     deleteGame(id:$id){
        //       id,
        //       title
        //     }
        //   } variable o json data {"id":"1",} pass

        updateGame(_, args) {
            db.games = db.games.map((g) => {
              if (g.id === args.id) {
                return {...g, ...args.edits}
              }

              return g
            })

            return db.games.find((g) => g.id === args.id)
          }
        //   mutation updateMUtation($edits: EditGameInput!, $id:ID!) {
        //     updateGame(edits: $edits,id:$id) {
        //       id,
        //       title,
        //       platform
        //     }
        //   } {"edits":{"title":"Update Oise"},"id":"2"}
        }
}
// start server setup
const server = new ApolloServer({
    // Apollo server object aspect two properties : typeDefs, resolvers.

    typeDefs,
    resolvers
})

const {url} = await startStandaloneServer(server,{
    listen:{port:4000}
})

console.log('server started at 4000');