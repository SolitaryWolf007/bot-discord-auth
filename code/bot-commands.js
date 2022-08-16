//========================================================
// REQUIRES
//========================================================
const { Intents, Constants } = require('discord.js');
const net = require('net');
const MySQL = require('./sys-modules/mysql')
const validator = require('./sys-modules/validator');
//========================================================
// COMMANDS
//========================================================
const commands = [
    //==================================================================================================
    // -- UPDATE IP
    //==================================================================================================
    {
        name: 'ip',
        description: 'Atualizar o IP do script.',
        options: [
            {
                name: 'script',
                description: 'Nome do Script para atualizar.',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'ip',
                description: 'IP atual do servidor.',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ],
        callback: async (client,interaction) => {
            try {
                const conn = await MySQL();
                const script = interaction.options.getString('script')
                const ipAdress = interaction.options.getString('ip')
                
                const scriptData = await validator.scriptExist(script)
                if(scriptData){

                    if (net.isIP(ipAdress) > 0){
                        
                        const [rows] = await conn.query(`SELECT * FROM licenses WHERE discord_id = '${interaction.member.id}' AND script = ${conn.escape(script)} `);
                        if(rows[0]){

                            const [rows] = await conn.query(`UPDATE licenses SET adress = ${conn.escape(ipAdress)} WHERE discord_id = '${interaction.member.id}' AND script = ${conn.escape(script)} `);
                            await interaction.reply({ ephemeral: true, content: `**IP do Script** \`${script}\` **Atualizado! Reinicie o seu script!**`});
                        
                        }else{
                            await interaction.reply({ ephemeral: true, content: `**Você não tem acesso ao script** \`${script}\`**.**`});
                        }    

                    }else{
                        await interaction.reply({ ephemeral: true, content: `**Endereço IP inválido, tente novamente.**`});
                    } 
                    
                }else{
                    await interaction.reply({ ephemeral: true, content: `**Script inválido, tente novamente.**`});
                } 

            }catch(e){
                console.log('\x1b[31m[DEBUG] '+e+'\x1b[0m');
                await interaction.reply({ ephemeral: true, content: `**Ocorreu um erro ao tentar atualizar o IP do script, tente novamente.**`});
            }
            
        }
    },
    //==================================================================================================
    // -- ADD CLIENT
    //==================================================================================================
    {
        name: 'add',
        description: 'Cadastrar novo cliente.',
        options: [
            {
                name: 'discord_id',
                description: 'Discord ID do cliente.',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'script',
                description: 'Nome do Script adquirido.',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            },
            {
                name: 'ip',
                description: 'IP atual do servidor.',
                required: true,
                type: Constants.ApplicationCommandOptionTypes.STRING
            }
        ],
        callback: async (client,interaction) => {
            try {
                const conn = await MySQL();

                const clientId = interaction.options.getString('discord_id')
                const script = interaction.options.getString('script')
                const ipAdress = interaction.options.getString('ip')

                const adminData = await validator.getAdmin(interaction.member.id)
                if(adminData){

                    const scriptData = await validator.scriptExist(script)
                    if(scriptData){

                        if(scriptData.perm === adminData.perm || adminData.perm === 'admin'){
                            if (net.isIP(ipAdress) > 0){
    
                                const [rows] = await conn.query(`SELECT * FROM licenses WHERE discord_id = ${conn.escape(clientId)} AND script = ${conn.escape(script)} `);
                                if(!rows[0]){
                                     
                                    const clientData = await client.users.fetch(clientId);

                                    await conn.query(`INSERT INTO licenses(discord_id,script,adress,payment) VALUES(${conn.escape(clientId)},${conn.escape(script)},${conn.escape(ipAdress)},NOW()) `);  
                                                        
                                    await interaction.reply({ ephemeral: true, content: `**Cliente** \`${clientData.username+'#'+clientData.discriminator} - (${script})\` **Cadastrado com sucesso!**`});
                                
                                }else{
                                    await interaction.reply({ ephemeral: true, content: `Cliente já possui o script** \`${script}\` **cadastrado!**`});
                                }
    
                            }else{
                                await interaction.reply({ ephemeral: true, content: `**Endereço IP inválido, tente novamente.**`});
                            } 

                        }else{
                            await interaction.reply({ ephemeral: true, content: `**Você não tem permissão para cadastrar esse produto.**`});
                        }

                    }else{
                        await interaction.reply({ ephemeral: true, content: `**Script inválido, tente novamente.**`});
                    }          

                }else{
                    await interaction.reply({ ephemeral: true, content: `**Comando exclusivo para Administradores.**`});
                }                      

            }catch(e){
                console.log('\x1b[31m[DEBUG] '+e+'\x1b[0m');
                await interaction.reply({ ephemeral: true, content: `**Ocorreu um erro ao tentar adicionar um cliente, tente novamente.**`});
            }
            
        }
    }
];

module.exports = commands