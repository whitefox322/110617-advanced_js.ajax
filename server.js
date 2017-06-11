const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const uuid = require("uuid");
const nodeStatic = require("node-static");
const file = new nodeStatic.Server(".");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const todos = [];

app.get('/api/todo/:id?', function (req, res) {
	const id = req.params.id;
	if (!id) {
		res.send(todos);
	} else {
		const result = todos.find(function (todo) {
			return todo.id === id;
		});
		if (!result) {
			return res.status(404)
				.send("Can't find todo with id specified by you.");
		}

		res.send(result);
	}
});
app.post('/api/todo', function (req, res) {
	if (!Todo.isValid(req.body)) {
		res.status(400)
			.send("Data has incorrect format. Expected type with 'id', 'title' and 'desc' props.");
	} else {
		req.body.id = null;
		const todo = new Todo(req.body);
		todos.push(todo);

		res.send(todo);
	}
});
app.put('/api/todo', function (req, res) {
	if (!Todo.isValid(req.body)) {
		return res.status(400)
			.send("Data has incorrect format. Expected type with 'id', 'title' and 'desc' props.")
	} else {
		const existent = todos.find(t => t.id === req.body.id);
		if (!existent) {
			return res.status(404)
				.send("Can't update todo because we can't find todo with id specified by you.")
		}

		existent.initFrom(req.body);
		return res.send(existent);
	}
});


app.delete('/api/todo/:id', function (req, res) {
	const existent = todos.find(t => t.id === req.params.id);
	const index = todos.indexOf(existent);
	if (index === -1) {
		return res.status(404)
			.send("Can't remove todo because we can't find todo with id specified by you.")
	}

	todos.splice(index, 1);
	res.send(existent);
});

app.get("*", function(req, res) {
	file.serve(req, res);
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!')
});

class Todo {
	constructor(other) {
		this.initFrom(other);
	}

	initFrom(other) {
		this.id = other.id || uuid.v4();
		this.title = other.title;
		this.desc = other.desc;
	}

	static isValid(other) {
		return other &&
			"title" in other &&
			"desc" in other;
	}
}