import device;

import ui.TextView as TextView;

import adventuremap.AdventureMap as AdventureMap;
import adventuremap.views.editor.Editor as Editor;

import menus.constants.menuConstants as menuConstants;
import menus.views.MenuView as MenuView;
import menus.views.components.ButtonView as ButtonView;

import .settings.gridSettings as gridSettings;
import .settings.nodeSettings as nodeSettings;
import .settings.pathSettings as pathSettings;
import .settings.tileSettings as tileSettings;

import .data;
//localStorage.clear();

exports = Class(GC.Application, function () {

	this.initUI = function () {
		var editMode = false;
		var inputLayerIndex = editMode ? 0 : 2;

		this.engine.updateOpts({
			alwaysRepaint: true,
			clearEachFrame: editMode,
			keyListenerEnabled: false,
			logsEnabled: true,
			noTimestep: false,
			noReflow: true,
			showFPS: true,
			resizeRootView: false,
			preload: ['resources/images', 'resources/audio']
		});

		this.scaleUI();

		this._adventureMap = new AdventureMap({
			superview: this,
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight,
			editMode: (inputLayerIndex === 0),
			gridSettings: gridSettings,
			tileSettings: tileSettings,
			pathSettings: pathSettings,
			nodeSettings: nodeSettings,
			inputLayerIndex: inputLayerIndex
		});
		this._adventureMap.load(data);

		this._currentId = 0;

		this._adventureMap.setScale(0.5);
		this._adventureMap.on('ClickNode', bind(this, 'onClickNode'));

		editMode ? this.initEditor() : this.initDemo();
	};

	this.initEditor = function () {
		new Editor({
			superview: this,
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight,
			adventureMap: this._adventureMap,
			gridSettings: gridSettings,
			tileSettings: tileSettings,
			pathSettings: pathSettings,
			nodeSettings: nodeSettings
		});
	};

	this.initDemo = function () {
		this._nodeText = new TextView({
			superview: this,
			x: 0,
			y: 0,
			width: 576,
			height: 64,
			fontFamily: 'BPReplay',
			size: 36,
			color: '#FFFFFF',
			strokeColor: '#000000',
			strokeWidth: 8,
			text: '',
			blockEvents: true
		});
		this._clickTimeout = null;

		this._optionsMenu = new MenuView({
			superview: this,
			title: 'Main menu',
			items: [
				{item: 'Toggle zone 1A', action: bind(this, 'onToggleZone', 'zone1A')},
				{item: 'Toggle zone 1B', action: bind(this, 'onToggleZone', 'zone1B')},
				{item: 'Toggle zone 2A', action: bind(this, 'onToggleZone', 'zone2A')},
				{item: 'Toggle zone 2B', action: bind(this, 'onToggleZone', 'zone2B')}
			]
		});

		new ButtonView({
			superview: this,
			x: 20,
			y: this.baseHeight - 100,
			width: 160,
			height: 80,
			title: 'Menu',
			style: 'BLUE',
			on: {
				up: bind(this._optionsMenu, 'show')
			}
		});
		new ButtonView({
			superview: this,
			x: 200,
			y: this.baseHeight - 100,
			width: 160,
			height: 80,
			title: 'Move',
			style: 'BLUE',
			on: {
				up: bind(this, 'onNextPos')
			}
		});
	};

	this.scaleUI = function () {
		if (device.height > device.width) {
			this.baseWidth = 576;
			this.baseHeight = device.height * (576 / device.width);
			this.scale = device.width / this.baseWidth;
		} else {
			this.baseWidth = 1024;
			this.baseHeight = device.height * (1024 / device.width);
			this.scale = device.height / this.baseHeight;
		}
		this.view.style.scale = this.scale;
	};

	this.onToggleZone = function (zone) {
		var nodesInZone = this._adventureMap.getModel().getNodesByTag(zone);
		var i = nodesInZone.length;
		while (i) {
			var nodeInZone = nodesInZone[--i];
			if (nodeInZone.node > 4) {
				nodeInZone.node -= 3;
			} else {
				nodeInZone.node += 3;				
			}
			this._adventureMap.refreshTile(nodeInZone.tileX, nodeInZone.tileY);
		}
	};

	this.onDebug = function (index, txt) {
		this._debug[index].setText(txt);
	};

	this.onClickNode = function (tile) {
		this._nodeText.setText('Clicked on ' + tile.id);
		this._nodeText.style.visible = true;
		this._clickTimeout && clearTimeout(this._clickTimeout);
		this._clickTimeout = setTimeout(
			bind(
				this,
				function () {
					this._nodeText.style.visible = false;
				}
			),
			2000
		);
	};

	this.onNextPos = function () {
		var model = this._adventureMap.getModel();

		model.removeTagById(this._currentId, 'Player');
		this._currentId++;
		if (this._currentId > model.getMaxNodeId()) {
			this._currentId = 1;
		}

		model.addTagById(this._currentId, 'Player');

		this._adventureMap.focusNodeById(this._currentId);
	};
});
