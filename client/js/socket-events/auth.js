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
	if (params.hasOwnProperty('autologin') && params['autologin'] === 'true' && params.hasOwnProperty('user') && params.hasOwnProperty('password')) {
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
		if (token) {
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
		socket.emit("auth", {
			user: params['user'] : '',
			password: params['password'] : '',
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
