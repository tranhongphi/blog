var q = require("q");
var db = require("../common/database");
var connec = db.getConnection();

function addUser(user) {
    if (user) {
        var defer = q.defer();
        var query = connec.query('INSERT INTO users SET ?', user, function(err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function getUserByEmail(email) {
    if (email) {
        var defer = q.defer();
        var query = connec.query('SELECT * FROM users WHERE ?', { email: email }, function(err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        })
        return defer.promise;
    }
    return false;
}

function getAllUsers() {
    var defer = q.defer();
    var query = connec.query('SELECT * FROM users', function(err, posts) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(posts);
        }
    })
    return defer.promise;
}

module.exports = {
    addUser: addUser,
    getUserByEmail: getUserByEmail,
    getAllUsers: getAllUsers
}