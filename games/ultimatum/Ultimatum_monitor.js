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

	var players_objects = {};

	node.on('UPDATED_PLIST', function(){
		var playerlist = node.game.pl.db;

		// For each of those objects, is the user already in the system? - getting an initial credit
		if(playerlist.length >= 0){
			_.each(playerlist, function(player){

				if(typeof players_objects[player.id] === 'undefined'){

					// Add the initial amount to the players balance.
					players_objects[player.id] = {balance: 10};

				} else {

					// increase the value by n-amount or run a custom function to change the balance
					var update = function(){

						// change the balance
						players_objects[player.id].balance += 0.5;
					};

					update();
				}
			});

			var playerlist_for_view = _.map(_.keys(players_objects), function(key){
				return {id: key, balance: players_objects[key].balance};
			});

			App.players.set('content', playerlist_for_view);
		}
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