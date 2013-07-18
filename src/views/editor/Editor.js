import event.Emitter as Emitter;

import .lists.ImageListView as ImageListView;
import .lists.TagListView as TagListView;

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
			superview: opts.superview,
			x: 0,
			y: 0,
			width: this._adventureMapModel.getTileSize(),
			height: this._adventureMapModel.getTileSize(),
			adventureMap: this._adventureMap,
			scrollData: this._scrollData,
			tiles: opts.tiles
		});

		this._cursorView.on('NeedsPopulate', bind(opts.adventureMap.getAdventureMapLayer1(), 'needsPopulate'));
		this._cursorView.on('NeedsPopulate', bind(opts.adventureMap.getAdventureMapLayer2(), 'needsPopulate'));
		this._cursorView.on('NeedsPopulate', bind(opts.adventureMap.getAdventureMapLayer3(), 'needsPopulate'));

		this._menuBarView = new MenuBarView({
			superview: opts.superview,
			x: 0,
			y: 0,
			width: opts.width,
			height: 96,
			adventureMapModel: this._adventureMapModel,
			visible: false
		});

		this._menuBarView.on('NeedsPopulate', bind(opts.adventureMap.getAdventureMapLayer1(), 'needsPopulate'));
		this._menuBarView.on('NeedsPopulate', bind(opts.adventureMap.getAdventureMapLayer2(), 'needsPopulate'));
		this._menuBarView.on('NeedsPopulate', bind(opts.adventureMap.getAdventureMapLayer3(), 'needsPopulate'));
		this._menuBarView.on('Tile', bind(this, 'onTileEdit'));
		this._menuBarView.on('Node', bind(this, 'onNodeEdit'));
		this._menuBarView.on('Right', bind(this, 'onRightEdit'));
		this._menuBarView.on('Bottom', bind(this, 'onBottomEdit'));
		this._menuBarView.on('Tags', bind(this, 'onTagsEdit'));

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
			title: 'Tags'
		}).on('Select', bind(this, 'onSelectTag')));

		this._selectTime = 0;
		this._adventureMap.getAdventureMapLayer1().on(
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
				}
			)
		);
		this._adventureMap.getAdventureMapLayer1().on(
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
		this._adventureMap.getAdventureMapLayer1().needsPopulate();
		this._adventureMap.getAdventureMapLayer2().needsPopulate();
		this._adventureMap.getAdventureMapLayer3().needsPopulate();
	};

	this.showList = function (index) {
		var i = this._lists.length;
		while (i) {
			var list = this._lists[--i];
			(i === index) ? list.show() : list.hide();
		}
	};

	this.onTileEdit = function () {
		this.showList(0);
	};

	this.onSelectTile = function (index) {
		if (this._tileX !== null) {
			this._map[this._tileY][this._tileX] = index;
			this._adventureMap.getAdventureMapLayer1().needsPopulate();
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

	this.onTagsEdit = function () {
		this.showList(4);
	};

	this.onSelectTag = function () {
	};
});