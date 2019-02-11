var express = require("express");
var router = express.Router();

router.use("/admin", require(__dirname + "/admin"));
router.use("/blog", require(__dirname + "/blog"));

router.get("/", function(req, res) {
    //res.json({ "This is message": "This is home page" });
    res.render("test");
    // res.send("/static/test1.html")
    // let a = __dirname.split('\\');
    // let path = '';
    // for (let i = 0; i < a.length - 2; i++) {
    //     path += a[i] + '\\';
    // }
    // res.sendFile(__dirname + "..\\/public/test1.html");
});

router.get("/chat", function(req, res) {
    res.render("chat");
});

module.exports = router;