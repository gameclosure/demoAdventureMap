import adventuremap.views.tiles.status.LabelView as LabelView;
import ..views.PlayerView as PlayerView;

import .characterSettings;

exports = {
	
	nodes: [
		{
			image: 'resources/images/node/node_locked.png',
			width: 84,
			height: 80,
			characterSettings: {
				height: 60,
				y: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/node_hops.png',
			width: 83,
			height: 81,
			characterSettings: {
				height: 60,
				y: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/node_race.png',
			width: 83,
			height: 81,
			characterSettings: {
				height: 60,
				y: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/node_safety.png',
			width: 83,
			height: 81,
			characterSettings: {
				height: 60,
				y: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/node_time.png',
			width: 83,
			height: 81,
			characterSettings: {
				height: 60,
				y: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/node_unlimited.png',
			width: 83,
			height: 81,
			characterSettings: {
				height: 60,
				y: 60,
				data: characterSettings.numbers
			}
		}
	],
	nodeMap: {
		locked: 0,
		hopLimit: 1,
		race: 2,
		safetyNet: 3,
		timeLimit: 4,
		unlimited: 5
	},

	/*nodes: [
		{
			image: 'resources/images/node/grayButton.png',
			width: 220,
			height: 220,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/topButton.png',
			width: 220,
			height: 220,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/midButton.png',
			width: 220,
			height: 220,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/lowButton.png',
			width: 220,
			height: 220,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		},

		{
			image: 'resources/images/node/topButtonDone.png',
			width: 220,
			height: 220,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/midButtonDone.png',
			width: 220,
			height: 220,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/lowButtonDone.png',
			width: 220,
			height: 220,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		}
	],
	itemCtors: {
		Label: LabelView,
		Player: PlayerView
	}*/
};
