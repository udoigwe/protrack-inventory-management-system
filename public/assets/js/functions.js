//return payload claim
function payloadClaim(token, param) {
	var base64Url = token.split(".")[1];
	var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
	var payload = JSON.parse(window.atob(base64));
	var claim = payload[param];

	return claim;
}

function loggedinCheck() {
	//Instantiate access token
	var token = sessionStorage.getItem("token");

	//check if the access token is empty
	if (token !== null && token !== "") {
		var role = payloadClaim(token, "user_role"); //the user role from access token
		var folder =
			role == "Super Admin"
				? "sa"
				: role == "Admin"
				? "admin"
				: role.toLowerCase();

		//redirect to user's dashboard
		window.location = `${folder}/dashboard`;
	}
}

//not logged in check
function notLoggedInCheck() {
	//Instantiate access token
	var token = sessionStorage.getItem("token");

	//check if the access token is empty
	if ((token == null && token == "") || token == undefined) {
		//redirect to the login page
		window.location = "/login";
	}
}

//remember me
function rememberMe() {
	if (localStorage.getItem("chkbx") && localStorage.getItem("chkbx") !== "") {
		$("#remember-me").attr("checked", "checked");
		$("#email").val(localStorage.getItem("email"));
		$("#password").val(localStorage.getItem("password"));
	} else {
		$("#remember-me").removeAttr("checked");
		$("#email").val("");
		$("#password").val("");
	}
}

//set remember me cookie
function setRememberMe() {
	if ($("#remember-me").is(":checked")) {
		// save email and password in computer's hardrive
		localStorage.removeItem("email");
		localStorage.removeItem("password");
		localStorage.removeItem("chkbx");
		localStorage.setItem("email", $("#email").val());
		localStorage.setItem("password", $("#password").val());
		localStorage.setItem("chkbx", $("#remember-me").val());
	} else {
		//remove login details from computer's hardrivve
		localStorage.removeItem("email");
		localStorage.removeItem("password");
		localStorage.removeItem("chkbx");
	}
}

//make rightSideBar links active based on url
function activateLinks() {
	//current page url
	var pgUrl = window.location.href.substr(
		window.location.href.lastIndexOf("/") + 1
	);

	$("#leftsidebar a").each(function () {
		var $this = $(this);
		//if current path is like link, make it active
		if ($this.attr("href") == pgUrl) {
			$this
				.parents("li")
				.addClass("active")
				.closest("ul")
				.parents("li")
				.addClass("active");
		}
	});
}

//signOut current user
function signOut() {
	var token = sessionStorage.getItem("token"); //access token
	blockUI();

	$.ajax({
		type: "GET",
		url: API_URL_ROOT + "/logout",
		dataType: "json",
		headers: { "x-access-token": token },
		success: function (response) {
			if (response.error == false) {
				//clear all stored sessions
				sessionStorage.clear();

				//redirect to login screeen
				window.location = "/login";
			} else {
				unblockUI();
				showSimpleMessage("Attention", response.message, "error");
			}
		},
		error: function (req, status, error) {
			unblockUI();
			showSimpleMessage(
				"Attention",
				"ERROR - " + req.status + " : " + req.statusText,
				"error"
			);
		},
	});
}

//display user profile
function displayUserProfile() {
	var token = sessionStorage.getItem("token"); //access token

	if (token !== null && token !== "") {
		var id = payloadClaim(token, "user_id");
		var email = payloadClaim(token, "user_email");
		var role = payloadClaim(token, "user_role");
		var avatar = payloadClaim(token, "user_image_url");
		var storeLogo = payloadClaim(token, "user_store_logo")
			? `${API_HOST_NAME}/logos/${payloadClaim(token, "user_store_logo")}`
			: `/assets/images/logo.png`;
		var sideBarLogo = payloadClaim(token, "user_store_logo")
			? `${API_HOST_NAME}/logos/${payloadClaim(token, "user_store_logo")}`
			: `/assets/images/logo.png`;

		$(".store_logo").attr({ src: storeLogo });
		$(".logo-lg img, .logo-sm img").attr({ src: sideBarLogo });

		$(".user-avatar-small").attr({ src: avatar });
	}
}

//show sign out dialogue
function showSignOutMessage() {
	swal({
		title: "Sign Out?",
		text: "Are you sure you want to sign out this user?",
		type: "warning",
		showCancelButton: true,
		padding: "2em",
		//closeOnConfirm: false,
		//showLoaderOnConfirm: true,
	}).then(function (result) {
		if (result.value) {
			signOut();
		}
	});
}

