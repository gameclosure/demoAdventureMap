import event.Emitter as Emitter;

exports = Class(Emitter, function (supr) {
	this.init = function (opts) {
		var data = {
				width: opts.width,
				height: opts.height,
				tileSize: opts.tileSize,
				tileX: 0,
				tileY: 0
			};
		var grid = [];

		this._autoLevel = true;

		for (var y = 0; y < data.height; y++) {
			var gridLine = [];
			for (var x = 0; x < data.width; x++) {
				gridLine.push({
					level: false,
					right: false,
					bottom: false,
					x: 0.5,
					y: 0.5
				});
			}
			grid.push(gridLine);
		}

		data.grid = grid;

		this._data = data;
		this._needsPopulate = false;
	};

	this.tick = function (dt) {
		if (this._needsPopulate) {
			this._needsPopulate = false;
			this.emit('NeedsPopulate');
		}

		this.emit('Update', this._data);
	};

	this.getTileSize = function () {
		return this._data.tileSize;
	};

	this.getTileX = function () {
		return this._data.tileX;
	};

	this.getTileY = function () {
		return this._data.tileY;
	};

	this.getData = function () {
		return this._data;
	};

	this.onSize = function (sizeX, sizeY) {
		this._maxX = this._data.width - sizeX;
		this._maxY = this._data.height - sizeY;
	};

	this.onScrollLeft = function (data) {
		if (this._data.tileX > 0) {
			this._data.tileX--;
			this._needsPopulate = true;
		} else {
			data.x = this._data.tileSize;
		}
	};

	this.onScrollRight = function (data) {
		if (this._data.tileX < this._maxX) {
			this._data.tileX++;
			this._needsPopulate = true;
		} else {
			data.x = 0;
		}
	};

	this.onScrollUp = function (data) {
		if (this._data.tileY > 0) {
			this._data.tileY--;
			this._needsPopulate = true;
		} else {
			data.y = this._data.tileSize;
		}
	};

	this.onScrollDown = function (data) {
		if (this._data.tileY < this._maxY) {
			this._data.tileY++;
			this._needsPopulate = true;
		} else {
			data.y = 0;
		}
	};

	this.toggleTile = function (tileX, tileY) {
		this._data.grid[tileY][tileX].level = !this._data.grid[tileY][tileX].level;
	};
});