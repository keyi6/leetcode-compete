var user="USER";
var pwd="PWD";

use admin;
db.createUser({
    user,
    pwd,
    roles: [
        { role: "readWrite", db: "LeetcodeCompete" },
        { role: "readWrite", db: "LeetcodeSubmissions" },
    ],
});
