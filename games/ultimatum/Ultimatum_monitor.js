function Ultimatum_monitor () {
	
	this.name = 'Monitor screen for Ultimatum Game';
	this.description = 'No Description';
	this.version = '0.3';
	
	this.minPlayers = 2;
	this.maxPlayers = 10;
	
	this.auto_step = false;
	this.observer = true;
	
	window.App = Ember.Application.create();

	this.init = function() {
		node.window.setup('MONITOR');

		// Create the Ember objects and bindings.
		App.Player = DS.Model.extend({
			id: DS.attr('string'),
			balance: DS.attr('string')
		});

		App.players = Ember.ArrayController.create();

		var paymentView = Ember.View.create({
			templateName: 'PaymentWidget'
		});
		paymentView.appendTo('#root');
	};

	var players_ids = []; // List of player ids to check if a player object is new.

	node.on('UPDATED_PLIST', function(){
		var playerlist = node.game.pl.db;

		// For each of those objects, is the user already in the system (Ember.store)?
		if(playerlist.length >= 0){

			App.players.set('content', playerlist);

			_.each(playerlist, function(player){
				if(!_.include(players_ids, player.id)){
					players_ids.push(player.id);

					// Add the initial amount to the players balance.
					player.balance = 10;
				}
			});
		}

		// How to get the latest move? The player which caused the UPDATED_PLIST.
		// Which object got updated?
		// Listening to the socket.io commands? + add some timeout to make sure the playerlist has been updated?

		console.log('updated'); // DEBUG
		console.log(playerlist); // DEBUG
	});
	
	function printGameState () {
		var name = node.game.gameLoop.getName(node.state);
		console.log(name);
	};
	
	// Creating the Game Loop	
	this.loops = {
			
			1: {state:	printGameState,
				name:	'Game will start soon'
			},
			
			2: {state: 	printGameState,
				name: 	'Instructions'
			},
				
			3: {rounds:	10, 
				state: 	printGameState,
				name: 	'Game'
			},
			
			4: {state:	printGameState,
				name: 	'Questionnaire'
			},
				
			5: {state:	printGameState,
				name: 	'Thank you'
			}
	};	
}