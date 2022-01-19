const mongoose = require('mongoose')

async function connect(){
    mongoose.connect("mongodb+srv://dbadmin:IUyVQpA3smsuhl0v@cluster0.eyjvc.mongodb.net/DatabaseFOG?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    mongoose.connection
    .once('open',()=> console.log('Database FOG has been connected !!!'))
    .on('error',(error)=>{
        console.log("Can not connect to Database !!!", error)
    })
    }

module.exports = { connect }