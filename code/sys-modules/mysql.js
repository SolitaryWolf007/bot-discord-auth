module.exports = async () => {
    if(global.connection && global.connection.state != 'disconnected') return global.connection;
    try {
        const MySQL = require('mysql2/promise');
        const con = MySQL.createConnection({ host: process.env.MYSQL_HOST, user: process.env.MYSQL_USER, password: process.env.MYSQL_PASS, database: process.env.MYSQL_DB });
        global.connection = con;
        return con;
    } catch (e) {
        console.log('\x1b[31m[MySQL] fatal error.\n'+e+'\x1b[0m');
        process.abort() 
    }
}