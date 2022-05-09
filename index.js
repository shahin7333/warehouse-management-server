const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5wev9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

const manageUri = `mongodb+srv://${process.env.DB_USERMANAGE}:${process.env.DB_PASSMANAGE}@cluster0.5wev9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const Client = new MongoClient(manageUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    await client.connect()
    const productCollection = client
      .db('bicycleWarehouse')
      .collection('inventory')

    // //manage

    // await client.connect()
    const manageCollection = client
      .db('bicycleWarehouse')
      .collection('manageItem')

    app.get('/inventory', async (req, res) => {
      const query = {}
      const cursor = productCollection.find(query)
      const inventories = await cursor.toArray()
      res.send(inventories)
    })
    app.get('/inventory/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const inventory = await productCollection.findOne(query)
      res.send(inventory)
    })
    //manage
    app.get('/manage', async (req, res) => {
      const query = {}
      const cursor = manageCollection.find(query)
      const manages = await cursor.toArray()
      res.send(manages)
    })
    // addnewitem
    app.post('/manage', async (req, res) => {
      const newManage = req.body
      const result = await manageCollection.insertOne(newManage)
      res.send(result)
    })
    app.get('/manage/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id:ObjectId(id)}
        const manage=await manageCollection.findOne(query)
        res.send(manage)
    })

    //delete
    app.delete('/manage/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await manageCollection.deleteOne(query)
      res.send(result)
    })


  } finally {
  }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('running my bicycle server')
})

app.listen(port, () => {
  console.log('Listening to port', port)
})
