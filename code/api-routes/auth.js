//========================================================
// EXPRESS - AUTH
//========================================================
const express = require('express');
const router = express.Router();
const MySQL = require('../sys-modules/mysql')
const validator = require('../sys-modules/validator');
//========================================================
// EXPRESS - AUTH
//========================================================
module.exports = (client) => {
    
    router.post('/', async (req, res) => {
        const ipAdress = req.body.ip;
        const script = req.body.script;
        const version = req.body.version;    
        
        if(ipAdress && script && version){
            console.log('Auth to script: '+script+'('+version+') in '+ipAdress);
            
            const scriptData = await validator.scriptExist(script);
            if(scriptData){
                
                const conn = await MySQL();
                const [license] = await conn.query(`SELECT * FROM licenses WHERE script = ${conn.escape(script)} AND adress = ${conn.escape(ipAdress)}`);
                if(license[0]){
                    
                    await conn.query(`UPDATE licenses SET login = NOW() WHERE script = ${conn.escape(script)} AND adress = ${conn.escape(ipAdress)}`);

                    let update = false
                    if(scriptData.version > version){
                        update = scriptData.version;
                    }

                    const clientData = await client.users.fetch(license[0].discord_id);
                    let name = "Indisponivel"     
                    if(clientData){
                        name = clientData.username+'#'+clientData.discriminator
                    }

                    return res.status(200).json({ auth: true, update: update, licenseAt: name });
                }
            }    
        }
        return res.status(400).json({ auth: false, error: 'Parametros invalidos.' });
    });

    return router;
};