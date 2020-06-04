const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// console.log(__dirname)
// console.log(path.join(__dirname, '../public'))
// console.log(__filename)

const app = express()

// Define paths Express config 
const publicDirectoryPath = path.join(__dirname, '../public') 
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup Handlebars engine and views location 
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve 
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', { 
        title: 'Weather',
        name: 'Gagandeep'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Gagandeep'
    })
})


app.get('/help', (req, res) => {
    res.render('help', {
        helptext: 'This is some helpful text.',
        title: 'Help',
        name: 'Gagandeep'
    })
})

app.get('', (req, res) => {
    res.send('<h1>Weather</h1>')
})

// 

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error){
            return res.send({ error })
        }

        forecast (latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address 
            })
        })
    })

    // res.send({
    //     forecast:'It is raining.',
    //     location: 'Delhi',
    //     address: req.query.address
    // })
})  

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

// for --> localhost:3000/help/test (which does not exist)
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Gagandeep',
        errorMessage: 'Help article not found !'
    })
})

//for everything else 
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Gagandeep',
        errorMessage: 'Page not found !'
    })
})

// app.com
// app.com/help
// app.com/about

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})



// app.get('/help', (req, res) => {
    //     res.send([{
    //         name: 'Gagandeep',
    //     },{
    //         age: 20
    //     }])
    // })
    
    // app.get('/about', (req, res) => {
    //     res.send('<h1>About</h1>')
    // })