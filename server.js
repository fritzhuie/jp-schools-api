
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const morgan = require("morgan")
const cors = require('cors')

//  Allows forms to work properly with delete and put requests
const methodOverride = require('method-override')

const app = express();
const {PORT = 2000, MONGODB_URI} = process.env;

console.log(MONGODB_URI)

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewURLParser: true
})


mongoose.connection
.on('open', () => console.log('connected to mongo'))
.on('close', () => console.log('disconnected from mongo'))
.on('error', () => console.log(error))

const cardSchema = new mongoose.Schema(
    {
      word: {
          type: String, required: true},
          definition: {type: String, required: true},
          example: String,
          deckTag: {type: String, required: true},
          deckId: {type: String, required: true}
    }
  );
  
const Card = mongoose.model("Card", cardSchema);
  
const deckSchema = new mongoose.Schema (
    {
      deckTag: {type: String, required: true}
    }
);

const Deck = mongoose.model("Deck", deckSchema);

////////////////////////
//  Middleware
////////////////////////
//  Prevent cors errors
app.use(cors())
//  Logging
app.use(morgan('dev'))
//  Parse JSON bodies
app.use(express.json())
//  Form requests put and delete
app.use(methodOverride('_method'))
//  Parse urlencoded request
app.use(express.urlencoded({extended: true}))

////////////////////////
//  Routes and Routers
////////////////////////
app.get('/', (req, res) => {
    res.send('DICTIONARY APP!!')
})

//  Index Route - get request to /api/my/decks gets us all the decks
app.get('/api/my/decks', async (req, res) => {
    try {
        //  Send all decks
        res.json(await Deck.find({}))
    } catch(error) {
        //  send error
        res.status(400).json({error})
    }
})

//  Index Route - get request to /api/my/decks gets us all the decks
app.get('/api/my/decks/:id', async (req, res) => {
    try {
        //  Send all decks
        res.json(await Deck.findById(req.params.id))
    } catch(error) {
        //  send error
        res.status(400).json({error})
    }
})

//  Create Route - Post request to /api/my/decks creates a deck from json body
app.post("/api/my/decks", async (req, res) => {
    try{
        //  Create a new deck
        res.json(await Deck.create(req.body))
    } catch (error){
        //  Send error message
        res.status(400).json({error})
    }
})

//  Create Route - Post request to /api/my/decks creates a card from a json body
app.post("/api/my/card", async (req, res) => {
    try{
        //  Create a new card
        res.json(await Card.create(req.body))
    } catch(error){
        //  Send error message
        res.status(400).json({error})
    }
})

//  Update Route - Put request to /api/my/decks/:id updates a specified deck
app.put("/api/my/decks/:id", async (req, res) => {
    try{
        res.json(
            await Deck.findByIdAndUpdate(req.params.id, req.body, {new: true}
            )
        )
    } catch(error){
        res.status(400).json({error})
    }
})

//  Destroy Route - delete request to /api/my/decks/:id
app.delete("/api/my/decks/:id", async (req, res) => {
    try {
        res.json(await Deck.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json({error})
    }
})

//  Destroy Route - delete request to /api/my/card/:id
app.delete("/api/my/card/:id", async (req, res) => {
    try {
        res.json(await Card.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json({error})
    }
})

//  Show Route - get request to /api/my/decks/:id
// app.get("/api/my/decks/:id", (req, res) => {
//     res.render("deckshow.html", {deck: Deck[req.params.id], title: "decks show-page"})
// })

//  Show Route - get request to /api/my/decks/:id
// app.get("/api/my/card/:id", (req, res) => {
//     res.render({card: Card[req.params.id], title: "cards show-page"})
// })

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})