
var user="USER";
var pwd="PWD";

use LeetcodeCompete;
db.createUser({user: user, pwd: pwd, roles: ["readWrite"]});
