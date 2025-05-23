import express from 'express'

const app = express();
const Port = 5000

app.get('/',(req,res)=>{
    res.send('Working')

})

app.listen(Port,()=>{
    console.log(`App Working on ${Port}`);
})