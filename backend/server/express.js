const express = require('express')
const mongoose = require('mongoose')
const Item = require('../models/Item')
const User = require('../models/User')
const cors = require('cors')
const cookieparser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Schedule = require('../models/Schedule')
// multer is use for uploading files/photo
const multer = require('multer')
const upload = multer({ dest: 'server/uploads' })
const fs = require('fs')
const path = require('path')

const URL = 'mongodb+srv://renatodsantosjr9:ciVC3bWhYk5K0WCA@cluster0.58lnq9y.mongodb.net/?retryWrites=true&w=majority'
// realestatemernstack 
// password = ciVC3bWhYk5K0WCA
mongoose.connect('mongodb+srv://renatodsantosjr9:ciVC3bWhYk5K0WCA@cluster0.58lnq9y.mongodb.net/?retryWrites=true&w=majority')
.then(()=>console.log('connected'))
.catch(e=>console.log(e))

const salt = bcrypt.genSaltSync(10)
const secret = 'dkahsdahdiuwqheqblablcxijijdfn'

const app = express()
// cors is required in fetching they wont let you fetch for security reasons
// strict-origin-when-cross-origin warning may mean something wrong with cors
app.use(cors({credentials: true, origin: 'http://localhost:5173'}))
// express.json() PARSES ALL THE INCOMING REQUEST SO WE DONT NEED  
// TO PARSE IT IN EVERY API CALLS
app.use(express.json())
// cookie parser is use to accept cookie and get the credentials not having it 
// can make token unreadable
app.use(cookieparser())
// making images appear and accesible to web(only works if run locally)
// dirmame = C:\Users\USER\Desktop\ecommerce-full-stack\backend\server\ 
app.use('/uploads', express.static(__dirname + '/uploads' ))

app.get('/', async (req, res) => {
    const result = await Item.find()
    res.json(result)
})

app.post('/Register', async(req, res) => {
    let { email, password, username } = req.body
    // if the user does'nt put username then lets use email as username(editable later)
    if (!username) username = email
    
    const user = await User.create({
        email,
        password: bcrypt.hashSync(password, salt),
        Userinfo: {
            username: username
        }
    })
    res.status(200).json(user)
})

app.post('/Login', async (req, res) => {
    const { email, password } = req.body
    //check if he filled in requirements
    if (!email || !password) return res.status(400) 
    try {
        const user = await User.findOne({email})
        // checking if user exist
        if (!user) return res.status(400)
        const pass = user.password
        // cheking password
        const passOk = bcrypt.compareSync(password, pass)
        if (passOk) {
            // if verify then sign-in in jwt and give token
            jwt.sign({email, id: user._id}, secret, {}, (err, token) => {
                if (err) throw err
                res.cookie('token', token).json('ok')
            });
        } else {
            res.status(400)
        }

    } catch (error) {
        res.status(400).json(error)
    }
})

app.post('/Logout', async(req, res) => {
    res.clearCookie('token');
    return res.status(200).json('ok')
    // if (req.cookies)return
    // const { token } = req.cookies
    // return res.clearCookie(req.cookies, {domain: 'http://localhost:5173', path: '/'})
})

app.get('/Item/:id', async (req, res) => {
    const { token }  = req.cookies
    const { id } = req.params
    try {
        jwt.verify(token, secret, async (err, info) => {
            if (err) return res.status(400)
            let response = await Item.findById({_id: id})
            // modified to say the owner is him
            if (info.id === response.owner) response = {
                _id: response._id,
                title: response.title,
                category: response.category,
                description: response.description,
                url: response.url,
                ownerid : response.owner,
                owner: true
            }
            
            res.json(response)
        })
    } catch (error) {
        res.status(400).json(error)
    }
})

app.post('/post',upload.single('file') ,async (req, res) => {
    const { token } = req.cookies
    if (!req.file) return res.status(400).json('no image, it is required')
    const { originalname, path, filename } = req.file
    // specifying the last name of the file/making if openable or available
    // example .jpeg or .svg or .webp
    // why? because multer store it without last name so you can't open it
    const parts = originalname.split('.')
    const ext = parts[parts.length - 1]
    fs.renameSync(path, path+'.'+ext)
    const url = 'http://localhost:4000/uploads/' + filename +'.'+ext
    jwt.verify(token, secret, async (err, info) => {
        if (err) return res.json(err)
        try {
            const {title, category, description} = req.body 
            const  owner  = await User.findById({_id: info.id})
            if (!owner) return res.json('owner doesnt exist')
            const item = await Item.create({  
                title, 
                category,
                description,
                url: url,
                owner: info.id,
                ownername: owner?.Userinfo?.username
            })
            res.json(item)
        } catch (error) {
            res.status(400).json(error)
        }
    })
})

app.post('/Item/edit', upload.single('file'), async(req, res) => {
    const { token } = req.cookies
    
    try {
        jwt.verify(token, secret, async(err, info) => {
            const { title, description, category} = req.body
            // constracting and uploading the new image
            let url
            if (req.file) {
                const { originalname, path, filename} = req.file
                const parts = originalname.split('.')
                const ext = parts[parts.length - 1]
                fs.renameSync(path, path+'.'+ext)
                url = 'http://localhost:4000/uploads/' + filename +'.'+ext
            }
            // deleting image
            const currentimage = await Item.findOne({owner: info.id}, {url: true})
            const split = currentimage.split('/')
            const lastpart = split[split.length - 1]
            fs.unlink(__dirname + '/upload/' + lastpart, (err) => {
                console.log(err)
            })
            // updating what needs to be updated
            const origitem = await Item.updateOne({owner: info.id}, {
                title, 
                description,
                category,
                url: url
            })
            // res.json(origitem)
        })
    } catch (error) {
        res.status(400).json(error)
    }
})

app.post('/schedule', async (req, res) => {
    const { token } = req.cookies
    try {
        jwt.verify(token, secret, async(err, info) => {
            if (err) console.log(err)
            console.log(info)
            const { schedule, ownerid  } = req.body
            const user = await User.findOne({_id: info.id}, {Userinfo: 1})
            const setschedule = await Schedule.create({
                ownerid: ownerid,
                date: schedule.date,
                time: schedule.time,
                visitor: user.Userinfo.username,
            })
            console.log(setschedule)
        })
    } catch (error) {
        
    }

})

app.get('/myschedule', async(req, res) => {
    const { token } = req.cookies
    try {
        jwt.verify(token, secret, async(err, info) => {
            if (err) res.status(400)
            const myschedule = await Schedule.find({ownerid: info.id}).sort({date: 1})
            res.json(myschedule)
        })
    } catch (error) {
        res.status(400)
    }
})


app.listen(4000)