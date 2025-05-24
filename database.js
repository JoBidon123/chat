const fs = require('fs')

const dbFile = './chat.db'
const exists = fs.existsSync(dbFile);
const sqlite3 = require('sqlite3').verbose()
const sqlite = require('sqlite')
const crypto = require('crypto')

let db;

sqlite
    .open({
        filename: dbFile,
        driver: sqlite3.Database
    })
.then(async dBase => {
    db = dBase;
    try{
        if(!exists){
            await db.run(
                `CREATE TABLE user(
                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    login TEXT,
                    password TEXT
                );`
            );

            await db.run(
                `INSERT INTO user (login, password) VALUES
                ('admin', 'admin'),
                ('robocode', 'admin'),
                ('superAdmin', 'banana')
                `
            )

            await db.run(
                `CREATE TABLE message(
                    msg_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    content TEXT,
                    autor INTEGER,
                    FOREIGN KEY(autor) REFERENCES user(user_id)
                );`
            ); 
        }else{
            console.log(await db.all("SELECT * FROM user"));
        }
    }catch (dbError){
        console.log(dbError);
    }
})


module.exports = {
    getMessages: async () => {
        try{
            return await db.all(
                `SELECT msg_id, content, login, user_id from message
                Join user ON message.autor = user_id`
            );
        }catch (dbError){
            console.log(Error);
        }
    },
    addMessage: async (msg, userId) => {
        await db.run(
            `INSERT INTO message (content, autor) VALUES (?, ?)`,
            [msg, userId]
        );
    },
    isUserExist: async (login) => {
        const candidat = await db.all(`SELECT * FROM user WHERE login = ?`, [login]);
        return !!candidat.length; //тут була помилка)))
    },
    addUser: async(user) => {
        await db.run(
            `INSERT INTO user (login, password) VALUES (?, ?)`, [user.login, user.password]
        );
    },
getAuthToken: async (user) => {
      const candidate = await db.all(`SELECT * FROM user WHERE login = ?`, [user.login]);
      if(!candidate.length) {
        throw 'Wrong login';
      }
      if(candidate[0].password !== user.password) {
        throw 'Wrong password';
      }
      return candidate[0].user_id + '.' + candidate[0].login + '.' + crypto.randomBytes(20).toString('hex');
    }
};

