var bcrypt = require("bcryptjs");
var config = require("config");

function hash_password(password) {
    var saltRound = config.get("salt");
    var salt = bcrypt.genSaltSync(saltRound);
    var hash = bcrypt.hashSync(password, salt);

    return hash;
}

function compare_password(password, hash) {
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    hash_password: hash_password,
    compare_password: compare_password
}