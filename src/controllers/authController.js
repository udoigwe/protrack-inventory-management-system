const db = require("../utils/dbConfig");
const util = require("util");
const requestIp = require("request-ip");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const fsPromises = require("fs").promises;
const moment = require("moment");
const { validateEmail, logActivity, sumArray } = require("../utils/functions");

module.exports = {
	signUp: async (req, res) => {
		const now = Math.floor(Date.now() / 1000);
		const salt = CryptoJS.SHA256(now, process.env.CRYPTOJS_SECRET).toString(
			CryptoJS.enc.Hex
		);
		let d = new Date();
		let year = d.getFullYear();

		const {
			user_firstname,
			user_lastname,
			user_gender,
			user_email,
			user_phone,
			state,
			lg,
			user_contact_address,
			password,
		} = req.body;

		const user_role = !req.body.user_role ? "Customer" : req.body.user_role;
		const user_next_of_kin = !req.body.user_next_of_kin
			? null
			: req.body.user_next_of_kin;
		const user_next_of_kin_phone = !req.body.user_next_of_kin_phone
			? null
			: req.body.user_next_of_kin_phone;
		const user_brief_profile = !req.body.user_brief_profile
			? null
			: req.body.user_brief_profile;
		const user_facebook_url = !req.body.user_facebook_url
			? null
			: req.body.user_facebook_url;
		const user_twitter_url = !req.body.user_twitter_url
			? null
			: req.body.user_twitter_url;
		const user_instagram_url = !req.body.user_instagram_url
			? null
			: req.body.user_instagram_url;
		const user_linkedin_url = !req.body.user_linkedin_url
			? null
			: req.body.user_linkedin_url;

		const acceptedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

		console.log(req.body);

		if (
			!user_firstname ||
			!user_lastname ||
			!user_gender ||
			!user_email ||
			!user_phone ||
			!state ||
			!lg ||
			!user_contact_address ||
			!user_role ||
			!password
		) {
			res.json({
				error: true,
				message:
					"First name, last name, gender, email, phone, state, LGA, contact address, role and password are required for this user",
			});
		} else if (!validateEmail(user_email)) {
			res.json({
				error: true,
				message: "Please provide a valid email address",
			});
		} else if (!req.files) {
			res.json({
				error: true,
				message: "Please provide an image avatar for this user",
			});
		} else if (acceptedMimeTypes.indexOf(req.files.avatar.mimetype) == -1) {
			res.json({
				error: true,
				message: "File attachment must be a jpg or png file",
			});
		} else if (req.files.avatar.size > 200000) {
			res.json({
				error: true,
				message: "File attachment must not be more than 200KB in size",
			});
		} else {
			const encPassword = CryptoJS.AES.encrypt(
				password,
				process.env.CRYPTOJS_SECRET
			).toString();
			const filePath = req.files.avatar.tempFilePath;

			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				await util.promisify(connection.query).bind(connection)(
					"START TRANSACTION"
				);

				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM users WHERE user_email = ? LIMIT 1",
					[user_email]
				);

				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM users WHERE user_phone = ? LIMIT 1",
					[user_phone]
				);

				if (rows.length > 0) {
					throw new Error("Preffered email address already exists");
				}

				if (rows1.length > 0) {
					throw new Error("Preffered phone number already exists");
				}

				const upload = await cloudinary.uploader.upload(filePath, {
					folder: "photoman/avatars/",
					public_id: `${Date.now()}`,
					width: 200,
					height: 200,
					crop: "fill",
					resource_type: "auto",
				});

				await util.promisify(connection.query).bind(connection)(
					"INSERT INTO users (user_firstname, user_lastname, user_gender, user_email, user_phone, user_contact_address, user_next_of_kin, user_next_of_kin_phone, user_image_public_id, user_image_url, user_role, plain_password, enc_password, user_created_at, state, lg, user_brief_profile, user_facebook_url, user_twitter_url, user_instagram_url, user_linkedin_url, last_salt, last_salt_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
					[
						user_firstname,
						user_lastname,
						user_gender,
						user_email,
						user_phone,
						user_contact_address,
						user_next_of_kin,
						user_next_of_kin_phone,
						upload.public_id,
						upload.secure_url,
						user_role,
						password,
						encPassword,
						now,
						state,
						lg,
						user_brief_profile,
						user_facebook_url,
						user_twitter_url,
						user_instagram_url,
						user_linkedin_url,
						salt,
						now,
					]
				);

				let htmlMessage = `    
                    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
                    <html>
                    <head>
            
                        <title>Update Email</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                        <!--[if !mso]>
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <!--<![endif]-->
                        
                        <style type="text/css">
                        
                        .ReadMsgBody { width: 100%; background-color: #FFFFFF; }
                        .ExternalClass { width: 100%; background-color: #FFFFFF; }
                        body { width: 100%; background-color: #FFFFFF; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; font-family: Arial, Times, serif }
                        table { border-collapse: collapse !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                            
                        @-ms-viewport{ width: device-width; }
                        @media only screen and (max-width: 639px){
                        .wrapper{ width:100%;  padding: 0 !important; }
                        }    
                        @media only screen and (max-width: 480px){  
                        .centerClass{ margin:0 auto !important; }
                        .imgClass{ width:100% !important; height:auto; }    
                        .wrapper{ width:320px; padding: 0 !important; }   
                        .container{ width:300px;  padding: 0 !important; }
                        .mobile{ width:300px; display:block; padding: 0 !important; text-align:center !important;}
                        *[class="mobileOff"] { width: 0px !important; display: none !important; }
                        *[class*="mobileOn"] { display: block !important; max-height:none !important; }
                        }
                        
                        </style>
                        
                        <!--[if gte mso 15]>
                        <style type="text/css">
                            table { font-size:1px; line-height:0; mso-margin-top-alt:1px;mso-line-height-rule: exactly; }
                            * { mso-line-height-rule: exactly; }
                        </style>
                        <![endif]-->    
            
                    </head>
                    <body marginwidth="0" marginheight="0" leftmargin="0" topmargin="0" style="background-color:#FFFFFF;  font-family:Arial,serif; margin:0; padding:0; min-width: 100%; -webkit-text-size-adjust:none; -ms-text-size-adjust:none;">
            
                        <!--[if !mso]><!-- -->
                        <img style="min-width:640px; display:block; margin:0; padding:0" class="mobileOff" width="640" height="1" src="http://s14.postimg.org/7139vfhzx/spacer.gif">
                        <!--<![endif]-->
            
                        <!-- Start Background -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">
                            <tr>
                                <td width="100%" valign="top" align="center">
                                    
                            
                                    <!-- START HEADER  -->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f6f6" style="border-bottom:1px solid #f3f3f3;">
                                        <tr>
                                            <td height="30" style="font-size:10px; line-height:10px;"></td>
                                        </tr>
                                        <tr>
                                            <td align="center">
            
                                                <!--Start Container-->
                                                <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                                    <tr>
                                                        <td width="600" class="mobile" align="center" mc:label="the_logo" mc:edit="the_logo">
                                                            
                                                            <h1 style="font-family: Arial, sans-serif; color:#c1c6cf">${process.env.APP_NAME}</h1>
                                                            
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--Start Container-->                   
            
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="35" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>                        
                                    </table> 
                                    <!-- END HEADER  -->
                                    
                                    
                                    <!-- START LOGO  -->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">
                                        <tr>
                                            <td height="40" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
            
                                                <!-- Start Container  -->
                                                <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                                    <tr>
                                                        <td width="600" class="mobile" align="center" mc:label="the_banner" mc:edit="the_banner">
                                                            
                                                            <!--<img src="https://media.giphy.com/media/brsEO1JayBVja/giphy.gif" width="400" height="250" style="margin:0; padding:0; border:none; display:block; border-radius:8px;" border="0" class="imgClass" alt="" mc:edit="the_image" />-->
                                                            <img src="https://res.cloudinary.com/scotcloud/image/upload/v1652505301/photoman/logos/photomanlogo_h5ddgr.png" width="400" height="107" alt="PHOTOMAN Logo" style="margin:0; padding:0; border:none; display:block; border-radius:8px;" border="0" class="imgClass" mc:edit="the_image"/>
                                                            
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!-- Start Container  -->                   
            
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="40" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>                        
                                    </table> 
                                    <!-- END LOGO  --> 
                                    
                                    
                                    <!-- START MESSAGE  -->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">
                                        <tr>
                                            <td height="" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
            
                                                <!-- Start Container  -->
                                                <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                                    <tr>
                                                        <td width="600" class="mobile" style="font-family:arial; font-size:18px; line-height:24px;" align="center" mc:label="the_title" mc:edit="the_title">
                                                            Hello <span style="color:#10a7e8; font-weight:bolder">
                                                            ${user_firstname}</span>,
                                                            
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height="20" style="font-size:10px; line-height:10px;"></td>
                                                    </tr>
                                                    <tr>
                                                        <td width="600" class="mobile" align="center">
                                                            
                                                            <table width="500" class="mobile">
                                                                <tr>
                                                                    <td style="font-family:arial; font-size:14px; line-height:24px; color:#aeaeae;" align="center" mc:label="the_copy" mc:edit="the_copy">
                                                                        
                                                                        <p>Please click the button below to verify your email address.</p>            
                                                                        
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height="20" style="font-size:10px; line-height:10px;"></td>
                                                    </tr>
                                                    <tr>
                                                        <td width="600" class="mobile" align="center">
                                                            
                                                            <!-- Start Button -->
                                                            <table width="170" cellpadding="0" cellspacing="0" align="center" border="0"> 
                                                                <tr>
                                                                    <td width="170" height="46" bgcolor="#10a7e8" align="center" valign="middle" style="font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; line-height:18px; -webkit-border-radius: 50px; -moz-border-radius: 50px; border-radius: 50px; font-weight:bold;" mc:label="the_btnText" mc:edit="the_btnText">
                                                                    <a href="${process.env.APP_WEB_BASE_URL}/email-verification?email=${user_email}&salt=${salt}&verification_type=signup" target="_blank" alias="" style="font-family: Arial, sans-serif; text-decoration: none; color: #ffffff;">Verify <span style="font-size:23px;">&rsaquo;</span></a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <!-- End Button --> 
                                                            
                                                        </td>
                                                    </tr>                                
                                                </table>
                                                <!-- Start Container  -->                   
            
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="45" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>                        
                                    </table> 
                                    <!-- END MESSAGE  -->
                                    
                                    
                                    <!-- START FOOTER  -->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f6f6">
                                        <tr>
                                            <td height="40" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
            
                                                <!-- Start Container  -->
                                                <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                                    <tr>
                                                        <td width="600" class="mobile" align="center">
                                                            
                                                            <table width="450" class="mobile">
                                                                <tr>
                                                                    <td align="center" style="font-family:arial; font-size:12px; line-height:18px; color:#aeaeae;" mc:label="the_terms" mc:edit="the_terms">
                                                                        You are receiving this email because you are a registered entity in ${process.env.APP_NAME}. Please ignore this message if it does not concern you or report immediately.
                                                                        
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                                    
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height="20" style="font-size:10px; line-height:10px;"></td>
                                                    </tr>
                                                    <tr>
                                                        <td width="600" class="mobile" style="font-family:arial; font-size:12px; line-height:18px; color:#aeaeae;" align="center">
                                                            <a href="${process.env.APP_WEB_BASE_URL}/" target="_blank" alias="" style="font-size:12px; line-height:18px; color:#aeaeae; text-decoration:underline;" mc:label="the_unsubscribe" mc:edit="the_unsubscribe">Home</a>

                                                            <span style="color:#dddddd; font-size:17px;">  |  </span>
                                                            
                                                            <a href="${process.env.APP_WEB_BASE_URL}/authentication" target="_blank" alias="" style="font-size:12px; line-height:18px; color:#aeaeae; text-decoration:underline;" mc:label="the_settings" mc:edit="the_settings">Sign Up</a>
                                                            
                                                            <span style="color:#dddddd; font-size:17px;">  |  </span>
                                                            
                                                            <a href="${process.env.APP_WEB_BASE_URL}/authentication" target="_blank" alias="" style="font-size:12px; line-height:18px; color:#aeaeae; text-decoration:underline;" mc:label="the_settings" mc:edit="the_settings">Login</a>
                        
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height="20" style="font-size:10px; line-height:10px;"></td>
                                                    </tr>                                
                                                    <tr>
                                                        <td width="600" class="mobile" style="font-family:arial; font-size:12px; line-height:18px; color:#aeaeae;" align="center" mc:label="the_copyright" mc:edit="the_copyright">
                                                            
                                                            &copy; ${year} ${process.env.APP_NAME}, - All Rights Reserved  
                                                            
                                                        </td>
                                                    </tr>                                
                                                </table>
                                                <!-- Start Container  -->                   
            
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="40" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>                        
                                    </table> 
                                    <!-- END FOOTER  -->                 
                                    
                                </td>
                            </tr>
                        </table>
                        <!-- End Background -->
                        
                    </body>
                    </html>
                `;

				await sendMail(
					user_email,
					"udoigweuchechukwu@bloomhealthtech.com",
					"Email Verification",
					htmlMessage
				);

				await util.promisify(connection.query).bind(connection)(
					"COMMIT"
				);

				res.json({
					error: false,
					message: `One more step!!! Please verify your email at ${user_email} to complete the signup process. You will not be able to sign in if your email is unverified.`,
				});
			} catch (e) {
				await util.promisify(connection.query).bind(connection)(
					"ROLLBACK"
				);

				console.log(e.stack);

				res.json({
					error: true,
					message: e.message,
				});
			} finally {
				connection.release();
			}
		}
	},
	login: async (req, res) => {
		const { email, password } = req.body;
		const clientIP = requestIp.getClientIp(req);
		const userAgent = req.useragent;
		const now = Math.floor(Date.now() / 1000);

		req.action = "LOGIN";
		req.activity = "Logged In";
		req.activity_details = {};

		if (!email || !password) {
			res.json({
				error: true,
				message: "All fields are required",
			});
		} else if (!validateEmail(email)) {
			res.json({
				error: true,
				message: "Please provide a valid email address",
			});
		} else {
			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT a.*, b.* FROM users a LEFT JOIN stores b ON a.store_id = b.store_id WHERE a.user_email = ? LIMIT 1",
					[email]
				);

				if (rows.length == 0) {
					throw new Error("Invalid credentials");
				}

				const user = rows[0];

				const decryptedPassword = CryptoJS.AES.decrypt(
					user.enc_password,
					process.env.CRYPTOJS_SECRET
				);
				const decryptedPasswordToString = decryptedPassword.toString(
					CryptoJS.enc.Utf8
				);

				/* if (decryptedPasswordToString !== password) {
					throw new Error("Invalid credentials");
				} */
				if (user.plain_password !== password) {
					throw new Error("Invalid credentials");
				}

				if (user.login_rights == "Denied") {
					throw new Error(
						"You have been denied access to this system. Please contact administrator"
					);
				}

				if (user.store_status == "Inactive") {
					throw new Error(
						"Sorry!!! Your store is currently deactivated"
					);
				}

				const token = jwt.sign(
					{
						user_id: user.user_id,
						user_store_id: user.store_id,
						user_store_name: user.store_name,
						user_store_logo: user.store_logo,
						user_firstname: user.user_firstname,
						user_lastname: user.user_lastname,
						user_email: user.user_email,
						user_phone: user.user_phone,
						user_gender: user.user_gender,
						user_image_filename: user.user_image_filename,
						user_role: user.user_role,
						user_created_at: user.user_created_at,
						user_write_rights: user.write_rights,
						user_update_rights: user.update_rights,
						user_delete_rights: user.delete_rights,
						user_login_rights: user.login_rights,
					},
					process.env.JWT_SECRET,
					{
						expiresIn: 60 * 60 * 24 * 7,
					}
				);

				await util.promisify(connection.query).bind(connection)(
					"UPDATE users SET last_login_timestamp = ? WHERE user_email = ?",
					[now, email]
				);

				await logActivity(token, req, connection);

				res.json({
					error: false,
					token: token,
				});
			} catch (e) {
				res.json({
					error: true,
					message: e.message,
				});
			} finally {
				connection.release();
			}
		}
	},
	logout: async (req, res) => {
		const token = req.headers["x-access-token"];

		req.action = "LOG OUT";
		req.activity = "Logged Out";
		req.activity_details = {};

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			await logActivity(token, req, connection);

			res.json({
				error: false,
				message: "See you soon",
			});
		} catch (e) {
			res.json({
				error: true,
				message: e.message,
			});
		} finally {
			connection.release();
		}
	},
	updateAccount: async (req, res) => {
		const myData = req.userDecodedData;
		const token = req.headers["x-access-token"];
		const {
			user_firstname,
			user_lastname,
			user_email,
			user_phone,
			user_gender,
		} = req.body;
		const now = Math.floor(Date.now() / 1000);

		req.action = "UPDATE";
		req.activity = "Updated my account";

		if (
			!user_firstname ||
			!user_lastname ||
			!user_email ||
			!user_phone ||
			!user_gender
		) {
			res.json({
				error: true,
				message: "All fields are required",
			});
		} else if (myData.user_update_rights == "Denied") {
			res.json({
				error: true,
				message:
					"Sorry!!! You do not have enough rights to perform this operation. Please contact admin",
			});
		} else if (!validateEmail(user_email)) {
			res.json({
				error: true,
				message: "Please provide a valid email addresss",
			});
		} else {
			req.activity_details = {
				current_firstname: myData.user_firstname,
				current_lastname: myData.user_lastname,
				current_phone: myData.user_phone,
				current_email: myData.user_email,
				current_gender: myData.user_gender,
				user_firstname,
				user_lastname,
				user_gender,
				user_phone,
				user_email,
			};

			let updateQuery =
				"UPDATE users SET user_firstname = ?, user_lastname = ?, user_email = ?, user_phone = ?, user_gender = ? WHERE user_id = ?";

			let updateQueryParams = [
				user_firstname,
				user_lastname,
				user_email,
				user_phone,
				user_gender,
				myData.user_id,
			];

			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM users WHERE user_email = ? AND user_id != ? LIMIT 1",
					[user_email, myData.user_id]
				);

				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM users WHERE user_phone = ? AND user_id != ? LIMIT 1",
					[user_phone, myData.user_id]
				);

				if (rows.length > 0) {
					throw new Error(
						"Email already exists. Please choose another"
					);
				}

				if (rows1.length > 0) {
					throw new Error(
						"Phone number already exists. Please choose another"
					);
				}

				await util.promisify(connection.query).bind(connection)(
					updateQuery,
					updateQueryParams
				);

				let tkn = jwt.sign(
					{
						user_id: myData.user_id,
						user_store_id: myData.user_store_id,
						user_store_name: myData.user_store_name,
						user_firstname,
						user_lastname,
						user_email,
						user_phone,
						user_gender,
						user_role: myData.user_role,
						user_created_at: myData.user_created_at,
						user_write_rights: myData.user_write_rights,
						user_update_rights: myData.user_update_rights,
						user_delete_rights: myData.user_delete_rights,
						user_login_rights: myData.user_login_rights,
						app_settings: myData.app_settings,
					},
					process.env.JWT_SECRET,
					{ expiresIn: 60 * 60 }
				);

				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Profile updated successfully",
					token: tkn,
				});
			} catch (e) {
				res.json({
					error: true,
					message: e.message,
				});
			} finally {
				connection.release();
			}
		}
	},
	updatePassword: async (req, res) => {
		const myData = req.userDecodedData;
		const token = req.headers["x-access-token"];
		const email = myData.user_email;
		const { current_password, new_password } = req.body;

		req.action = "UPDATE";
		req.activity = "Updated my password";

		if (!current_password || !new_password) {
			res.json({
				error: true,
				message: "All fields are required",
			});
		} else {
			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM users WHERE user_email = ? LIMIT 1",
					[email]
				);

				if (rows.length == 0) {
					throw new Error("Your account no longer exists");
				}

				const user = rows[0];

				const decryptedPassword = CryptoJS.AES.decrypt(
					user.enc_password,
					process.env.CRYPTOJS_SECRET
				);
				const decryptedPasswordToString = decryptedPassword.toString(
					CryptoJS.enc.Utf8
				);

				if (decryptedPasswordToString !== current_password) {
					throw new Error(
						"Password provided does not match your stored password. Try Again"
					);
				}

				const encryptedPassword = CryptoJS.AES.encrypt(
					new_password,
					process.env.CRYPTOJS_SECRET
				).toString();

				req.activity_details = { encryptedPassword };

				await util.promisify(connection.query).bind(connection)(
					"UPDATE users SET plain_password = ?, enc_password = ? WHERE user_email = ?",
					[new_password, encryptedPassword, email]
				);

				await logActivity(token, req, connection);

				res.json({
					error: false,
					message: "Password updated successfully",
				});
			} catch (e) {
				res.json({
					error: true,
					message: e.message,
				});
			} finally {
				connection.release();
			}
		}
	},
	sendResetLink: async (req, res) => {
		const { email } = req.body;
		const now = Math.floor(Date.now() / 1000);
		const salt = CryptoJS.SHA256(now, process.env.CRYPTOJS_SECRET).toString(
			CryptoJS.enc.Hex
		);
		let d = new Date();
		let year = d.getFullYear();

		if (!email) {
			res.json({
				error: true,
				message: "Please provide an email address",
			});
		} else if (!validateEmail(email)) {
			res.json({
				error: true,
				message: "Please provide a valid email address",
			});
		} else {
			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				await util.promisify(connection.query).bind(connection)(
					"START TRANSACTION"
				);

				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM users WHERE user_email = ? LIMIT 1",
					[email]
				);

				if (rows.length == 0) {
					throw new Error("Email address does not exist");
				}

				const user = rows[0];

				await util.promisify(connection.query).bind(connection)(
					"UPDATE users SET last_salt = ?, last_salt_timestamp = ? WHERE user_id = ?",
					[salt, now, user.user_id]
				);

				const htmlMessage = `
    
                    <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
                    <html>
                    <head>
            
                        <title>Update Email</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                        <!--[if !mso]>
                        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                        <!--<![endif]-->
                        
                        <style type="text/css">
                        
                        .ReadMsgBody { width: 100%; background-color: #FFFFFF; }
                        .ExternalClass { width: 100%; background-color: #FFFFFF; }
                        body { width: 100%; background-color: #FFFFFF; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; font-family: Arial, Times, serif }
                        table { border-collapse: collapse !important; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                            
                        @-ms-viewport{ width: device-width; }
                        @media only screen and (max-width: 639px){
                        .wrapper{ width:100%;  padding: 0 !important; }
                        }    
                        @media only screen and (max-width: 480px){  
                        .centerClass{ margin:0 auto !important; }
                        .imgClass{ width:100% !important; height:auto; }    
                        .wrapper{ width:320px; padding: 0 !important; }   
                        .container{ width:300px;  padding: 0 !important; }
                        .mobile{ width:300px; display:block; padding: 0 !important; text-align:center !important;}
                        *[class="mobileOff"] { width: 0px !important; display: none !important; }
                        *[class*="mobileOn"] { display: block !important; max-height:none !important; }
                        }
                        
                        </style>
                        
                        <!--[if gte mso 15]>
                        <style type="text/css">
                            table { font-size:1px; line-height:0; mso-margin-top-alt:1px;mso-line-height-rule: exactly; }
                            * { mso-line-height-rule: exactly; }
                        </style>
                        <![endif]-->    
            
                    </head>
                    <body marginwidth="0" marginheight="0" leftmargin="0" topmargin="0" style="background-color:#FFFFFF;  font-family:Arial,serif; margin:0; padding:0; min-width: 100%; -webkit-text-size-adjust:none; -ms-text-size-adjust:none;">
            
                        <!--[if !mso]><!-- -->
                        <img style="min-width:640px; display:block; margin:0; padding:0" class="mobileOff" width="640" height="1" src="http://s14.postimg.org/7139vfhzx/spacer.gif">
                        <!--<![endif]-->
            
                        <!-- Start Background -->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">
                            <tr>
                                <td width="100%" valign="top" align="center">
                                    
                            
                                    <!-- START HEADER  -->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f6f6" style="border-bottom:1px solid #f3f3f3;">
                                        <tr>
                                            <td height="30" style="font-size:10px; line-height:10px;"></td>
                                        </tr>
                                        <tr>
                                            <td align="center">
            
                                                <!--Start Container-->
                                                <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                                    <tr>
                                                        <td width="600" class="mobile" align="center" mc:label="the_logo" mc:edit="the_logo">
                                                            
                                                            <h1 style="font-family: Arial, sans-serif; color:#c1c6cf">${process.env.APP_NAME} UPDATE</h1>
                                                            
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!--Start Container-->                   
            
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="35" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>                        
                                    </table> 
                                    <!-- END HEADER  -->
                                    
                                    
                                    <!-- START LOGO  -->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">
                                        <tr>
                                            <td height="40" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
            
                                                <!-- Start Container  -->
                                                <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                                    <tr>
                                                        <td width="600" class="mobile" align="center" mc:label="the_banner" mc:edit="the_banner">
                                                            
                                                            <!--<img src="https://media.giphy.com/media/brsEO1JayBVja/giphy.gif" width="400" height="250" style="margin:0; padding:0; border:none; display:block; border-radius:8px;" border="0" class="imgClass" alt="" mc:edit="the_image" />-->
                                                            <img src="https://res.cloudinary.com/scotcloud/image/upload/v1652505301/photoman/logos/photomanlogo_h5ddgr.png" width="400" height="107" alt="PHOTOMAN Logo" style="margin:0; padding:0; border:none; display:block; border-radius:8px;" border="0" class="imgClass" mc:edit="the_image"/>
                                                            
                                                        </td>
                                                    </tr>
                                                </table>
                                                <!-- Start Container  -->                   
            
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="40" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>                        
                                    </table> 
                                    <!-- END LOGO  --> 
                                    
                                    
                                    <!-- START MESSAGE  -->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#FFFFFF">
                                        <tr>
                                            <td height="" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
            
                                                <!-- Start Container  -->
                                                <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                                    <tr>
                                                        <td width="600" class="mobile" style="font-family:arial; font-size:18px; line-height:24px;" align="center" mc:label="the_title" mc:edit="the_title">
                                                            Hello <span style="color:#10a7e8; font-weight:bolder">${user.user_firstname}</span>,
                                                            
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height="20" style="font-size:10px; line-height:10px;"></td>
                                                    </tr>
                                                    <tr>
                                                        <td width="600" class="mobile" align="center">
                                                            
                                                            <table width="500" class="mobile">
                                                                <tr>
                                                                    <td style="font-family:arial; font-size:14px; line-height:24px; color:#aeaeae;" align="center" mc:label="the_copy" mc:edit="the_copy">
                                                                        
                                                                        <p>We noticed you requested for a password change. If you authorized this, please click the button below to reset your password, else escalate to the support team immediately.</p>
                                                                        <p><i><b>NOTE<i>:</b> This link expires in 20mins</p>               
                                                                        
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height="20" style="font-size:10px; line-height:10px;"></td>
                                                    </tr>
                                                    <tr>
                                                        <td width="600" class="mobile" align="center">
                                                            
                                                            <!-- Start Button -->
                                                            <table width="170" cellpadding="0" cellspacing="0" align="center" border="0"> 
                                                                <tr>
                                                                    <td width="170" height="46" bgcolor="#10a7e8" align="center" valign="middle" style="font-family: Arial, sans-serif; font-size: 16px; color: #ffffff; line-height:18px; -webkit-border-radius: 50px; -moz-border-radius: 50px; border-radius: 50px; font-weight:bold;" mc:label="the_btnText" mc:edit="the_btnText">
                                                                    <a href="${process.env.APP_WEB_BASE_URL}/password-reset?email=${email}&salt=${salt}" target="_blank" alias="" style="font-family: Arial, sans-serif; text-decoration: none; color: #ffffff;">Reset Password <span style="font-size:23px;">&rsaquo;</span></a>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                            <!-- End Button --> 
                                                            
                                                        </td>
                                                    </tr>                                
                                                </table>
                                                <!-- Start Container  -->                   
            
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="45" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>                        
                                    </table> 
                                    <!-- END MESSAGE  -->
                                    
                                    
                                    <!-- START FOOTER  -->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f6f6">
                                        <tr>
                                            <td height="40" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>
                                        <tr>
                                            <td align="center">
            
                                                <!-- Start Container  -->
                                                <table width="600" cellpadding="0" cellspacing="0" border="0" class="container">
                                                    <tr>
                                                        <td width="600" class="mobile" align="center">
                                                            
                                                            <table width="450" class="mobile">
                                                                <tr>
                                                                    <td align="center" style="font-family:arial; font-size:12px; line-height:18px; color:#aeaeae;" mc:label="the_terms" mc:edit="the_terms">
                                                                        You are receiving this email because you are a registered entity in ${process.env.APP_NAME}. Please ignore this message if it does not concern you or report immediately.
                                                                        
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                                    
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height="20" style="font-size:10px; line-height:10px;"></td>
                                                    </tr>
                                                    <tr>
                                                        <td width="600" class="mobile" style="font-family:arial; font-size:12px; line-height:18px; color:#aeaeae;" align="center">
                                                            <a href="${process.env.APP_WEB_BASE_URL}/" target="_blank" alias="" style="font-size:12px; line-height:18px; color:#aeaeae; text-decoration:underline;" mc:label="the_unsubscribe" mc:edit="the_unsubscribe">Home</a>
                                                            
                                                            <span style="color:#dddddd; font-size:17px;">  |  </span>
                                                            
                                                            <a href="${process.env.APP_WEB_BASE_URL}/authentication" target="_blank" alias="" style="font-size:12px; line-height:18px; color:#aeaeae; text-decoration:underline;" mc:label="the_settings" mc:edit="the_settings">Sign Up</a>
                                                        
                                                            <span style="color:#dddddd; font-size:17px;">  |  </span>
                                                            
                                                            <a href="${process.env.APP_WEB_BASE_URL}/explore" target="_blank" alias="" style="font-size:12px; line-height:18px; color:#aeaeae; text-decoration:underline;" mc:label="the_settings" mc:edit="the_settings">Explore</a>
                        
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td height="20" style="font-size:10px; line-height:10px;"></td>
                                                    </tr>                                
                                                    <tr>
                                                        <td width="600" class="mobile" style="font-family:arial; font-size:12px; line-height:18px; color:#aeaeae;" align="center" mc:label="the_copyright" mc:edit="the_copyright">
                                                            
                                                            &copy; ${year} ${process.env.APP_NAME}, - All Rights Reserved  
                                                            
                                                        </td>
                                                    </tr>                                
                                                </table>
                                                <!-- Start Container  -->                   
            
                                            </td>
                                        </tr>
                                        <tr>
                                            <td height="40" style="font-size:10px; line-height:10px;"> </td>
                                        </tr>                        
                                    </table> 
                                    <!-- END FOOTER  -->                 
                                    
                                </td>
                            </tr>
                        </table>
                        <!-- End Background -->
                        
                    </body>
                    </html>
                `;

				await sendMail(
					email,
					process.env.APP_EMAIL_ADDRESS,
					"Reset Password",
					htmlMessage
				);

				await util.promisify(connection.query).bind(connection)(
					"COMMIT"
				);

				res.json({
					error: false,
					message: `A Password Reset Link was sent to ${email} successfully. Link expires in 20mins.`,
				});
			} catch (e) {
				console.log(e.stack);
				res.json({
					error: true,
					message: e.message,
				});
			} finally {
				connection.release();
			}
		}
	},
	validateResetSalt: async (req, res) => {
		const { email, salt } = req.query;
		const now = Math.floor(Date.now() / 1000);

		if (!email || !salt) {
			res.json({
				error: true,
				message: "Invalid request",
			});
		} else if (!validateEmail(email)) {
			res.json({
				error: true,
				message: "Please provide a valid email address",
			});
		} else {
			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM users WHERE user_email = ? LIMIT 1",
					[email]
				);

				if (rows.length == 0) {
					throw new Error("Email does not exist");
				}

				const user = rows[0];

				if (user.last_salt !== salt) {
					throw new Error("Invalid request token");
				}

				if (now - parseInt(user.last_salt_timestamp) >= 1200) {
					throw new Error(
						"Link has expired expired. Please generate another."
					);
				}

				res.json({
					error: false,
					message:
						"Reset link is genuine. Proceed to reset your password",
				});
			} catch (e) {
				res.json({
					error: true,
					message: e.message,
				});
			} finally {
				connection.release();
			}
		}
	},
	verifyEmail: async (req, res) => {
		const { email, salt, verification_type } = req.query;
		const now = Math.floor(Date.now() / 1000);

		if (!email || !salt || !verification_type) {
			res.json({
				error: true,
				message: "Invalid request",
			});
		} else if (!validateEmail(email)) {
			res.json({
				error: true,
				message: "Invalid request email",
			});
		} else {
			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				if (verification_type == "signup") {
					const rows = await util
						.promisify(connection.query)
						.bind(connection)(
						"SELECT * FROM users WHERE user_email = ? LIMIT 1",
						[email]
					);

					if (rows.length == 0) {
						throw new Error("User does not exist");
					}

					const user = rows[0];

					if (user.last_salt !== salt) {
						throw new Error(
							"Invalid verification token in request"
						);
					}

					await util.promisify(connection.query).bind(connection)(
						"UPDATE users SET last_salt = NULL, last_salt_timestamp = NULL, email_verification_status = 'Verified' WHERE user_id = ?",
						[user.user_id]
					);

					res.json({
						error: false,
						message:
							"Your email address has been verified successfully",
					});
				} else {
					const rows = await util
						.promisify(connection.query)
						.bind(connection)(
						"SELECT * FROM mailing_list WHERE email_address = ? LIMIT 1",
						[email]
					);

					if (rows.length == 0) {
						throw new Error(
							"Email address does not exist in our mailing list"
						);
					}

					const data = rows[0];

					if (data.verification_salt !== salt) {
						throw new Error(
							"Invalid verification token in request"
						);
					}

					await util.promisify(connection.query).bind(connection)(
						"UPDATE mailing_list SET verification_salt = NULL, verification_status = 'Verified' WHERE mailing_id = ?",
						[data.mailing_id]
					);

					res.json({
						error: false,
						message:
							"Your email address has been verified and included in our mailing list, successfully",
					});
				}
			} catch (e) {
				res.json({
					error: true,
					message: e.message,
				});
			} finally {
				connection.release();
			}
		}
	},
	resetPassword: async (req, res) => {
		const { email, password, salt } = req.body;
		const now = Math.floor(Date.now() / 1000);

		if (!email || !password) {
			res.json({
				error: true,
				message: "All fields are required",
			});
		} else if (!validateEmail(email)) {
			res.json({
				error: true,
				message: "Please provide a valid email address",
			});
		} else {
			const connection = await util
				.promisify(db.getConnection)
				.bind(db)();

			try {
				const rows = await util
					.promisify(connection.query)
					.bind(connection)(
					"SELECT * FROM users WHERE user_email = ? LIMIT 1",
					[email]
				);

				if (rows.length == 0) {
					throw new Error("Email does not exist");
				}

				const user = rows[0];
				const encryptedPassword = CryptoJS.AES.encrypt(
					password,
					process.env.CRYPTOJS_SECRET
				).toString();

				if (user.last_salt !== salt) {
					throw new Error("Invalid request token");
				}

				if (now - parseInt(user.last_salt_timestamp) >= 1200) {
					throw new Error("Password Reset Link has expired.");
				}

				await util.promisify(connection.query).bind(connection)(
					"UPDATE users SET plain_password = ?, enc_password = ?, last_salt = NULL, last_salt_timestamp = NULL WHERE user_id = ?",
					[password, encryptedPassword, user.user_id]
				);

				res.json({
					error: false,
					message: "Password reset was successful.",
				});
			} catch (e) {
				res.json({
					error: true,
					message: e.message,
				});
			} finally {
				connection.release();
			}
		}
	},
	dashboard: async (req, res) => {
		const myData = req.userDecodedData;
		const now = Math.floor(Date.now() / 1000);
		const year = moment().format("YYYY");
		const months = [
			"01",
			"02",
			"03",
			"04",
			"05",
			"06",
			"07",
			"08",
			"09",
			"10",
			"11",
			"12",
		];
		const monthLabelsArray = [];
		const incomeArray = [];
		const expenditureArray = [];
		const balanceArray = [];
		const salesArray = [];

		let dashboard;

		const connection = await util.promisify(db.getConnection).bind(db)();

		try {
			//get last 10 activities
			let rows = await util.promisify(connection.query).bind(connection)(
				`SELECT * FROM activity_log WHERE user_id = ? ORDER BY activity_id DESC LIMIT 10`,
				[myData.user_id]
			);

			if (myData.user_role == "Cashier") {
				//count my recorded sales
				const rows1 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS sales_count FROM invoices WHERE cashier_id = ? AND store_id = ?`,
					[myData.user_id, myData.user_store_id]
				);

				//count my recorded sales for this month
				const rows2 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS sales_count_this_month FROM invoices WHERE cashier_id = ? AND store_id = ? AND FROM_UNIXTIME(invoice_order_timestamp, '%Y-%m') = FROM_UNIXTIME(?, '%Y-%m')`,
					[myData.user_id, myData.user_store_id, now]
				);

				//count my recorded sales for today
				const rows3 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS sales_count_today FROM invoices WHERE cashier_id = ? AND store_id = ? AND FROM_UNIXTIME(invoice_order_timestamp, '%Y-%m-%d') = FROM_UNIXTIME(?, '%Y-%m-%d')`,
					[myData.user_id, myData.user_store_id, now]
				);

				//get total amount i have sold
				const rows4 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(invoice_net_total) AS total_amount_sold FROM invoices WHERE cashier_id = ? AND store_id = ?`,
					[myData.user_id, myData.user_store_id]
				);

				//get total amount i sold for this month
				const rows5 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(invoice_net_total) AS total_amount_sold_this_month FROM invoices WHERE cashier_id = ? AND store_id = ? AND FROM_UNIXTIME(invoice_order_timestamp, '%Y-%m') = FROM_UNIXTIME(?, '%Y-%m')`,
					[myData.user_id, myData.user_store_id, now]
				);

				//get total amount i sold for today
				const rows6 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(invoice_net_total) AS total_amount_sold_today FROM invoices WHERE cashier_id = ? AND store_id = ? AND FROM_UNIXTIME(invoice_order_timestamp, '%Y-%m-%d') = FROM_UNIXTIME(?, '%Y-%m-%d')`,
					[myData.user_id, myData.user_store_id, now]
				);

				//get last ten reorder level product
				let rows7 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT a.*, b.store_name, c.product_category_name, d.product_brand_name FROM products a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN product_categories c ON a.product_category_id = c.product_category_id LEFT JOIN product_brands d ON a.product_brand_id = d.product_brand_id WHERE a.product_stock <= a.product_reorder_level AND a.store_id = ? ORDER BY a.product_id DESC LIMIT 10`,
					[myData.user_store_id]
				);

				//get expired product
				let rows10 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT a.*, b.store_name, c.product_category_name, d.product_brand_name FROM products a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN product_categories c ON a.product_category_id = c.product_category_id LEFT JOIN product_brands d ON a.product_brand_id = d.product_brand_id WHERE a.product_expiry_date <= NOW() AND a.store_id = ? ORDER BY a.product_expiry_date DESC`,
					[myData.user_store_id]
				);

				//get my last ten sales
				let rows8 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS cashier FROM invoices a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.cashier_id = c.user_id WHERE a.store_id = ? AND a.cashier_id = ? ORDER BY a.invoice_id DESC LIMIT 10`,
					[myData.user_store_id, myData.user_id]
				);

				//generate my monthly sales chart
				for (var i = 0; i < months.length; i++) {
					const month = months[i];

					const period = `${year}-${month}`;

					//get income for this period
					let rows9 = await util
						.promisify(connection.query)
						.bind(connection)(
						"SELECT SUM(invoice_net_total) AS total_amount_sold_this_month FROM invoices WHERE cashier_id = ? AND store_id = ? AND FROM_UNIXTIME(invoice_order_timestamp, '%Y-%m') = ?",
						[myData.user_id, myData.user_store_id, period]
					);

					//push to arrays
					monthLabelsArray.push(moment(period).format("MMM"));
					salesArray.push(
						parseFloat(rows9[0].total_amount_sold_this_month) || 0
					);
				}

				//generate monthly revenue chart
				const chartData = {
					labels: monthLabelsArray,
					datasets: {
						salesArray,
						total_sold: sumArray(salesArray),
					},
				};

				dashboard = {
					activities: rows,
					sales_count: parseInt(rows1[0].sales_count),
					sales_count_this_month: parseInt(
						rows2[0].sales_count_this_month
					),
					sales_count_today: parseInt(rows3[0].sales_count_today),
					total_amount_sold:
						parseFloat(rows4[0].total_amount_sold) || 0,
					total_amount_sold_this_month:
						parseFloat(rows5[0].total_amount_sold_this_month) || 0,
					total_amount_sold_today:
						parseFloat(rows6[0].total_amount_sold_today) || 0,
					reorder_level_products: rows7,
					recent_sales: rows8,
					chart_data: chartData,
					expired_products: rows10,
				};

				res.json({
					error: false,
					dashboard,
				});
			}

			if (myData.user_role == "Super Admin") {
				//instantiate
				//count sales
				let rows1 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS sales_count FROM invoices`
				);

				//get total income from sales
				let rows2 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(invoice_net_total) AS total_income_from_sales FROM invoices`
				);

				//get total income from sales this month
				let rows16 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(invoice_net_total) AS total_income_from_sales_this_month FROM invoices WHERE FROM_UNIXTIME(invoice_order_timestamp, '%Y-%m') = FROM_UNIXTIME(?, '%Y-%m')`,
					[now]
				);

				//get total income from sales today
				let rows20 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(invoice_net_total) AS total_income_from_sales_today FROM invoices WHERE FROM_UNIXTIME(invoice_order_timestamp, '%Y-%m-%d') = FROM_UNIXTIME(?, '%Y-%m-%d')`,
					[now]
				);

				//count active products
				let rows3 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS active_products_count FROM products WHERE product_status = 'Active'`
				);

				//count reorder level products
				let rows4 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS reorder_level_products_count FROM products WHERE product_status = 'Active' AND product_stock <= product_reorder_level`
				);

				//count product brands
				let rows5 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS product_brands_count FROM product_brands WHERE product_brand_status = 'Active'`
				);

				//count product categories
				let rows6 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS product_categories_count FROM product_categories WHERE product_category_status = 'Active'`
				);

				//count purchase orders
				let rows7 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS purchase_orders_count FROM purchase_orders`
				);

				//get total amount in purchase orders
				let rows8 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(purchase_order_total_amount) AS total_expenditure_from_purchase_orders FROM purchase_orders`
				);

				//get total amount in purchase orders this month
				let rows17 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(purchase_order_total_amount) AS total_expenditure_from_purchase_orders_this_month FROM purchase_orders WHERE FROM_UNIXTIME(purchase_order_timestamp, '%Y-%m') = FROM_UNIXTIME(?, '%Y-%m')`,
					[now]
				);

				//get total amount in purchase orders today
				let rows21 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(purchase_order_total_amount) AS total_expenditure_from_purchase_orders_today FROM purchase_orders WHERE FROM_UNIXTIME(purchase_order_timestamp, '%Y-%m-%d') = FROM_UNIXTIME(?, '%Y-%m-%d')`,
					[now]
				);

				//count active stores
				let rows9 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS active_stores_count FROM stores WHERE store_status = 'Active'`
				);

				//get total income
				let rows10 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(expected_amount) AS total_income FROM transactions WHERE transaction_type = 'Income'`
				);

				//get total income this month
				let rows18 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(expected_amount) AS total_income_this_month FROM transactions WHERE transaction_type = 'Income' AND FROM_UNIXTIME(transaction_timestamp, '%Y-%m') = FROM_UNIXTIME(?, '%Y-%m')`,
					[now]
				);

				//get total income today
				let rows22 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(expected_amount) AS total_income_today FROM transactions WHERE transaction_type = 'Income' AND FROM_UNIXTIME(transaction_timestamp, '%Y-%m-%d') = FROM_UNIXTIME(?, '%Y-%m-%d')`,
					[now]
				);

				//get total expenditure
				let rows11 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(expected_amount) AS total_expenditure FROM transactions WHERE transaction_type = 'Expenditure'`
				);

				//get total expenditure this month
				let rows19 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(expected_amount) AS total_expenditure_this_month FROM transactions WHERE transaction_type = 'Expenditure' AND FROM_UNIXTIME(transaction_timestamp, '%Y-%m') = FROM_UNIXTIME(?, '%Y-%m')`,
					[now]
				);

				//get total expenditure today
				let rows23 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(expected_amount) AS total_expenditure_today FROM transactions WHERE transaction_type = 'Expenditure' AND FROM_UNIXTIME(transaction_timestamp, '%Y-%m-%d') = FROM_UNIXTIME(?, '%Y-%m-%d')`,
					[now]
				);

				//count super admin users
				let rows12 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS super_admin_users_count FROM users WHERE user_role = 'Super Admin'`
				);

				//count admin users
				let rows13 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS admin_users_count FROM users WHERE user_role = 'Admin'`
				);

				//count cashier users
				let rows14 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS cashier_users_count FROM users WHERE user_role = 'Cashier'`
				);

				//get last ten reorder level product
				let rows24 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT a.*, b.store_name, c.product_category_name, d.product_brand_name FROM products a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN product_categories c ON a.product_category_id = c.product_category_id LEFT JOIN product_brands d ON a.product_brand_id = d.product_brand_id WHERE a.product_stock <= a.product_reorder_level ORDER BY a.product_id DESC LIMIT 10`
				);

				//get expired product
				let rows26 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT a.*, b.store_name, c.product_category_name, d.product_brand_name FROM products a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN product_categories c ON a.product_category_id = c.product_category_id LEFT JOIN product_brands d ON a.product_brand_id = d.product_brand_id WHERE a.product_expiry_date <= NOW() ORDER BY a.product_expiry_date DESC`
				);

				//get last ten sales
				let rows25 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS cashier FROM invoices a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.cashier_id = c.user_id ORDER BY a.invoice_id DESC LIMIT 10`
				);

				//generate monthly revenue chart
				for (var i = 0; i < months.length; i++) {
					const month = months[i];

					const period = `${year}-${month}`;

					//get income for this period
					let rows16 = await util
						.promisify(connection.query)
						.bind(connection)(
						"SELECT SUM(transacted_amount) AS total_income FROM transactions WHERE transaction_type = 'Income' AND FROM_UNIXTIME(transaction_timestamp, '%Y-%m') = ?",
						[period]
					);

					//get expenditure for this period
					let rows17 = await util
						.promisify(connection.query)
						.bind(connection)(
						"SELECT SUM(transacted_amount) AS total_expenditure FROM transactions WHERE transaction_type = 'Expenditure' AND FROM_UNIXTIME(transaction_timestamp, '%Y-%m') = ?",
						[period]
					);

					//get balance for this period
					const balance =
						parseFloat(rows16[0].total_income) -
						parseFloat(rows17[0].total_expenditure);

					//push to arrays
					monthLabelsArray.push(moment(period).format("MMM"));
					incomeArray.push(parseFloat(rows16[0].total_income) || 0);
					expenditureArray.push(
						parseFloat(rows17[0].total_expenditure) || 0
					);
					balanceArray.push(balance || 0);
				}

				//generate monthly revenue chart
				const chartData = {
					labels: monthLabelsArray,
					datasets: {
						incomeArray,
						expenditureArray,
						balanceArray,
					},
				};

				dashboard = {
					activities: rows,
					sales_count: parseInt(rows1[0].sales_count),
					total_income_from_sales:
						parseFloat(rows2[0].total_income_from_sales) || 0,
					total_income_from_sales_this_month:
						parseFloat(
							rows16[0].total_income_from_sales_this_month
						) || 0,
					total_income_from_sales_today:
						parseFloat(rows20[0].total_income_from_sales_today) ||
						0,
					active_products_count: parseInt(
						rows3[0].active_products_count
					),
					reorder_level_products_count: parseInt(
						rows4[0].reorder_level_products_count
					),
					product_brands_count: parseInt(
						rows5[0].product_brands_count
					),
					product_categories_count: parseInt(
						rows6[0].product_categories_count
					),
					purchase_orders_count: parseInt(
						rows7[0].purchase_orders_count
					),
					total_expenditure_from_purchase_orders:
						parseFloat(
							rows8[0].total_expenditure_from_purchase_orders
						) || 0,
					total_expenditure_from_purchase_orders_this_month:
						parseFloat(
							rows17[0]
								.total_expenditure_from_purchase_orders_this_month
						) || 0,
					total_expenditure_from_purchase_orders_today:
						parseFloat(
							rows21[0]
								.total_expenditure_from_purchase_orders_today
						) || 0,
					active_stores_count: parseInt(rows9[0].active_stores_count),
					total_income: parseFloat(rows10[0].total_income) || 0,
					total_income_this_month:
						parseFloat(rows18[0].total_income_this_month) || 0,
					total_income_today:
						parseFloat(rows22[0].total_income_today) || 0,
					total_expenditure:
						parseFloat(rows11[0].total_expenditure) || 0,
					total_expenditure_this_month:
						parseFloat(rows19[0].total_expenditure_this_month) || 0,
					total_expenditure_today:
						parseFloat(rows23[0].total_expenditure_today) || 0,
					super_admin_users_count: parseInt(
						rows12[0].super_admin_users_count
					),
					admin_users_count: parseInt(rows13[0].admin_users_count),
					cashier_users_count: parseInt(
						rows14[0].cashier_users_count
					),
					reorder_level_products: rows24,
					recent_sales: rows25,
					chart_data: chartData,
					expired_products: rows26,
				};

				res.json({
					error: false,
					dashboard,
				});
			}

			if (myData.user_role == "Admin") {
				//instantiate
				//count sales
				let rows1 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS sales_count FROM invoices WHERE store_id = ?`,
					[myData.user_store_id]
				);

				//get total income from sales
				let rows2 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(invoice_net_total) AS total_income_from_sales FROM invoices WHERE store_id = ?`,
					[myData.user_store_id]
				);

				//get total income from sales this month
				let rows3 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(invoice_net_total) AS total_income_from_sales_this_month FROM invoices WHERE FROM_UNIXTIME(invoice_order_timestamp, '%Y-%m') = FROM_UNIXTIME(?, '%Y-%m') AND store_id = ?`,
					[now, myData.user_store_id]
				);

				//get total income from sales today
				let rows4 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(invoice_net_total) AS total_income_from_sales_today FROM invoices WHERE FROM_UNIXTIME(invoice_order_timestamp, '%Y-%m-%d') = FROM_UNIXTIME(?, '%Y-%m-%d') AND store_id = ?`,
					[now, myData.user_store_id]
				);

				//count active products
				let rows5 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS active_products_count FROM products WHERE product_status = 'Active' AND store_id = ?`,
					[myData.user_store_id]
				);

				//count reorder level products
				let rows6 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS reorder_level_products_count FROM products WHERE product_status = 'Active' AND product_stock <= product_reorder_level AND store_id = ?`,
					[myData.user_store_id]
				);

				//count purchase orders
				let rows7 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS purchase_orders_count FROM purchase_orders WHERE store_id = ?`,
					[myData.user_store_id]
				);

				//get total amount in purchase orders
				let rows8 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(purchase_order_total_amount) AS total_expenditure_from_purchase_orders FROM purchase_orders WHERE store_id = ?`,
					[myData.user_store_id]
				);

				//get total amount in purchase orders this month
				let rows9 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(purchase_order_total_amount) AS total_expenditure_from_purchase_orders_this_month FROM purchase_orders WHERE FROM_UNIXTIME(purchase_order_timestamp, '%Y-%m') = FROM_UNIXTIME(?, '%Y-%m') AND store_id = ?`,
					[now, myData.user_store_id]
				);

				//get total amount in purchase orders today
				let rows10 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(purchase_order_total_amount) AS total_expenditure_from_purchase_orders_today FROM purchase_orders WHERE FROM_UNIXTIME(purchase_order_timestamp, '%Y-%m-%d') = FROM_UNIXTIME(?, '%Y-%m-%d') AND store_id = ?`,
					[now, myData.user_store_id]
				);

				//get total income
				let rows11 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(expected_amount) AS total_income FROM transactions WHERE transaction_type = 'Income' AND store_id = ?`,
					[myData.user_store_id]
				);

				//get total income this month
				let rows12 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(expected_amount) AS total_income_this_month FROM transactions WHERE transaction_type = 'Income' AND FROM_UNIXTIME(transaction_timestamp, '%Y-%m') = FROM_UNIXTIME(?, '%Y-%m') AND store_id = ?`,
					[now, myData.user_store_id]
				);

				//get total income today
				let rows13 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(expected_amount) AS total_income_today FROM transactions WHERE transaction_type = 'Income' AND FROM_UNIXTIME(transaction_timestamp, '%Y-%m-%d') = FROM_UNIXTIME(?, '%Y-%m-%d') AND store_id = ?`,
					[now, myData.user_store_id]
				);

				//get total expenditure
				let rows14 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(expected_amount) AS total_expenditure FROM transactions WHERE transaction_type = 'Expenditure' AND store_id = ?`,
					[myData.user_store_id]
				);

				//get total expenditure this month
				let rows15 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(expected_amount) AS total_expenditure_this_month FROM transactions WHERE transaction_type = 'Expenditure' AND FROM_UNIXTIME(transaction_timestamp, '%Y-%m') = FROM_UNIXTIME(?, '%Y-%m') AND store_id = ?`,
					[now, myData.user_store_id]
				);

				//get total expenditure today
				let rows16 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT SUM(expected_amount) AS total_expenditure_today FROM transactions WHERE transaction_type = 'Expenditure' AND FROM_UNIXTIME(transaction_timestamp, '%Y-%m-%d') = FROM_UNIXTIME(?, '%Y-%m-%d') AND store_id = ?`,
					[now, myData.user_store_id]
				);

				//count admin users
				let rows17 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS admin_users_count FROM users WHERE user_role = 'Admin' AND store_id = ?`,
					[myData.user_store_id]
				);

				//count cashier users
				let rows18 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT COUNT(*) AS cashier_users_count FROM users WHERE user_role = 'Cashier' AND store_id = ?`,
					[myData.user_store_id]
				);

				//get last ten reorder level product
				let rows19 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT a.*, b.store_name, c.product_category_name, d.product_brand_name FROM products a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN product_categories c ON a.product_category_id = c.product_category_id LEFT JOIN product_brands d ON a.product_brand_id = d.product_brand_id WHERE a.product_stock <= a.product_reorder_level AND a.store_id = ? ORDER BY a.product_id DESC LIMIT 10`,
					[myData.user_store_id]
				);

				//get expired product
				let rows21 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT a.*, b.store_name, c.product_category_name, d.product_brand_name FROM products a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN product_categories c ON a.product_category_id = c.product_category_id LEFT JOIN product_brands d ON a.product_brand_id = d.product_brand_id WHERE a.product_expiry_date <= NOW() AND a.store_id = ? ORDER BY a.product_expiry_date DESC`,
					[myData.user_store_id]
				);

				//get last ten sales
				let rows20 = await util
					.promisify(connection.query)
					.bind(connection)(
					`SELECT a.*, b.store_name, CONCAT(c.user_firstname,' ',c.user_lastname) AS cashier FROM invoices a LEFT JOIN stores b ON a.store_id = b.store_id LEFT JOIN users c ON a.cashier_id = c.user_id WHERE a.store_id = ? ORDER BY a.invoice_id DESC LIMIT 10`,
					[myData.user_store_id]
				);

				//generate monthly revenue chart
				for (var i = 0; i < months.length; i++) {
					const month = months[i];

					const period = `${year}-${month}`;

					//get income for this period
					let rows21 = await util
						.promisify(connection.query)
						.bind(connection)(
						"SELECT SUM(transacted_amount) AS total_income FROM transactions WHERE transaction_type = 'Income' AND FROM_UNIXTIME(transaction_timestamp, '%Y-%m') = ? AND store_id = ?",
						[period, myData.user_store_id]
					);

					//get expenditure for this period
					let rows22 = await util
						.promisify(connection.query)
						.bind(connection)(
						"SELECT SUM(transacted_amount) AS total_expenditure FROM transactions WHERE transaction_type = 'Expenditure' AND FROM_UNIXTIME(transaction_timestamp, '%Y-%m') = ? AND store_id = ?",
						[period, myData.user_store_id]
					);

					//get balance for this period
					const balance =
						parseFloat(rows21[0].total_income) -
						parseFloat(rows22[0].total_expenditure);

					//push to arrays
					monthLabelsArray.push(moment(period).format("MMM"));
					incomeArray.push(parseFloat(rows21[0].total_income) || 0);
					expenditureArray.push(
						parseFloat(rows22[0].total_expenditure) || 0
					);
					balanceArray.push(balance || 0);
				}

				//generate monthly revenue chart
				const chartData = {
					labels: monthLabelsArray,
					datasets: {
						incomeArray,
						expenditureArray,
						balanceArray,
					},
				};

				dashboard = {
					activities: rows,
					sales_count: parseInt(rows1[0].sales_count),
					total_income_from_sales:
						parseFloat(rows2[0].total_income_from_sales) || 0,
					total_income_from_sales_this_month:
						parseFloat(
							rows3[0].total_income_from_sales_this_month
						) || 0,
					total_income_from_sales_today:
						parseFloat(rows4[0].total_income_from_sales_today) || 0,
					active_products_count: parseInt(
						rows5[0].active_products_count
					),
					reorder_level_products_count: parseInt(
						rows6[0].reorder_level_products_count
					),
					purchase_orders_count: parseInt(
						rows7[0].purchase_orders_count
					),
					total_expenditure_from_purchase_orders:
						parseFloat(
							rows8[0].total_expenditure_from_purchase_orders
						) || 0,
					total_expenditure_from_purchase_orders_this_month:
						parseFloat(
							rows9[0]
								.total_expenditure_from_purchase_orders_this_month
						) || 0,
					total_expenditure_from_purchase_orders_today:
						parseFloat(
							rows10[0]
								.total_expenditure_from_purchase_orders_today
						) || 0,
					total_income: parseFloat(rows11[0].total_income) || 0,
					total_income_this_month:
						parseFloat(rows12[0].total_income_this_month) || 0,
					total_income_today:
						parseFloat(rows13[0].total_income_today) || 0,
					total_expenditure:
						parseFloat(rows14[0].total_expenditure) || 0,
					total_expenditure_this_month:
						parseFloat(rows15[0].total_expenditure_this_month) || 0,
					total_expenditure_today:
						parseFloat(rows16[0].total_expenditure_today) || 0,
					admin_users_count: parseInt(rows17[0].admin_users_count),
					cashier_users_count: parseInt(
						rows18[0].cashier_users_count
					),
					reorder_level_products: rows19,
					recent_sales: rows20,
					chart_data: chartData,
					expired_products: rows21,
				};

				res.json({
					error: false,
					dashboard,
				});
			}
		} catch (e) {
			console.log(e.stack);

			res.json({
				error: true,
				message: e.message,
			});
		} finally {
			connection.release();
		}
	},
};
