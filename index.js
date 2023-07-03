const express = require('express')
const { MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectId; // table er prottek value er id nite use hoy
const cors = require('cors');

const app = express()
const port = 5000

app.use(cors());
app.use(express.json());
//client er kaaj hocce URI er sathe database er connct kore dewa
// 0MFXnRSA4aAztuKk
const uri = 'mongodb+srv://Mobile_store:0MFXnRSA4aAztuKk@cluster0.db93m8c.mongodb.net/?retryWrites=true&w=majority';
// const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, 
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
    });


app.get('/', (req, res) => {
  res.send('Hellos samsung World!')
})

async function run()
{
    
    try{
        await client.connect();
        const database = client.db('Mobile_Store');
        const serviceCollection = database.collection("services");
        const serviceCollection1 = database.collection("ucomming");
        const serviceCollection2 = database.collection("UserInfo");
          // send services to the database
          console.log("data base connectted")
          //to add in datbase

          //  app databse er services name er ekta tablee 
          // add korbo
          app.post('/services', async (req, res) => 
          {
            const service = req.body;

            const result = await serviceCollection.insertOne(service);
            // console.log(result);
            res.json(result)
           }),


           app.post('/upcomming', async (req, res) => 
          {
            const service = req.body;

            const result = await serviceCollection1.insertOne(service);
            // console.log(result);
            res.json(result)
           },
           
        ),
       

         //add user

        app.post('/UserInfo', async (req, res) => 
        {
          const service = req.body;

          const result = await serviceCollection2.insertOne(service);
          // console.log(result);
          res.json(result)
         },
         
     );
        
     
        

         // update data

         // travling app databse er services name er ekta tablee 
          // update korbo
          // put er kaaj hoccce database e dewa id ta na pele
          //insert korbe ar pele update korbe
         app.put('/services/:id', async (req, res) => 
         {
            const id = req.params.id;
            //skddsdddsddddd
            //id.trim();
            //eikane  trim e func ta kono white space takle remve kore
            console.log('updating', id)
            const updatedService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    // ki ki update korte hobe
                    name: updatedService.name,
                    price:updatedService.price,
                    desc:updatedService.desc,
                    img:updatedService.img,
                },
            };
            
            const result = await serviceCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
        });
         // get all data from  database
         app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const Servce = await cursor.toArray();
            res.send(Servce);
           
        });
        app.get('/upcomming', async (req, res) => {
            const cursor = serviceCollection1.find({});
            const Servce = await cursor.toArray();
            res.send(Servce);
           //res.json(Servce);
        });

        app.get('/UserInfo', async (req, res) => {
            const cursor = serviceCollection2.find({});
            const Servce = await cursor.toArray();
            res.send(Servce);
           //res.json(Servce);
        });


        // get a single data from services database
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service);
           // console.log(service);
        });


        
        

        // Delete an Order
       app.delete('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await serviceCollection.deleteOne(query);
        res.json(result);
    });
    }
    
    finally{

    }
   
}
run().catch(console.dir)
app.listen(port, () => {
  console.log(`App is running at port => ${port}`)
})