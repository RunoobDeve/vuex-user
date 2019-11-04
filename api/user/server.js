var express = require('express');
var app = express();
var users = require('./data/user')
let loginUsers = require('./data/loginUser')
const total = users.total;
app.use(express.static(__dirname + '/data'));
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
//登陆
app.get('/login', function (req, res) {
    let { username, password } = req.query;
    return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
            let hasUser = loginUsers.some(u => {
                if (u.username === username && u.password === password) {
                    user = JSON.parse(JSON.stringify(u));
                    user.password = undefined;
                    return true;
                }
            });

            if (hasUser) {
                res.send({ code: 200, msg: '请求成功', user });
            } else {
                res.send({ code: 500, msg: '账号或密码错误' });
            }
        }, 1000);

    })
})
//通过搜索获取用户
app.get('/user/list', function (req, res) {
    // res.send(users.data)
    let { name } = req.query;
    let searchUsers = users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false
        return true
    });
    setTimeout(() => {
        res.send({
            status: 200,
            users: {
                total: searchUsers.length,
                users: searchUsers
            }
        })
    }, 1000)
})

app.get('/user/listpage', function (req, res) {
    let { page, pagesize, name } = req.query;
    name = name || "";
    pagesize = pagesize || 10
    let searchUsers = users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false
        return true
    })
    let total = searchUsers.length;
    searchUsers = searchUsers.filter((u, index) => index < pagesize * page && index >= pagesize * (page - 1));
    setTimeout(() => {
        res.send({
            status: 200,
            users: {
                total: total,
                users: searchUsers
            }
        })
    }, 1000)
})

app.get('/user/remove', function (req, res) {
    let { id } = req.query
    users = users.filter(u => u.id !== id);
    setTimeout(() => {
        res.send({
            code: 200,
            msg: '删除成功'
        })
    }, 500);
})


app.get('/user/batchremove', function (req, res) {
    let { ids } = req.query
    ids = ids.split(',')
    users = users.filter(u => !ids.includes(u.id));
    setTimeout(() => {
        res.send({
            code: 200,
            msg: "删除成功"
        })
    })
})

//编辑用户
app.get('/user/edit', function (req, res) {
    let { id, name, addr, age, birth, sex } = req.query;
    users.some(u => {
        if (u.id === id) {
            u.name = name;
            u.addr = addr;
            u.age = +age;
            u.birth = birth;
            u.sex = +sex;
            return true;
        }
    });

    setTimeout(() => {
        res.send({
            code: 200,
            msg: '编辑成功'
        });
    }, 500);

});

app.get('/user/add', function (req, res) {
    let { name, addr, age, birth, sex } = req.query
    const data = {
        id: String(Math.random()) + String(Date.now()),
        name: name,
        addr: addr,
        age: +age,
        birth: birth,
        sex: +sex
    }
    users.push(data);

    setTimeout(() => {
        res.send({
            code: 200,
            msg: '新增成功',
            res: data
        });
    }, 500);

});



app.listen(3000)