var Host = "Grandum.aternos.me";
var Port = 25565;
var UserName = "testBot2";
var mineflayer = require('mineflayer');
var navigatePlugin = require('mineflayer-navigate')(mineflayer);
var blockFinderPlugin = require('mineflayer-blockfinder')(mineflayer);
var Vec3 = require('vec3').Vec3;

var countRestart = 0;
var countR = 0;
var state = false;

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

var options = {
	host: Host,
	port: Port,
	username: UserName,
};





msgF();

function msgF() {
	rl.question(":", (answer) => {
		if (answer === '=restart') {
			process.exit();
			return;
		}
		bot.chat(answer);
        msgF();
	});
}


var bot = mineflayer.createBot(options);
bot.loadPlugin(blockFinderPlugin);

bindEvents(bot);
function bindEvents(bot) {

	bot.on('end', function (reason) {
		bot = mineflayer.createBot(options);
		countR++;
		if (countR > 2) {
			process.exit();
			return;
		}
		countRestart++;
		console.log("restart " + countRestart + "/ " + countR);
		bindEvents(bot);
	});
	bot.on('login', function () {
		countR = 0;
        console.log("Login: " + UserName + " | Host: " + Host + ":" + Port);
        
	});

	navigatePlugin(bot);
	bot.navigate.blocksToAvoid[132] = true; // avoid tripwire
	bot.navigate.blocksToAvoid[59] = false; // ok to trample crops
	bot.navigate.on('cannotFind', function (closestPath) {
		bot.chat("Не найден путь!");
		bot.navigate.walk(closestPath);
	});

    bot.on('chat', function (username, message) {
        if (username === bot.username) return;
        var msg = message.split(' ', 3);
        if (msg[0] === bot.username) {
            var target = bot.players[username].entity;
            if (msg[1] === 'come') {
                bot.navigate.to(target.position);
            } else if (msg[1] === 'stop') {
                bot.navigate.stop();
            } else if (msg[1] === 'mine') {
                if (!state) {
                    state = true;
                    bot.dig(bot.blockAt(new Vec3(0, 11, 3)));
                } else {
                    state = false;
                    bot.stopDigging();
                }
                console.log(state);
            }
		}
		else console.log(username + ": " + message);
    });
    bot.on('blockUpdate:(0, 11, 3)', function (oldBlock, newBlock){
        if (state === true) {
            let target = bot.blockAt(newBlock.position);
            if (target && bot.canDigBlock(target) && target.name != "air") {
                bot.dig(target);
            }
        }
    });
}
