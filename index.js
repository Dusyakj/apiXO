const express = require('express')

const PORT = 3000

const app = express()

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



app.post('/click', async (req,res) => {
    const field = req.body.field
    let cell = req.body.cell

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

    res.send({
        win: win,
        winField : winField,
        cell : cell,
        fieldList: fieldList
    })

})




