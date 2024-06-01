const express = require('express')
const mongoose = require('mongoose')

const PORT = 3000

const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/');

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT)
})


//db

const UserShema = mongoose.Schema({
    Login: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Name: {
        type: String,
        required: true
    }
})

// const GameShema = mongoose.Schema({
//     FirstPerson: {
//         type: String,
//         required: true,
//     },
//     SecondPerson: {
//         type: String,
//         required: true,
//     },
//     Turn: {
//         type: String,
//         required: true,
//     },
//     Game: {
//         type: Array,
//         required: true
//     },
//     Win : {
//         type: Number,
//         required: true
//     },
//     Now: {
//         type: String,
//         required: true
//     }



// })

const GameSchema = mongoose.Schema({
    Game: {
        type: Array,
        required: true
    },
    Win : {
        type: Number,
        required: true
    },
    Now: {
        type: String,
        required: true
    },
    Current: {
        type: Number,
        required: true
    },
})

const fTry = mongoose.model('Game', GameSchema);

//routes

app.post('/click', async (req,res) => {
    try {
        const gameID = req.body.gameID
        const field = req.body.field
        let cell = req.body.cell

        const game = await fTry.findOne({ _id : gameID })
        l = game.Game
        now = game.Now

        let winField = 0
        let win = 0

        l[field][cell] = now
        fieldList = toWinField(field,l,now)
        l[field] = fieldList
        if (fieldList[0] != '-') {
            winField = field
            if (toWin()){
                win = 1
            }
        }
        if (now == 'X'){
            now = 'O'
        }else {
            now = 'X'
        }

        if (l[cell][0] != '-'){
            cell = 0
        }

        await fTry.updateOne({ _id : gameID }, {Game: l, Win : win, Now: now, Current: cell})
        console.log(fieldList)
        res.send({
            win: win,
            winField : winField,
            cell : cell,
            fieldList: fieldList
        })
    } catch (error) {
        console.log(error)
    }

})

app.get('/reset', (req, res) => {
    try {
        l = reset()
        now = 'X'
    } catch (error) {
        console.log(error)
    }
    res.send()
})


app.get('/start-game', async (req, res) => {
    try {


        l = reset()

        const game = new fTry({
            Game: l,
            Win : 0,
            Now: 'X',
            Current : 0
        })

        const id = game._id

        await game.save()

        res.send({ id : id })
    } catch (error) {
        console.log(error)
    }
})

app.post('/load-game', async (req, res) => {
    try {
        const id = req.body.gameID
        const game = await fTry.findOne({ _id : id})
        res.send(game)
    } catch (error) {
        console.log(error)
    }
})



// functions

const reset = () => {
    l = [[]]
    for (let i = 0; i < 9; i++){
        l.push(['-','-','-','-','-','-','-','-','-','-'])
    }
    return l
}

const toWinField = (field,l,now) => {
    fieldList = l[field]
    combinations.forEach((comb, i, arr)=>{
        if (fieldList[comb[0]] == now && fieldList[comb[1]] == now && fieldList[comb[2]] == now){
            fieldList[0] = now
        }
    
    })
    return fieldList

}

const toWin = () => {
    flag = 0
    combinations.forEach((comb, i, arr)=>{
        if (l[comb[0]][0] == now && l[comb[1]][0] == now && l[comb[2]][0] == now){
            flag = 1
        }

    })
    if (flag){
        return 1
    }else {
        return 0
    }
    
}







l = reset()
const combinations = ['123', '159', '147', '258', '369', '357', '456', '789']
let now = 'X'




