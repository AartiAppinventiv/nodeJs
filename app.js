const express = require('express');
const app = express();
const JSONToCSV = require('json2csv').parse;
const fs = require('file-system')

app.use(express.json())

const members = [
    {
        
    }
]

let idCount = 1;
app.post('/',(req,res)=>{
    console.log(req.body);
    const newMem = req.body;
        console.log(newMem);
    
    members.push(newMem);
    //res.json(members);
     const csv = JSONToCSV(members,{Fields :["id","FirstName","LastName","Address","Pincode","MobileNo"]});
     fs.writeFileSync('./test.csv',csv);
     res.send(newMem);
})

app.listen(3000, ()=> {
    console.log('server is listen on port 3000');
})

