import event.Emitter as Emitter;

exports = Class(Emitter, function (supr) {
	this.init = function () {
		var data = {
				width: 32,
				height: 32,
				tileSize: 256
			};
		var grid = [];

		for (var y = 0; y < data.height; y++) {
			var gridLine = [];
			for (var x = 0; x < data.width; x++) {
				gridLine.push({
					right: false,
					bottom: false,
					x: 0.5 * data.tileSize,
					y: 0.5 * data.tileSize
				});
			}
			grid.push(gridLine);
		}

		grid[0][0].right = true;
		grid[0][1].right = true;

		grid[0][2].bottom = true;
		grid[0][2].x = data.tileSize * 0.2;
		grid[0][2].y = data.tileSize * 0.8;

		grid[1][2].right = true;
		grid[1][2].bottom = true;

		data.grid = grid;

		this._data = data;
	};

	this.tick = function (dt) {
		this.emit('Update', this._data);
	};
});