var form = document.forms.todoForm;
var table = document.querySelector(".main__tab");

readInfo();

form.addEventListener("submit", function (e) {
    e.preventDefault();

    var newElement = {
        id: this.forId.value,
        title: this.input.value,
        desc: this.area.value
    };

    this.forId.value = "";

    var xhr = new XMLHttpRequest();
    xhr.open(newElement.id ? "put" : "post", "/api/todo");
    xhr.responseType = "json";
    xhr.setRequestHeader("Content-Type", "application/json");
    var data = JSON.stringify(newElement);
    xhr.send(data);
    
    xhr.addEventListener("readystatechange", function () {
        if (this.readyState !== this.DONE) {
            return;
        }

        var todo = this.response;
        var rowPrime = document.getElementById(todo.id);
        addRow(todo, table, rowPrime);

        if (rowPrime) {
            rowPrime.parentElement.removeChild(rowPrime);
        } else {}

        clear(form);
    });
});

table.addEventListener("click", function (e) {
    e.preventDefault();

    if (e.target.tagName === "BUTTON") {
        var btn = e.target;

        if (btn.classList.contains("main__btn--remove")) {
            remove(btn.getAttribute("data-target"));
        } else if (btn.classList.contains("main__btn--edit")) {
            edit(btn.getAttribute("data-target"), form);
        }
    }
});

function readInfo () {
    var xhr = new XMLHttpRequest();
    xhr.open("get", "/api/todo");
    xhr.responseType = "json";
    xhr.send();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState !== this.DONE) {
            return;
        }

        for (var i = 0; i < this.response.length; i++) {
            addRow(this.response[i], table);
        }
    });
}

function addRow (element, table, place) {
    var row = document.createElement("tr");
    row.setAttribute("id", element.id);
    table.insertBefore(row, place);

    var title = createCell();
    title.textContent = element.title;

    var desc = createCell();
    desc.textContent = element.desc;

    var remove = createBtn(element);
    remove.textContent = "Remove";
    remove.setAttribute("class", "main__btn--remove");

    var edit = createBtn(element);
    edit.textContent = "Edit";
    edit.setAttribute("class", "main__btn--edit");

    var actions = createCell();
    actions.appendChild(remove);
    actions.appendChild(edit);

    row.appendChild(title);
    row.appendChild(desc);
    row.appendChild(actions);
}

function remove (id) {
    var xhr = new XMLHttpRequest();
    xhr.open("delete", "/api/todo/" + id);
    xhr.responseType = "json";
    xhr.send();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState !== this.DONE) {
            return;
        }

        var removeRow = document.getElementById(this.response.id);
        removeRow.parentElement.removeChild(removeRow);
    });
}

function edit (id, form) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", "/api/todo/" + id);
    xhr.responseType = "json";
    xhr.send();

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState !== this.DONE) {
            return;
        }

        var todo = this.response;
        form.input.value = todo.title;
        form.area.value = todo.desc;
        form.forId.value = todo.id;
        form.button.textContent = "Update";
    });
}

function clear (form) {
    form.input.value = "";
    form.area.value = "";
    form.forId.value = "";
    form.button.textContent = "Submit";
}

function createBtn (element) {
        var button = document.createElement("button");
        button.type = button;
        button.setAttribute("data-target", element.id);
}

function createCell () {
    var cell = document.createElement("td");
    cell.setAttribute("class", "main__td");
}