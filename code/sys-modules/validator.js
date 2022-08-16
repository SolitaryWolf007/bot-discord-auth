//========================================================
// REQUIRES
//========================================================
const MySQL = require('./mysql')
//========================================================
// VARS
//========================================================
let admins = null;
let scripts = null;
//========================================================
// VALIDATOR
//========================================================
const scriptExist = async (name) => {
    let cb = null
    if(scripts == null){
        const conn = await MySQL();
        const [rows] = await conn.query(`SELECT * FROM scripts`);
        scripts = rows;
    }   
    scripts.forEach(element => {
        if(name === element.name){
            cb = element;
        } 
    });
    return cb;
}

const getAdmin = async (discordId) => {
    let cb = null
    if(admins == null){
        const conn = await MySQL();
        const [rows] = await conn.query(`SELECT * FROM admins`);
        admins = rows;
    }   
    admins.forEach(element => {
        if(discordId === element.discord_id){
            cb = element;
        } 
    });
    return cb;
}

const clearData = () => {
    admins = null;
    scripts = null;
}

module.exports = { scriptExist, getAdmin, clearData }