//Show simple message
function showSimpleMessage(title, text, type) {
	swal({
		title: title,
		text: text,
		type: type,
		confirmButtonText: "Close",
		showLoaderOnConfirm: false,
	});
}

function showHtmlMessageWithCustomIcon(title, text, imageUrl) {
	swal({
		title: title,
		text: text,
		imageUrl: imageUrl,
		html: true,
	});
}

function showHtmlMessage() {
	swal({
		title: "HTML <small>Title</small>!",
		text: 'A custom <span style="color: #CC0000">html<span> message.',
		html: true,
	});
}

function validateEmail(email) {
	var filter = /^[\w-.+]+@[a-zA-Z0-9.-]+.[a-zA-Z0-9]{2,4}$/;

	if (filter.test(email)) {
		return true;
	} else {
		return false;
	}
}

function validateAvatar(avatarID, imgprevID, imgID, expectedSize) {
	//validate user avatar on change
	$("#" + avatarID).on("change", function () {
		//Get uploaded file extension
		var extension = $(this).val().split(".").pop().toLowerCase();
		//Create array with the file extensions that we wish to upload
		var validFileExtensions = ["jpeg", "jpg", "png"];
		//Check file extension in the array. if -1, that means the file extension is not in the list
		if ($.inArray(extension, validFileExtensions) == -1) {
			showSimpleMessage("Attention", "Invalid file selected", "error");
			$(this).parent("div").addClass("error");
			$("#" + imgprevID).slideUp(1000);
		} else if ($(this).get(0).files[0].size > expectedSize) {
			showSimpleMessage(
				"Attention",
				"Avatar must not be more than " + expectedSize + "KB in size",
				"error"
			);
			$("#" + imgprevID).slideUp(1000);
		} else {
			$("#" + imgprevID).slideUp(1000);
			$("#" + imgprevID).slideDown(1000);
			imagepreview(this, imgID);
		}
	});
}

function imagepreview(input, tempImgID) {
	if (input.files && input.files[0]) {
		var filerd = new FileReader();
		filerd.onload = function (e) {
			$("#" + tempImgID)
				.attr("src", e.target.result)
				.width(200)
				.height(200);
		};
		filerd.readAsDataURL(input.files[0]);
	}
}

function getUrlParameter(sParam) {
	var sPageUrl = window.location.search.substring(1),
		sURLVariables = sPageUrl.split("&"),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split("=");

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined
				? true
				: decodeURIComponent(sParameterName[1]);
		}
	}
}

function getQueryParam(param) {
	var count = 0;

	window.location.search
		.substr(1)
		.split("&")
		.forEach(function (item) {
			if (param == item.split("=")[0]) {
				count++;
			}
		});

	if (count > 0) {
		return true;
	} else {
		return false;
	}
}

function getQueryParameter(param) {
	var found;

	window.location.search
		.substr(1)
		.split("&")
		.forEach(function (item) {
			if (param == item.split("=")[0]) {
				found = decodeURIComponent(item.split("=")[1]);
			}
		});

	return found;
}

function checkParamAvailability(params) {
	//var found = false;

	for (i = 0; i < params.length; i++) {
		if (getQueryParam(params[i]) === false) {
			window.location = "404";
		}
	}

	return true;
}

function dataTableAlertPrevent(tableClass) {
	$.fn.DataTable.ext.errMode = "none";

	$("." + tableClass).on(
		"error.dt",
		function (e, settings, techNote, message) {
			console.log("An error has been reported by DataTables: ", message);
		}
	);
}

function printDiv(divName) {
	var printContents = document.getElementById(divName).innerHTML;
	var originalContents = document.body.innerHTML;

	document.body.innerHTML = printContents;

	window.print();

	document.body.innerHTML = originalContents;
}

String.prototype.toUpperCaseWords = function () {
	return this.replace(/\w+/g, function (a) {
		return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase();
	});
};

//forceNumeric() plug-in implementation
jQuery.fn.forceNumeric = function () {
	return this.each(function () {
		$(this).keydown(function (e) {
			var key = e.which || e.keyCode;

			if (
				(!e.shiftKey &&
					!e.altKey &&
					!e.ctrlKey &&
					//numbers
					key >= 48 &&
					key <= 57) ||
				//Numeric keypad
				(key >= 96 && key <= 105) ||
				//Backspace and Tab and Enter
				key == 8 ||
				key == 9 ||
				key == 13 ||
				//left and right arrow keys
				key == 37 ||
				key == 39 ||
				//Del and ins
				key == 46 ||
				key == 45
			)
				return true;

			return false;
		});
	});
};

