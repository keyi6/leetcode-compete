use LeetcodeCompete;
db.competitions.createIndex( { "endTime": 1 }, { expireAfterSeconds: 86400 } );
