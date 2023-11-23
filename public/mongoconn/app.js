// const express = require('express');
// const { MongoClient } = require('mongodb');

// const app = express();
// const port = 3000;

// const mongoUrl = 'mongodb://localhost:27017/';
// const dbName = 'proj';

// app.get('/', async (req, res) => {
//   try {
//     const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
//     await client.connect();

//     const db = client.db(dbName);
//     const collection = db.collection('info');

//     const result = await collection.find({}).toArray();

//     res.send(`
//       <html>
//         <head>
//           <title>MongoDB Data</title>
//         </head>
//         <body>
//           <h1>MongoDB Data</h1>
//           <ul>
//             ${result.map(item => `<li>${item.country} - ${item.info}</li>`).join('')}
//           </ul>
//         </body>
//       </html>
//     `);

//     client.close();
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });



const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

// MongoDB connection details
const mongoUrl = 'mongodb://localhost:27017/';
const dbName = 'proj';

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define a route to handle requests to "/"
app.get('/', (req, res) => {
    // Redirect to the worldmap.html page
    res.redirect('/worldmap.html');
});

// Define a route to handle requests to "/countryinfo"
app.get('/countryinfo', async (req, res) => {
    try {
        const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const db = client.db(dbName);
        const collection = db.collection('info');

        // Extract the countryId from the query parameters
        const countryId = req.query.countryId;
        const year = req.query.year;

        // Retrieve information for the specified country from MongoDB
        const result = await collection.findOne({ country: countryId });

        // Check if the country was not found
        if (!result) {
            res.status(404).send('Country info not found');
            return;
        }

        // Render an HTML page with the country information
        res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${countryId}</title>
    <style>
    
        html{
            background-color: rgb(135, 122, 234);
        }

        body {
            font-family: 'Arial', sans-serif;
            padding: 20px;
            background-color: #f4f4f4;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            flex-direction: column; 
        }

        h2 {
            color: red;
            margin-top: 20px;
            font-size:35px;
        }

        .info{
            color: #333;
            border: 2px solid #3498db;
            padding: 15px;
            border-radius: 10px;
            background-color: #fff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            
        }

        * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    }
    
    body {
        justify-content: center;
        align-items: center;
        display: flex;
        min-height: 100vh;
        background: url('home.jpg') no-repeat;
        background-size: cover;
        background-position: center;
    }
    
    .main-logo {
        position: absolute;
        left: 10px;
        top: 10px; 
    }
    
    .navigation{
        position: absolute;
        right:20px;
        top:20px;
    }
    
    header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        width: 100%;
        padding: 20px 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        z-index: 99;
    }
    
    .logo {
        font-size: 2em;
        color: white;
        user-select: none;
    }
    
    .navigation a {
        position: relative;
        font-size: 1.1em;
        color: white;
        text-decoration: none;
        font-weight: 500;
        margin-left: 40px;
    
    }
    
    .navigation .btnLogin-popup {
        width: 130px;
        height: 50px;
        background: transparent;
        border: 2px solid whitesmoke;
        outline: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1.1em;
        color: white;
        font-weight: 500;
        margin-left: 40px;
        transition: .5s;
    }
    
    .navigation .btnLogin-popup:hover {
        background: white;
        color: #210011;
    }
    
    .navigation a::after {
        content: '';
        left: 0;
        bottom: -6px;
        position: absolute;
        width: 100%;
        height: 3px;
        background: white;
        transform-origin: right;
        border-radius: 5px;
        transform: scaleX(0);
        transition: transform .5s;
    }
    
    .navigation a:hover:after {
        transform: scaleX(1);
        transform-origin: left;
    }
    
    .wrapper {
        position: relative;
        width: 400px;
        height: 440px;
        background: transparent;
        border: 2px solid gray;
        border-radius: 20px;
        backdrop-filter: blur(20px);
        box-shadow: 0 0 30px black;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        transform: scale(0);
        transition: transform .5s ease, height .2s ease;
    }
    
    .wrapper .form-box {
        width: 100%;
        padding: 40px;
    }
    
    .form-box h2 {
        font-size: 2em;
        color: white;
        text-align: center;
    }
    
    .input-box {
        position: relative;
        width: 100%;
        height: 50px;
        border-bottom: 2px solid;
        margin: 30px 0;
    }
    
    .input-box label {
        position: absolute;
        top: 50%;
        left: 5px;
        transform: translateY(-50%);
        font-size: 1em;
        font-weight: 500;
        pointer-events: none;
        transition: .5s;
    }
    
    .input-box input {
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
        outline: none;
        font-size: 1em;
        font-weight: 600;
        padding: 0 35px 0 5px;
    }
    
    .input-box .icon {
        position: absolute;
        right: 8px;
        font-size: 1.2em;
        line-height: 57px;
    
    }
    
    .input-box input:focus~label,
    .input-box input:valid~label {
        top: -5px;
    
    }
    
    .remember-forgot {
        font-size: 0.9em;
        font-weight: 500;
        margin: -15px 0 15px;
        display: flex;
        justify-content: space-between;
    }
    
    .remember-forgot label input {
        cursor: pointer;
        accent-color: black;
        margin-right: 3px;
    }
    
    .remember-forgot a {
        color: rgb(255, 162, 0);
        ;
        text-decoration: none;
    }
    
    .remember-forgot a:hover {
        text-decoration: underline;
    }
    
    .btn {
        width: 100%;
        height: 45px;
        background: rgb(255, 106, 0);
        border: none;
        outline: none;
        border-radius: 40px;
        cursor: pointer;
        font-size: 1em;
        color: white;
        font-weight: 500;
    }
    
    .login_register {
        font-size: .9em;
        text-align: center;
        font-weight: 400;
        margin: 25px 0 10px;
        color: white;
    }
    
    .login_register p a {
        color: rgb(255, 162, 0);
        text-decoration: none;
        font-weight: 700;
    }
    
    .forgot_login_register{
        color:whitesmoke;
        text-decoration: none;
        font-weight: 700;
        margin-top: 20px;
        text-align: center;
    }
    
    .forgot_login_register a{
        color: rgb(255, 162, 0);
        text-decoration: none;
        font-weight: 700;
    }
    
    .forgot_login_register a:hover {
        text-decoration: underline;
    }
    
    
    .login_register p a:hover {
        text-decoration: underline;
    }
    
    .wrapper .icon-close {
        position: absolute;
        top: 0;
        right: 0;
        height: 45px;
        width: 45px;
        font-size: 3em;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #210011;
        border-bottom-left-radius: 20px;
        cursor: pointer;
        z-index: 1;
    
    }
    
    .wrapper .form-box.register {
        position: absolute;
        transition: none;
        transform: translateX(400px);
    }
    
    .wrapper.active {
        height: 520px;
    }
    
    .wrapper.active1{
        height: 360px;
    }
    
    .wrapper.active .form-box.login {
        transition: none;
        transform: translateX(-400px);
    }
    
    .wrapper.active1 .form-box.login {
        transition: none;
        transform: translateX(-400px);
    }
    
    .wrapper .form-box.login {
        transition: transform .18s ease;
        transform: translateX(0);
    }
    
    .wrapper.active .form-box.register {
        transition: transform .18s ease;
        transform: translateX(0);
    }
    
    .wrapper.active-popup{
        transform: scale(1);
    }
    
    .wrapper.active-popup.active{
        transform: scale(1);
    }
    
    .wrapper.active1 .form-box.forgot{
    
        transition: transform .18s ease;
        transform: translateX(0);
    }
    
    .wrapper .form-box.forgot{
        position: absolute;
        transition: none;
        transform: translateX(400px);
    }
    
    .wrapper.active-popup.active1{
        transform: scale(1);
    }
    
    input{
        color: whitesmoke;
    }

    </style>
            </head>
            <body>
            <header>
    <h1><p class="main-logo">MemoryLane</p></h1>
    <nav class="navigation">
       
  </nav>
  
  </header>
                <h2>${countryId}</h2>
                <p class="info">${result.info}</p>
            </body>
            </html>
        `);

        client.close();
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// ... (other server setup code)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
