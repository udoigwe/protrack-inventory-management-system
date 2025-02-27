const db = require('../utils/dbConfig');
const util = require('util');
const requestIp = require('request-ip');
const jwt = require('jsonwebtoken');

exports.validateEmail = (email) => {
    
    var filter = /^[\w-.+]+@[a-zA-Z0-9.-]+.[a-zA-Z0-9]{2,4}$/;

    if(filter.test(email))
    {
        return true;
    }
    else 
    {
        return false;
    }
}

exports.validateDigits = (entry) => {
    var filter = /^[0-9]+$/;

    if(filter.test(entry))
    {
        return true;
    }
    else
    {
        return false;
    }
}

exports.validateLeadingZeros = (entry) => {
    var filter = /^(0|[1-9][0-9]*)$/;

    if(filter.test(entry))
    {
        return true
    }
    else
    {
        return false
    }
}

exports.logActivity = async (token, req, connection) => {
    //get decoded token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = decoded;
    //get client ip address
    const clientIP = requestIp.getClientIp(req);
    //get user-agent
    const userAgent = req.useragent;
    const activity = req.activity;
    const action = req.action;
    const activityDetails = JSON.stringify(req.activity_details);
    const now = Math.floor(Date.now() / 1000);

    await util.promisify(connection.query).bind(connection)("INSERT INTO activity_log (user_id, role, activity, action, activity_details, ip_address, user_agent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [user.user_id, user.user_role, activity, action, activityDetails, clientIP, userAgent.source, now]);
}

exports.verifyToken = (token, cb) => {
    jwt.verify(token, process.env.jWT_SECRET, (err, decoded) => {
        if(err)
        {
            cb(err, null);
        }
        else
        {
            cb(null, decoded);
        }
    });
}

exports.uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

exports.generateRandomCharacters = (numberOfCharacters) => {
    var randomValues = '';
    var stringValues = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    var sizeOfCharacter = stringValues.length;

    for(var i = 0; i < numberOfCharacters; i++)
    {
        randomValues = randomValues + stringValues.charAt(Math.floor(Math.random() * sizeOfCharacter));
    }

    return randomValues;
}

exports.slugify = (text) => {
    return text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
}

exports.stripHtmlTags = (str) => {
    str = str.toString();
          
    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');
}

exports.escapeHtml = (str) => {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

//sum of array
exports.sumArray = (arr) => {
	  
    // store our final answer
    var sum = 0;

    // loop through entire array
    for (var i = 0; i < arr.length; i++) {
  
        /*// loop through each inner array
        for (var j = 0; j < arr[i].length; j++) {
    
            // add this number to the current final sum
            sum += arr[i][j];
    
        }*/
        sum += arr[i];
    }

    return sum;
}