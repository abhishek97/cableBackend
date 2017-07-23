const express = require('express'),
    R = require('ramda'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    path = require('path'),
    fs = require('fs'),
    app = express();

const routers = fs
    .readdirSync(path.join(__dirname, '/routes'))
    .filter(file => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
    .map(file => {
        const fileName = file.replace('.js','')
        return {
            name: fileName,
            obj: require(path.join(__dirname,`/routes/${file}`))
        }
    })

app.use(cors(), morgan('tiny'))
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(bodyParser.json({limit: '100mb' , type : 'application/json'}));

app.use('/static', express.static(path.join(__dirname,'/bills')));

R.forEach( ({name, obj}) => {
    app.use(`/api/${name}`, obj)
}, routers)


app.listen(process.env.PORT || 3000, function () {
    console.log('Server running on', process.env.PORT || 3000)
})

