'use strict';

const fs = require('fs');
const path = require('path');
const Logger = require('./helpers/Logger');

const parsers = {};

function register(alias, parser) {
    Logger.info(`  > Register parser ${alias}`);
    parsers[alias] = parser;
}

module.exports = {
    parse: function (message, alias) {
        return new Promise((resolve, reject) => {
            let parser = parsers[alias];
            if (parser === undefined) {
                Logger.debug(`format#${message.id}`);
                resolve(`(${message.channel.name}): ${message.content.replace(/\n/g, ' ')}`);
            } else {
                try {
                    parser.parse(message).then(pokemon => {
                        resolve(pokemon)
                    }).catch(reason => reject(reason));
                } catch (ex) {
                    reject(ex);
                }
            }
        });
    },
    init: function () {
        Logger.info(`Loading parsers`);
        let basePath = path.resolve(__dirname, 'parsers');
        fs.readdirSync(basePath).forEach(file => {
            let Parser = require(`./parsers/${file}`);
            register(Parser.code, new Parser());
        });
    }
};