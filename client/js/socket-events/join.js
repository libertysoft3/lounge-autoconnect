"use strict";

const $ = require("jquery");
const socket = require("../socket");
const render = require("../render");
const chat = $("#chat");
const templates = require("../../views");
const sidebar = $("#sidebar");
const URI = require("urijs"); // Focus lock

socket.on("join", function(data) {
	const id = data.network;
	const network = sidebar.find("#network-" + id);
	network.append(
		templates.chan({
			channels: [data.chan]
		})
	);
	chat.append(
		templates.chat({
			channels: [data.chan]
		})
	);
	render.renderChannel(data.chan);

	// Queries do not automatically focus, unless the user did a whois
	if (data.chan.type === "query" && !data.shouldOpen) {
		return;
	}

	// Autoconnect - focus lock handling - prevent second channel from becoming active in all clients, just the one the requested it via url
	// WARNING: with focus lock enabled, manually joining other channels will not show them! Must manually click them in channel list!
	// New tab - show the new channel we autoconnected to from the new url param
	// Old/existing tab - do not switch channels, focus is locked on existing channel from url param
	// NOTE: Tried to implement with custom param to input event with '/join' (from autoconnect code), but too hard to pass source of join through server and back to client. 
	// NOTE: Join event does not happen for new users, or new user page reloads, when /connect runs or has run and join param is the same
	// TODO - If you are viewing a lobby, allow switching.
	// TODO - Seems to fail on multiple clients loading at once (3 iframes on page)
	var params = URI(document.location.search);
	params = params.search(true);
	var featureLockChannel = params.hasOwnProperty('lockchannel');
	var joinChannelPerUrl = '';
	if (featureLockChannel && params.hasOwnProperty('join')) {
		var joinChannels = params['join'].length > 0 ? params['join'].split(',') : [];
		joinChannelPerUrl = joinChannels[joinChannels.length - 1];
	}
	
	if (featureLockChannel && joinChannelPerUrl.length > 0 && data.chan.type === "channel"  && data.chan.name != joinChannelPerUrl) {
		// console.log('dbg: socket join: focus locking, prefer ' + joinChannelPerUrl + ', prevent UI switch to ', data.chan.name);
		return;
	}
	// console.log('dbg: socket join: core clicking channel ', sidebar.find(".chan").sort(function(a, b) { return $(a).data("id") - $(b).data("id"); }).last().data('title'));
	
	sidebar.find(".chan")
		.sort(function(a, b) {
			return $(a).data("id") - $(b).data("id");
		})
		.last()
		.click();
});
