import event.Emitter as Emitter;

import .tools.ImageListView as ImageListView;
import .tools.TagListView as TagListView;
import .tools.ZoomView as ZoomView;

import .CursorView;
import .MenuBarView;

exports = Class(Emitter, function () {
	this.init = function (opts) {
		this._adventureMap = opts.adventureMap;
		this._adventureMapModel = this._adventureMap.getModel();
		this._map = this._adventureMapModel.getMap();

		this._tileX = null;
		this._tileY = null;

		this._cursorView = new CursorView({
			superview: this._adventureMap.getAdventureMapLayers()[0],
			x: 0,
			y: 0,
			width: this._adventureMapModel.getTileSize(),
			height: this._adventureMapModel.getTileSize(),
			adventureMap: this._adventureMap,
			zIndex: 999999999
		});

		this._cursorView.on('NeedsPopulate', bind(opts.adventureMap.getAdventureMapView(), 'needsPopulate'));

		this._menuBarView = new MenuBarView({
			superview: opts.superview,
			x: 0,
			y: 0,
			width: opts.width,
			height: 96,
			adventureMapModel: this._adventureMapModel,
			visible: false
		});

		this._menuBarView.on('Tile', bind(this, 'onTileEdit'));
		this._menuBarView.on('Node', bind(this, 'onNodeEdit'));
		this._menuBarView.on('Right', bind(this, 'onRightEdit'));
		this._menuBarView.on('Bottom', bind(this, 'onBottomEdit'));
		this._menuBarView.on('Tags', bind(this, 'onTagsEdit'));
		this._menuBarView.on('Zoom', bind(this, 'onZoom'));
		this._menuBarView.on('Close', bind(this, 'onCloseEditor'));

		this._lists = [];

		// Tiles
		this._lists.push(new ImageListView({
			superview: opts.superview,
			x: 0,
			y: opts.height - 96,
			width: opts.width,
			height: 96,
			images: opts.tiles,
			visible: false,
			title: 'Tile'
		}).on('Select', bind(this, 'onSelectTile')));

		// Nodes
		this._lists.push(new ImageListView({
			superview: opts.superview,
			x: 0,
			y: opts.height - 96,
			width: opts.width,
			height: 96,
			images: opts.nodes,
			visible: false,
			canCancel: true,
			padding: 10,
			title: 'Node'
		}).on('Select', bind(this, 'onSelectNode')));

		// Right path
		this._lists.push(new ImageListView({
			superview: opts.superview,
			x: 0,
			y: opts.height - 96,
			width: opts.width,
			height: 96,
			images: opts.paths,
			visible: false,
			canCancel: true,
			padding: 10,
			title: 'Right path'
		}).on('Select', bind(this, 'onSelectRightPath')));

		// Bottom path
		this._lists.push(new ImageListView({
			superview: opts.superview,
			x: 0,
			y: opts.height - 96,
			width: opts.width,
			height: 96,
			images: opts.paths,
			visible: false,
			canCancel: true,
			padding: 10,
			title: 'Bottom path'
		}).on('Select', bind(this, 'onSelectBottomPath')));

		// Tags
		this._lists.push(new TagListView({
			superview: opts.superview,
			x: 0,
			y: opts.height - 96,
			width: opts.width,
			height: 96,
			tags: opts.tags,
			visible: false,
			canCancel: true,
			padding: 10,
			title: 'Tags',
			adventureMapModel: this._adventureMapModel
		}));

		// Zoom
		var zoomView = new ZoomView({
				superview: opts.superview,
				x: 0,
				y: opts.height - 96,
				width: opts.width,
				height: 96,
				tags: opts.tags,
				visible: false,
				canCancel: true,
				padding: 10,
				title: 'Zoom',
				adventureMapModel: this._adventureMapModel
			});
		this._lists.push(zoomView);
		zoomView.on('ZoomIn', bind(this, 'onZoomIn'));
		zoomView.on('ZoomOut', bind(this, 'onZoomOut'));

		this._selectTime = 0;
		this._adventureMap.getAdventureMapLayers()[0].on(
			'Select',
			bind(
				this,
				function (tileX, tileY) {
					this._selectTime = Date.now();
					this._tileX = tileX;
					this._tileY = tileY;
					this._cursorView.showAt(tileX, tileY);
					this._menuBarView.show();
					this._menuBarView.setPos(tileX, tileY);

					var i = this._lists.length;
					while (i) {
						var list = this._lists[--i];
						list.style.visible && list.show(tileX, tileY);
					}
				}
			)
		);
		this._adventureMap.getAdventureMapView().on(
			'Scroll',
			bind(
				this,
				function () {
					if (Date.now() > this._selectTime + 50) {
						this._cursorView.hide();
						this._menuBarView.hide();
						this.showList(-1);
					}
				}
			)
		);
	};

	this.update = function () {
		var adventureMapLayers = this._adventureMap.getAdventureMapLayers();
		for (var i = 0; i < 3; i++) {
			adventureMapLayers[i].needsPopulate();
		}
	};

	this.showList = function (index, tileX, tileY) {
		var i = this._lists.length;
		while (i) {
			var list = this._lists[--i];
			(i === index) ? list.show(tileX, tileY) : list.hide();
		}
	};

	this.onCloseEditor = function () {
		this.showList(-1);
		this._cursorView.hide();
	};

	this.onTileEdit = function () {
		this.showList(0);
	};

	this.onSelectTile = function (index) {
		if (this._tileX !== null) {
			this._map[this._tileY][this._tileX] = index;
			this._adventureMap.getAdventureMapLayers()[0].needsPopulate();
		}
	};

	this.onNodeEdit = function () {
		this.showList(1);
	};

	this.onSelectNode = function (index) {
		if (this._tileX !== null) {
			var adventureMapModel = this._adventureMapModel;
			var data = adventureMapModel.getData();

			data.grid[this._tileY][this._tileX].node = index;
			this.update();
		}
	};

	this.onRightEdit = function () {
		this.showList(2);
	};

	this.onSelectRightPath = function (index) {
		if (this._tileX !== null) {
			var adventureMapModel = this._adventureMapModel;
			var data = adventureMapModel.getData();

			data.grid[this._tileY][this._tileX].right = index;
			this.update();
		}
	};

	this.onBottomEdit = function () {
		this.showList(3);
	};

	this.onSelectBottomPath = function (index) {
		if (this._tileX !== null) {
			var adventureMapModel = this._adventureMapModel;
			var data = adventureMapModel.getData();

			data.grid[this._tileY][this._tileX].bottom = index;
			this.update();
		}
	};

	this.onTagsEdit = function (tileX, tileY) {
		this.showList(4, tileX, tileY);
	};

	this.onZoom = function () {
		this.showList(5);
	};

	this.onZoomIn = function () {
		this._adventureMap.getAdventureMapView().setScale(1);
	};

	this.onZoomOut = function () {
		this._adventureMap.getAdventureMapView().setScale(0.5);
	};
});