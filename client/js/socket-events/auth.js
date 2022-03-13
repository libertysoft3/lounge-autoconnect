"use strict";

const $ = require("jquery");
const socket = require("../socket");
const storage = require("../localStorage");
const URI = require("urijs"); // Autologin

socket.on("auth", function(data) {

	// Autologin
	var featureAutologin = false;
	var params = URI(document.location.search);
	params = params.search(true);
	if (params.hasOwnProperty('autologin') && params.hasOwnProperty('user')) {
		featureAutologin = true;
	}

	const login = $("#sign-in");
	let token;

	login.find(".btn").prop("disabled", false);

	if (!data.success) {
		storage.remove("token");

		const error = login.find(".error");
		error.show().closest("form").one("submit", function() {
			error.hide();
		});
	} else {
		token = storage.get("token");

		// Autologin - detect username changes, force re-auth
		if (featureAutologin && token) {
			var userStorage = storage.get("user");
			var userUrl = params.hasOwnProperty('user') && params['user'].length > 0 ? params['user'] : '';
			if (userStorage !== userUrl) {
				// console.log('dbg: socket auth autologin forcing re-auth');
				token = "";
				storage.remove("token");
			} else {
				socket.emit("auth", {token: token});
			}
		} else if (token) {
			// core behavior
			$("#loading-page-message").text("Authorizing…");
			socket.emit("auth", {token: token});
		}
	}

	const input = login.find("input[name='user']");
	if (input.val() === "") {
		input.val(storage.get("user") || "");
	}
	if (token) {
		return;
	}


	// Autologin
	if (featureAutologin && data.success) {
		var user = params['user'] ? params['user'] : '';
		storage.set("user", user); // core does this on form submit
		socket.emit("auth", {
			user: user,
			password: params['al-password'] ? params['al-password'] : '', // password optional for 'guest' account in private mode. public mode will error with null password.
			remember: true,
			isAutologin: true
		});
		$("#sidebar, #footer").find(".networks")
			.html("")
			.next()
			.show(); // show div#main
	} else {
		$("#sidebar, #footer").find(".sign-in")
			.trigger("click", {
				pushState: false,
			})
			.end()
			.find(".networks")
			.html("")
			.next()
			.show();
	}
});
