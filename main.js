const express = require('express');
const fs = require('fs');
const path = require('path');

const usersPath = path.resolve("./users.json");
const readUsers = () => JSON.parse(fs.readFileSync(usersPath));
const app = express();
const port = 3000

app.use(express.json());

app.post('/user', (req, res, next) => { // add user
    const users = readUsers();
    const { email } = req.body;
    const user = users.find(user => user.email === email);

    if (user) {
        return res.status(409).json({ status: "error", message: "User already exists" });
    }
    req.body.id = users.length ? users[users.length - 1].id + 1 : 1;

    users.push(req.body);
    fs.writeFileSync(usersPath, JSON.stringify(users));
    res.status(201).json({ status: "user created successfully", data: users });
});

app.patch("/user/:id", (req, res, next) => {
    const users = readUsers()
    const { name, age, email } = req.body
    const user = users.find(user => user.id == req.params.id);
    if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    if (name) { user.name = name }
    if (age) { user.age = age }
    if (email) { user.email = email }

    fs.writeFileSync(usersPath, JSON.stringify(users));
    res.status(200).json({ status: "user updated successfully", data: users });
})

app.delete('/user{/:id}', (req, res, next) => {
    const users = readUsers()
    const user = users.find(user => user.id == req.params.id);
    if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    users.splice(users.indexOf(user), 1);
    fs.writeFileSync(usersPath, JSON.stringify(users));
    res.status(200).json({ status: "user deleted successfully", data: users });
})

app.get('/user/getByName', (req, res, next) => {
    const users = readUsers()
    const user = users.find(user => user.name == req.query.name);
    if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    res.status(200).json({ status: "user found successfully", data: user });
})

app.get("/user", (req, res, next) => {
    const users = readUsers()
    res.status(200).json({ status: "success", data: users });
})

app.get('/user/:id', (req, res, next) => {
    const users = readUsers()
    const user = users.find(user => user.id == req.params.id);
    if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    res.status(200).json({ status: "user found successfully", data: user });
})

app.get('/user/filter', (req, res, next) => {
    const users = readUsers()
    const user = users.filter(user => Number(user.age) > Number(req.query.minAge));
    if (user.length === 0) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    res.status(200).json({ status: "user found successfully", data: user });
})

app.listen(port, () => {
    console.log('server app listening on port 3000!');
});