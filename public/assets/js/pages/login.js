$(function () {
	"use strict";

	$(document).ready(function ($) {
		//check if user is already logged in
		loggedinCheck();
		//remember me
		rememberMe();

		$(".simpleslide100").each(function () {
			var delay = 7000;
			var speed = 1000;
			var itemSlide = $(this).find(".simpleslide100-item");
			var nowSlide = 0;

			$(itemSlide).hide();
			$(itemSlide[nowSlide]).show();
			nowSlide++;
			if (nowSlide >= itemSlide.length) {
				nowSlide = 0;
			}

			setInterval(function () {
				$(itemSlide).fadeOut(speed);
				$(itemSlide[nowSlide]).fadeIn(speed);
				nowSlide++;
				if (nowSlide >= itemSlide.length) {
					nowSlide = 0;
				}
			}, delay);
		});

		$("#form-login").on("submit", function (e) {
			e.preventDefault();
			var form = $(this);
			var email = $("#email").val();
			var password = $("#password").val();

			blockUI();

			if (email == "" || password == "") {
				showSimpleMessage(
					"Attention",
					"All fields are required",
					"error"
				);
				unblockUI();
			} else if (!validateEmail(email)) {
				showSimpleMessage(
					"Attention",
					"Please provide a valid email address",
					"error"
				);
				unblockUI();
			} else {
				$.ajax({
					type: "POST",
					url: API_URL_ROOT + "/login",
					data: JSON.stringify(form.serializeObject()),
					dataType: "json",
					contentType: "application/json",
					success: function (response) {
						if (response.error == false) {
							var token = response.token; //generated access token from request
							var role = payloadClaim(token, "user_role"); //the user section from access token
							var folder =
								role == "Super Admin"
									? "sa"
									: role == "Admin"
									? "admin"
									: role.toLowerCase();

							setRememberMe(); //store login details to hardrive if any
							sessionStorage.setItem("token", token); //set access token

							//redirect to the user's dashboard
							window.location = `${folder}/dashboard`;
						} else {
							showSimpleMessage(
								"Attention",
								response.message,
								"error"
							);
							unblockUI();
						}
					},
					error: function (req, status, err) {
						showSimpleMessage(
							"Attention",
							"ERROR - " + req.status + " : " + req.statusText,
							"error"
						);
						unblockUI();
					},
				});
			}
		});
	});
});
