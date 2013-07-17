import animate;

import ui.View as View;
import ui.ImageView as ImageView;
import ui.ImageScaleView as ImageScaleView;
import ui.TextView as TextView;
import ui.ScrollView as ScrollView;

import menus.constants.menuConstants as menuConstants;

import .components.TopBar as TopBar;
import .components.EditButton as EditButton;

exports = Class(TopBar, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		var size = this.style.height;

		this._size = size;

		var scrollView = new ScrollView({
			superview: this,
			x: 0,
			y: 0,
			width: this.style.width,
			height: size,
			scrollX: true,
			scrollY: false
		});

		var options = [
				{title: 'Right', method: 'onRight', width: 94},
				{title: 'Bottom', method: 'onBottom', width: 128},
				{title: 'Node', method: 'onNode', width: 94},
				{title: 'Tile', method: 'onTile', width: 76}
			]
		var x = 4;
		for (var i = 0; i < options.length; i++) {
			var option = options[i];
			new EditButton({
				superview: scrollView,
				x: x,
				y: 4,
				width: option.width,
				height: size - 8,
				title: option.title
			}).on('Up', bind(this, option.method));
			x += option.width - 4;
		}
	};

	this.onRight = function () {
		this.emit('Right');
		/*
		if (this._tileX !== null) {
			var adventureMapModel = this._adventureMapModel;
			var data = adventureMapModel.getData();

			data.grid[this._tileY][this._tileX].right = !data.grid[this._tileY][this._tileX].right;
			this.update();
		}
		*/
	};

	this.onBottom = function () {
		this.emit('Bottom');
		/*
		if (this._tileX !== null) {
			var adventureMapModel = this._adventureMapModel;
			var data = adventureMapModel.getData();

			data.grid[this._tileY][this._tileX].bottom = !data.grid[this._tileY][this._tileX].bottom;
			this.update();
		}
		*/
	};

	this.onNode = function () {
		this.emit('Node');
	};

	this.onTile = function () {
		this.emit('Tile');
	};
});