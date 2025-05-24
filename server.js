const http = require('http')
const path = require('path')
const fs = require('fs')
const db = require('./database')


const pathToIndex = path.join(__dirname, 'static', 'index.html');
const indexHtmlFile = fs.readFileSync(pathToIndex);

const pathToStyle = path.join(__dirname, 'static', 'style.css');
const styleCssFile = fs.readFileSync(pathToStyle);

const pathToscript = path.join(__dirname, 'static', 'script.js');
const scriptFile = fs.readFileSync(pathToscript);

const pathToRegister = path.join(__dirname, 'static', 'register.html');
const registerHtmlFile = fs.readFileSync(pathToRegister);

const pathToLogin = path.join(__dirname, 'static', 'login.html');
const loginHtmlFile = fs.readFileSync(pathToLogin);

const pathToAuth = path.join(__dirname, 'static', 'auth.js');
const authJsFile = fs.readFileSync(pathToAuth);

const server = http.createServer((req, res) => {

    if(req.url === '/'){
        return res.end(indexHtmlFile);
    }
    if(req.url === '/style.css'){
        return res.end(styleCssFile);
    }
    if(req.url === '/script.js'){
        return res.end(scriptFile);
    }
    if(req.url === '/auth.js'){
       return res.end(authJsFile);
    }
    if(req.url === '/login.html'){
           return res.end(loginHtmlFile);
    }
    if(req.url === '/register.html'){
        return res.end(registerHtmlFile);
    }
    if(req.method === 'POST'){
        if(req.url = '/api/register'){
            return registerUser(req, res);
        }
    }

    res.statusCode = 404;
    return res.end('Error 404');
});

function registerUser(req, res){
    let data = '';
    req.on('data', function(chank){
        data += chank;
    })

    req.on('end', async function(){
            try {
                const user = JSON.parse(data);
                if(!user.login || !user.password){
                    return res.end("Пропущено логін чи пароль")
                }
                console.log(await db.isUserExist(user.login)); //?????
                if(await db.isUserExist(user.login)){
                    console.log('Такий користувач вже існує');
                    return res.end("Такий користувач вже існує");
                    
                }
            } catch (error) {
                
            }
        })
}

server.listen(3000);

const { Server } = require("socket.io");
const io = new Server(server);

io.on('connection', async (socket) => {
  console.log(socket.id);
let messages = await db.getMessages();
let userName = 'admin';
socket.emit('all_messages', messages);
    socket.on('new_message', (message) => {
        db.addMessage(message, 1)
        io.emit('message', userName + ': ' + message);
    })

});