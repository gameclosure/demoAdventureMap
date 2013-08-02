import adventuremap.views.tiles.status.LabelView as LabelView;
import ..views.PlayerView as PlayerView;

import .characterSettings;

exports = {
	nodes: [
		{
			image: 'resources/images/node/grayButton.png',
			width: 170,
			height: 170,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/topButton.png',
			width: 170,
			height: 170,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/midButton.png',
			width: 170,
			height: 170,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/lowButton.png',
			width: 170,
			height: 170,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		},

		{
			image: 'resources/images/node/topButtonDone.png',
			width: 170,
			height: 170,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/midButtonDone.png',
			width: 170,
			height: 170,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		},
		{
			image: 'resources/images/node/lowButtonDone.png',
			width: 170,
			height: 170,
			characterSettings: {
				height: 60,
				data: characterSettings.numbers
			}
		}
	],
	itemCtors: {
		Label: LabelView,
		Player: PlayerView
	}
};
