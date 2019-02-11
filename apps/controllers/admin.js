var express = require("express");
var router = express.Router();
var user_md = require("../models/user");
var post_md = require("../models/post");
var helper = require("../helpers/helper");
var bcrypt = require("bcryptjs");


router.get("/", function(req, res) {
    //res.json({ "message": "This is admin page" });
    if (req.session.user) {
        var data = post_md.getAllPosts();
        data.then(function(posts) {
            var data = {
                posts: posts,
                error: false
            }
            res.render("admin/dashboard", { data: data });
        }).catch(function(error) {
            res.render("admin/dashboard", { data: { error: "Co loi xay ra" } });
        });
    } else {
        res.redirect("admin/signin")
    }

});

router.get("/signup", function(req, res) {
    res.render("signup", { data: {} });
});

router.post("/signup", function(req, res) {
    var user = req.body;
    if (user.email.trim().length == 0) {
        res.render("signup", { data: { error: "Email không hợp lệ" } });
    }
    if (user.passwd != user.repasswd || user.passwd.trim().length == 0) {
        res.render("signup", { data: { error: "Mật khẩu không hợp lệ" } });
    }
    var password = helper.hash_password(user.passwd);
    // insert to db
    user = {
        email: user.email,
        password: password,
        first_name: user.firstname,
        last_name: user.lastname
    }

    var check = user_md.getUserByEmail(user.email);
    check.then(function(result) {
        if (result.length != 0) {
            res.render("signup", { data: { error: "Email đã có người đăng ký" } });
        } else {
            var result = user_md.addUser(user);
            result.then(function(data) {
                res.redirect("signin");
            }).catch(function(err) {
                res.render("signup", { data: { error: "Không thể đăng kí!" } });
            });
        }
    });
    // if (check) {
    //     res.render("signup", { data: { error: "Email đã có người đăng ký" } });
    // } else {
    //     var result = user_md.addUser(user);
    //     result.then(function(data) {
    //         res.redirect("signin");
    //     }).catch(function(err) {
    //         res.render("signup", { data: { error: "Không thể đăng kí!" } });
    //     });
    // }

})

router.get("/signin", function(req, res) {
    res.render("signin", { data: {} });
});

router.post("/signin", function(req, res) {
    var params = req.body;
    if (params.email.trim().length == 0) {
        res.render("signin", { data: { error: "Vui lòng nhập email" } });
    } else {
        var data = user_md.getUserByEmail(params.email);
        if (data) {
            data.then(function(users) {
                var user = users[0];
                var status = helper.compare_password(params.password, user.password);
                if (status) {
                    req.session.user = user;
                    res.redirect("/admin");
                } else {
                    res.render("signin", { data: { error: "Sai mật khẩu" } });
                }
            });
        } else {
            res.render("signin", { data: { error: "Không có email này" } });
        }
    }
})

router.get("/post/new", function(req, res) {
    if (req.session.user) {
        res.render("admin/post/new", { data: { error: false } });
    } else {
        res.redirect("admin/signin");
    }
})

router.post("/post/new", function(req, res) {
    var params = req.body;

    if (params.title.trim().length == 0) {
        var data = {
            error: "Vui lòng nhập title"
        };
        res.render("admin/post/new", { data: data });
    } else {

        var now = new Date();
        params.created_at = now;
        params.updated_at = now;

        var data = post_md.addPost(params);

        data.then(function(result) {
            res.redirect("/admin");
        }).catch(function(err) {
            var data = {
                error: "Không thể thêm bài viết"
            }
            res.render("/post/new", { data: data });
        })
    }

});

router.get("/post/edit/:id", function(req, res) {
    if (req.session.user) {
        var params = req.params;
        var id = params.id;
        var data = post_md.getPostByID(id);
        // data.then(result => {
        //     console.log(result)
        // })
        data.then(function(posts) {
            if (posts.length !== 0) {
                var post = posts[0];
                var data = {
                    post: post,
                    error: false
                }
                res.render("admin/post/edit", { data: data });
            } else {
                var data = {
                    error: "Không thể lấy dữ liệu"
                }
                res.render("admin/post/edit", { data: data });
            }
        });
    } else {
        res.redirect("admin/signin");
    }
});

router.put("/post/edit", function(req, res) {
    var params = req.body;
    data = post_md.updatePost(params);

    data.then(function(result) {
        if (result.length !== 0) {
            res.json({ status_code: 200 });
        } else {
            res.json({ status_code: 500 });
        }
    });
});

router.delete("/post/delete", function(req, res) {
    var post_id = req.body.id;

    var data = post_md.deletePost(post_id);

    data.then(function(result) {
        if (result.length !== 0) {
            res.json({ status_code: 200 });
        } else {
            res.json({ status_code: 500 });
        }
    });
});

router.get("/post", function(req, res) {
    if (req.session.user) {
        res.redirect("/admin");
    } else {
        res.redirect("admin/signin");
    }
});

router.get("/user", function(req, res) {
    if (req.session.user) {
        var data = user_md.getAllUsers();

        data.then(function(users) {
            var data = {
                users: users,
                error: false
            };
            res.render("admin/user", { data: data });
        }).catch(function(err) {
            var data = {
                error: "Không thể lấy dữ liệu"
            }
            res.render("admin/user", { data: data });
        });
    } else {
        res.redirect("admin/signin");
    }
})

module.exports = router;