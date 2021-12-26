var {
  Manager
} = require("erela.js");
var {
  Permissions
} = require("discord.js");
var Spotify = require("erela.js-spotify");
var AppleMusic = require("erela.js-apple");
var Deezer = require("erela.js-deezer");
var Facebook = require("erela.js-facebook");
var config = require(`${process.cwd()}/botconfig/config.json`);
var settings = require(`${process.cwd()}/botconfig/settings.json`);

clientID = process.env.clientID || config.spotify.clientID,
  clientSecret = process.env.clientSecret || config.spotify.clientSecret;
module.exports = async (client) => {
  const fetch = require("node-fetch");
  let nodeData = await fetch('http://node01.lavalink.eu:8888/')
  .then(r => r.json())
  .then(node => node)
  .catch(() => {});
  //If no Data received (e.g: API DOWN), use the DEFAULT Node
  if(!nodeData) nodeData = { 
    port: 2333, 
    password: 'Raccoon', 
    host: 'node01.lavalink.eu'
  };
  if ((!clientID || clientID.length < 5) || (!clientSecret || clientSecret.length < 5)) {
    client.manager = new Manager({
      nodes: [nodeData],
      plugins: [
        new Deezer(),
        new Facebook(),
        new AppleMusic(),
      ],
      send(id, payload) {
        var guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });
  } else {
    client.manager = new Manager({
      nodes: [nodeData],
      plugins: [
        new Spotify({
          clientID, //get a clientID from there: https://developer.spotify.com/dashboard
          clientSecret
        }),
        new Deezer(),
        new Facebook(),
        new AppleMusic(),
      ],
      send(id, payload) {
        var guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });
  }
  //Log information
  client.logger(`Player for the Bot ${client.user ? client.user.username + " " : ""}created!`);


  client.once("ready", () => {
    client.manager.init(client.user.id);
  });
  //require the other events
  require("./node_events")(client)
  require("./events")(client)
  require("./musicsystem")(client)

};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.dev
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
