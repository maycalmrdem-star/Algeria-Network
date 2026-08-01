"use strict";
const { glob } = require('glob')
const { promisify } = require('util')
const Glob = promisify(glob)

module.exports = async Client => {
    const Çɱɗ = Glob(`${process.cwd()}/bot/Commands/**/*.js`)
    ;(await Çɱɗ).map((Command) => {
        const Cmd = require(Command)
        if (Cmd.data && Cmd.execute) {
            // It's a Slash command
            Client.commands.set(Cmd.data.name, Cmd);
        } else if (Cmd.name) {
            // It's a legacy text command
            Client.Çɱɗ.set(Cmd.name, Cmd)
        }
    })
}