function truncateString(str, num) {
	// If the length of str is less than or equal to num
	// just return str--don't truncate it.
	if (str.length <= num) {
		return str;
	}
	// Return str truncated with '...' concatenated to the end of str.
	return str.slice(0, num) + "...";
}

function toTimestamp(strDate) {
	var datum = Date.parse(strDate);
	return datum / 1000;
}

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function pad(n) {
	return n < 10 ? "0" + n : n;
}

function returnHumanReadableDigitalTime(timestamp) {
	var miliseconds = timestamp * 1000;
	var dateObject = new Date(miliseconds);
	var date = dateObject.getDate();
	var month = dateObject.getMonth() + 1;
	var year = dateObject.getFullYear();
	var monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	return year + "-" + pad(month) + "-" + pad(date);
}

function returnHumanReadableTime(timestamp, format) {
	var miliseconds = timestamp * 1000;
	var dateObject = new Date(miliseconds);
	var weekDay = dateObject.toLocaleString("en-US", { weekday: "long" });
	var month = dateObject.toLocaleString("en-US", { month: "long" });
	var day = dateObject.toLocaleString("en-US", { day: "2-digit" });
	var year = dateObject.toLocaleString("en-US", { year: "numeric" });
	var hour = dateObject.toLocaleString("en-US", { hour: "numeric" });
	var minute = dateObject.toLocaleString("en-US", { minute: "numeric" });
	var second = dateObject.toLocaleString("en-US", { second: "numeric" });
	var fullTime = dateObject.toLocaleTimeString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
	var fullDigitalDate = dateObject.toLocaleTimeString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	switch (format) {
		case "weekday":
			return weekDay; //Monday

		case "month":
			return month; //December

		case "day":
			return day; //9

		case "year":
			return year; //2019

		case "hour":
			return hour; //10 AM

		case "minute":
			return minute; //30

		case "second":
			return second; //15

		case "full":
			return (
				weekDay + ", " + month + " " + day + " " + year + " " + fullTime
			);

		case "full-time":
			return fullTime;

		case "full-day":
			return weekDay + ", " + month + " " + day + " " + year;

		case "full-digital-date":
			return fullDigitalDate;

		default:
			return (
				weekDay + ", " + month + " " + day + " " + year + " " + fullTime
			);
	}
}

//block ui
function blockUI() {
	$.blockUI({
		message:
			'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>',
		fadeIn: 800,
		//timeout: 2000, //unblock after 2 seconds
		overlayCSS: {
			backgroundColor: "#191e3a",
			opacity: 0.8,
			zIndex: 1200,
			cursor: "wait",
		},
		css: {
			animation: "spin 2s linear infinite",
			border: 0,
			color: "#25d5e4",
			zIndex: 1201,
			padding: 0,
			backgroundColor: "transparent",
		},
	});
}

function unblockUI() {
	$.unblockUI();
}

$.fn.serializeObject = function () {
	var formData = {};
	var formArray = this.serializeArray();

	for (var i = 0, n = formArray.length; i < n; ++i)
		formData[formArray[i].name] = formArray[i].value;

	return formData;
};

function uuidv4() {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
		/[xy]/g,
		function (c) {
			var r = (Math.random() * 16) | 0,
				v = c == "x" ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		}
	);
}

/*function slugify(text)
{
    return text.toLowerCase().replace(/ /g,'_').replace(/[^\w-]+/g,'');
}*/
function slugify(text) {
	return (
		text
			.toString() //convert to string
			.toLowerCase() //convert the string to lowercase letters
			.normalize("NFD") //returns the unicode normalization form of a given string
			.trim() //removes white spaces from both sides of a string
			/* .replace(/ /g,'_')       //replaces white space with underscore */
			.replace(/[\- ]/g, "_") //replaces white space and hiphens with underscore
			.replace(/[^\w-]+/g, "") //removes all non-word characters
			.replace(/\_\_+/g, "_")
	); // Replace multiple _ with single _
}

function makePgReadable(slug) {
	if (/^-?\d+$/.test(slug.charAt(0))) {
		return `_${slug}`;
	} else {
		return slug;
	}
}

function formatCurrency(amount, currencyCode = "USD", locale = "en-US") {
	const formatter = new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currencyCode,
	});

	return formatter.format(amount);
}
