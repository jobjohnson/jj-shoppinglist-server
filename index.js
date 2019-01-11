const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');

mongoose.connect('mongodb://shoppinglist:shoppinglist1@ds151814.mlab.com:51814/jjdb');

var Shoppinglist = mongoose.model('Shoppinglist', {
    text: String,
    complete: Boolean
});

const typeDefs = `
  type Query {
    shoppinglists: [Shoppinglist]
  }
  type Shoppinglist {
      id: ID!
      text: String!
      complete: Boolean!
  }
  type Mutation {
      createShoppinglist(text: String!): Shoppinglist
      updateShoppinglist(id: ID!, complete: Boolean!): Boolean
      removeShoppinglist(id: ID!): Boolean
  }
`;

const resolvers = {
  Query: {
    shoppinglists: () => Shoppinglist.find()
  },
  Mutation: {
      createShoppinglist: async (_, { text }) => {
          const shoppinglist = new Shoppinglist({ text, complete: false});
          await shoppinglist.save();
          return shoppinglist;
      },
      updateShoppinglist: async (_, { id, complete }) => {
        await Shoppinglist.findByIdAndUpdate(id, { complete });
        return true;
      },
      removeShoppinglist: async (_, { id }) => {
          await Shoppinglist.findByIdAndRemove(id);
          return true;
      }
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  server.start(() => console.log('Server is running on localhost:4000'))
});
