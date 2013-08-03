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

exports = Class(GC.Application, function () {

	this.initUI = function () {
		var editMode = false;

		this.engine.updateOpts({
			alwaysRepaint: true,
			clearEachFrame: editMode,
			keyListenerEnabled: false,
			logsEnabled: true,
			noTimestep: false,
			noReflow: true,
			showFPS: false,
			resizeRootView: false,
			scaleUI: [576, 1024],
			preload: ['resources/images']
		});

		this._adventureMap = new AdventureMap({
			superview: this,
			x: 0,
			y: 0,
			width: this.baseWidth,
			height: this.baseHeight,
			editMode: editMode,
			gridSettings: gridSettings,
			tileSettings: tileSettings,
			pathSettings: pathSettings,
			nodeSettings: nodeSettings
		});

		this._adventureMap.load(data);
		this._adventureMap.setScale(0.5);
		this._adventureMap.on('ClickNode', bind(this, 'onClickNode'));
		this._adventureMap.on('ClickTag', bind(this, 'onClickTag'));

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
		this._currentId = 0;

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

	this.showText = function (text) {
		this._nodeText.setText(text);
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
		this.showText('Clicked on node ' + tile.id);
	};

	this.onClickTag = function (tag, tile) {
		this.showText('Clicked on tag ' + tag);
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