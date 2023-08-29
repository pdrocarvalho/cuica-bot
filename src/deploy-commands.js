const { REST, Routes } = require('discord.js')
const fs = require('node:fs')
const path = require('node:path')

const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

const commands = []

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
	//const filePath = path.join(commandsPath, file)
	const command = require(`./commands/${file}`)

	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON())
		console.log(`Command ${file} was loaded!`)
	} else {
		console.error(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
		)
	}
}

const rest = new REST({ version: '10' }).setToken(TOKEN)
;(async () => {
	try {
		console.log(`Start refreshing ${commands.length} application (/) commands.`)

		const data = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
			body: commands,
		})
		console.log(`Successfully reloaded ${data.length} application (/) commands.`)
	} catch (error) {
		console.error(error)
	}
})()
