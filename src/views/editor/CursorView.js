import ui.View as View;
import ui.TextView as TextView;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		this._scrollData = opts.scrollData;
		this._tileX = 0;
		this._tileY = 0;

		supr(this, 'init', [opts]);

		this.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
		this.style.visible = false;

		this._adventureMap = opts.adventureMap;
		this._adventureMapModel = this._adventureMap.getModel();
	};

	this.showAt = function (tileX, tileY) {
		var adventureMapModel = this._adventureMapModel;
		var scrollData = this._adventureMap.getScrollData();

		this._tileX = tileX;
		this._tileY = tileY;

		this.style.x = (tileX - adventureMapModel.getTileX()) * adventureMapModel.getTileSize() + scrollData.x;
		this.style.y = (tileY - adventureMapModel.getTileY()) * adventureMapModel.getTileSize() + scrollData.y;
		this.style.visible = true;
	};

	this.update = function () {
		var data = this._adventureMapModel.toJSON();
		localStorage.setItem('MAP_DATA', JSON.stringify(data));
		this.emit('NeedsPopulate');
	};

	this.onInputSelect = function (event) {
		var adventureMapModel = this._adventureMapModel;
		var tile = adventureMapModel.getData().grid[this._tileY][this._tileX];
		var keys = Object.keys(event.point);
		var point = event.point[keys[keys.length - 1]];

		tile.x = point.x / this.style.width;
		tile.y = point.y / this.style.height;

		this.update();
	};
});