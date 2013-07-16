import ui.View as View;
import ui.TextView as TextView;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		this._scrollData = opts.scrollData;
		this._width = opts.width;
		this._height = opts.height;
		this._tileX = 0;
		this._tileY = 0;
		this._map = opts.map;
		this._tiles = opts.tiles;

		opts.width *= 1.4;
		opts.height *= 1.4;

		supr(this, 'init', [opts]);

		this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
		this.style.visible = false;

		var size = this._width * 0.2;

		this._adventureMapModel = opts.adventureMapModel;

		this._positionView = new View({
			superview: this,
			x: size,
			y: size,
			width: this._width,
			height: this._height,
			backgroundColor: 'rgba(255, 255, 255, 0.1)'
		}).on('InputSelect', bind(this, 'onPosition'));

		this._levelView = new View({
			superview: this,
			x: 0,
			y: 0,
			width: size,
			height: size,
			backgroundColor: '#000000'
		}).on('InputSelect', bind(this, 'onLevel'));

		new TextView({
			superview: this,
			x: this.style.width - size * 2,
			y: 0,
			width: size,
			height: size,
			backgroundColor: '#000000',
			size: (0.8 * size) | 0,
			color: '#FFFFFF',
			text: '-'
		}).on('InputSelect', bind(this, 'onBackgroundM'));
		new TextView({
			superview: this,
			x: this.style.width - size,
			y: 0,
			width: size,
			height: size,
			backgroundColor: '#000000',
			size: (0.8 * size) | 0,
			color: '#FFFFFF',
			text: '+'
		}).on('InputSelect', bind(this, 'onBackgroundP'));

		this._rightView = new View({
			superview: this,
			x: this.style.width - size,
			y: this.style.height * 0.5 - size * 0.5,
			width: size,
			height: size,
			backgroundColor: '#000000'
		}).on('InputSelect', bind(this, 'onRight'));
		
		this._downView = new View({
			superview: this,
			x: this.style.width * 0.5 - size * 0.5,
			y: this.style.height - size,
			width: size,
			height: size,
			backgroundColor: '#000000'
		}).on('InputSelect', bind(this, 'onBottom'));
	};

	this.showAt = function (tileX, tileY) {
		var adventureMapModel = this._adventureMapModel;

		this._tileX = tileX;
		this._tileY = tileY;

		this.style.x = (tileX - adventureMapModel.getTileX() - 2) * adventureMapModel.getTileSize() + this._scrollData.x - this._width * 0.2;
		this.style.y = (tileY - adventureMapModel.getTileY() - 2) * adventureMapModel.getTileSize() + this._scrollData.y - this._width * 0.2;
		this.style.visible = true;
	};

	this.update = function () {
		var data = this._adventureMapModel.toJSON();
		localStorage.setItem('MAP_DATA', JSON.stringify(data));
		this.emit('NeedsPopulate');
	};

	this.onPosition = function (event) {
		var adventureMapModel = this._adventureMapModel;
		var tile = adventureMapModel.getData().grid[this._tileY][this._tileX];

		var keys = Object.keys(event.point);
		var point = event.point[keys[keys.length - 1]];
		tile.x = point.x / this._width;
		tile.y = point.y / this._height;

		this.update();
	};

	this.onLevel = function () {
		var adventureMapModel = this._adventureMapModel;
		var data = adventureMapModel.getData();

		data.grid[this._tileY][this._tileX].level = !data.grid[this._tileY][this._tileX].level;
		this.update();
	};

	this.onBackgroundM = function () {
		this._map[this._tileY][this._tileX] = (this._map[this._tileY][this._tileX] + this._tiles.length - 1) % this._tiles.length;
		this.update();
	};

	this.onBackgroundP = function () {
		this._map[this._tileY][this._tileX] = (this._map[this._tileY][this._tileX] + 1) % this._tiles.length;
		this.update();
	};

	this.onRight = function () {
		var adventureMapModel = this._adventureMapModel;
		var data = adventureMapModel.getData();

		data.grid[this._tileY][this._tileX].right = !data.grid[this._tileY][this._tileX].right;
		this.update();
	};

	this.onBottom = function () {
		var adventureMapModel = this._adventureMapModel;
		var data = adventureMapModel.getData();

		data.grid[this._tileY][this._tileX].bottom = !data.grid[this._tileY][this._tileX].bottom;
		this.update();
	};
});