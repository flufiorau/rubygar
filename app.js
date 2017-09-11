/**
 * Created by Zelenskiy.s on 29.08.2017.
 */


var app = new Vue({
    el: "#application",
    data: {
        showingTaskModal: false,
        showingEditTaskModal: false,
        showingDeleteTaskModal: false,
        showingTodoModal: false,
        showingEditTodoModal: false,
        showingDeleteTodoModal: false,
        showingSignUpModal: false,
        showingSignInModal: false,
        showingSignOutModal: false,
        errorMessage: "",
        successMessage: "",
        addonsON: false,
        autorizedUser: false,
        newUser: [],
        user: [],
        todos: [],
        tasks: [],
        newTask: {texttask: "", finaldate: "", todoid: ""},
        newTodo: {todoname: ""},
        clickedTask: {},
        clickedTodo: {}
    },
    mounted: function () {
        this.areUserAutorized();
        // this.getAllTodos();
        // this.getAllTasks();
    },
    methods: {
        areUserAutorized: function () {
            axios.get("http://rg.usejs.top/api.php?action=idautorizeduser")
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.autorizedUser = true;
                        app.user.login = response.data.login;
                        app.getAllTodos();
                    }
                });
        },

        signUpNewUser: function () {
            var formData = app.toFormData(app.newUser);

            axios.post("http://rg.usejs.top/api.php?action=signupuser", formData)
                .then(function (response) {
                    app.newUser = {email: "", password: "", login: ""};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.autorizedUser = true;
                        app.getAllTodos();
                    }
                });
        },

        signInUser: function () {
            var formData = app.toFormData(app.user);

            axios.post("http://rg.usejs.top/api.php?action=signinuser", formData)
                .then(function (response) {
                    app.newUser = {login: "", password: ""};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.autorizedUser = true;
                        app.getAllTodos();
                    }
                });
        },

        signOutUser: function () {
            var formData = app.toFormData(app.user);

            axios.post("http://rg.usejs.top/api.php?action=signoutuser", formData)
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.autorizedUser = false;
                        app.getAllTodos();
                    }
                });
        },


        getAllTodos: function () {
            axios.get("http://rg.usejs.top/api.php?action=readtodos")
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.todos = response.data.todos;
                    }
                    app.getAllTasks();
                });

        }

        ,

        getAllTasks: function () {
            axios.get("http://rg.usejs.top/api.php?action=readtasks")
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.tasks = response.data.tasks;
                    }
                });
        },

        saveTodo: function () {
            var formData = app.toFormData(app.newTodo);

            axios.post("http://rg.usejs.top/api.php?action=createtodo", formData)
                .then(function (response) {
                    app.newTask = {todoname: ""};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.getAllTodos();
                    }
                });
        }
        ,

        saveTask: function () {
            var formData = app.toFormData(app.newTask);

            axios.post("http://rg.usejs.top/api.php?action=createtask", formData)
                .then(function (response) {
                    app.newTask = {texttask: "", finaldate: "", todoid: ""};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.getAllTasks();
                    }
                });
        }
        ,

        updateTodo: function () {

            var formData = app.toFormData(app.clickedTodo);

            axios.post("http://rg.usejs.top/api.php?action=updatetodo", formData)
                .then(function (response) {

                    app.clickedTodo = {todoname: ""};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.getAllTodos();
                    }
                });
        }
        ,

        updateTask: function () {

            var formData = app.toFormData(app.clickedTask);

            axios.post("http://rg.usejs.top/api.php?action=updatetask", formData)
                .then(function (response) {

                    app.clickedTask = {texttask: "", finaldate: ""};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.getAllTasks();
                    }
                });
        }
        ,

        completedTask: function () {
            var formData = app.toFormData(app.clickedTask);

            axios.post("http://rg.usejs.top/api.php?action=completedtask", formData)
                .then(function (response) {

                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.getAllTasks();
                    }
                });
        }
        ,

        deleteTodo: function () {

            var formData = app.toFormData(app.clickedTodo);

            axios.post("http://rg.usejs.top/api.php?action=deletetodo", formData)
                .then(function (response) {

                    app.clickedTodo = {};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.getAllTodos();
                    }
                });
        }
        ,

        deleteTask: function () {

            var formData = app.toFormData(app.clickedTask);

            axios.post("http://rg.usejs.top/api.php?action=deletetask", formData)
                .then(function (response) {

                    app.clickedTask = {};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.getAllTasks();
                    }
                });
        }
        ,

        selectTodo: function (todo) {
            app.clickedTodo = todo;
        }
        ,

        selectTask: function (task) {
            app.clickedTask = task;
        }
        ,

        toFormData: function (obj) {
            var form_data = new FormData();
            for (var key in obj) {
                form_data.append(key, obj[key]);
            }
            return form_data;
        }
        ,
        clearMessage: function () {
            app.errorMessage = "";
            app.successMessage = "";
        }

    }
});