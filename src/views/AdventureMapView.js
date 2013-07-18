import ui.View as View;

import .AdventureMapLayerView;

import .tiles.TileView as TileView;
import .tiles.PathView as PathView;
import .tiles.NodeView as NodeView;
import .tiles.LabelView as LabelView;

exports = Class(View, function (supr) {
	this.init = function (opts) {
		supr(this, 'init', [opts]);

		this.style.clip = true;

		this._tileSize = opts.tileSize;
		this._scrollData = opts.scrollData;
		this._adventureMapLayers = [];

		var ctors = [TileView, PathView, NodeView];

		this._content = new View({
			superview: this,
			x: 0,
			y: 0,
			width: this.style.width * 2,
			height: this.style.height * 2
		});

		for (var i = 0; i < 3; i++) {
			this._adventureMapLayers.push(new AdventureMapLayerView({
				superview: this._content,
				x: opts.x,
				y: opts.y,
				width: opts.width,
				height: opts.height,
				tileSize: opts.tileSize,
				tileCtor: ctors[i],
				scrollData: opts.scrollData,
				map: opts.map,
				tiles: opts.tiles,
				paths: opts.paths,
				nodes: opts.nodes,
				labelCtor: opts.labelCtor || LabelView,
				blockEvents: i > 0
			}));
		}

		this._gestureView = this._adventureMapLayers[0];
		this._gestureView.on('DragSingle', bind(this, 'onDragSingle'));
	};

	this.onUpdate = function (data) {
		var x = this._scrollData.x - this._tileSize * 2;
		var y = this._scrollData.y - this._tileSize * 2;

		for (var i = 0; i < 3; i++) {
			var adventureMapLayer = this._adventureMapLayers[i];
			adventureMapLayer.onUpdate(data);
			adventureMapLayer.style.x = x;
			adventureMapLayer.style.y = y;
		}
	};

	this.onDragSingle = function (deltaX, deltaY) {
		var scrollData = this._scrollData;
		var tileSize = this._tileSize;

		deltaX /= this._scrollData.scale;
		deltaY /= this._scrollData.scale;

		scrollData.x += deltaX;
		if (scrollData.x < 0) {
			scrollData.x += tileSize;
			this.emit('ScrollRight', scrollData);
		} else if (scrollData.x >= tileSize) {
			scrollData.x -= tileSize;
			this.emit('ScrollLeft', scrollData);
		}

		scrollData.y += deltaY;
		if (scrollData.y < 0) {
			scrollData.y += tileSize;
			this.emit('ScrollDown', scrollData);
		} else if (scrollData.y >= tileSize) {
			scrollData.y -= tileSize;
			this.emit('ScrollUp', scrollData);
		}

		this.emit('Scroll');
	};

	this.needsPopulate = function () {
		for (var i = 0; i < 3; i++) {
			this._adventureMapLayers[i].needsPopulate();
		}
	};

	this.getAdventureMapLayers = function () {
		return this._adventureMapLayers;
	};

	this.setScale = function (scale) {
		this._scrollData.scale = scale;
		this._content.style.scale = scale;
	};
});