/**
 * Created by Zelenskiy.s on 29.08.2017.
 */

var temp = new String();
var obj = {};
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
        textIsValidated: false,
        userValidated: false,
        titleSignUp: 'error data',
        dataSelected: false,
        addonsON: false,
        autorizedUser: false,
        newUser: {login: "", password: ""},
        user: [],
        todos: [],
        tasks: [],
        thisTask: {texttask: "", finaldate: "", todoid: ""},
        thisTodo: {todoname: ""},
        clickedTask: {},
        editingTask: {},
        clickedTodo: {},
        dateIsChanged: false,
        isActive: true
    },

    mounted: function () {
        this.areUserAutorized();
    },

    methods: {
        clearMessages: function () {
            setTimeout(function () {
                app.errorMessage = "";
                app.successMessage = "";
                app.textIsValidated = false;
            }, 900);
        },

        isDeadline: function () {
            if (app.thisTask.finaldate != "") {
                app.dataSelected = true;
            }
        },

        validateTextTodo: function (action) {
            app.textIsValidated = false;

            temp = app.thisTodo.todoname;
            if (temp.indexOf(" ") == 0) {
                return app.thisTodo.todoname = "";
            }

            if (temp.length >= 3) {
                app.textIsValidated = true;
                if (action == 'save') {
                    app.showingTodoModal = false;
                    app.saveTodo();
                } else if (action == 'update') {
                    app.showingEditTodoModal = false;
                    app.updateTodo();
                }
            }
            temp = "";
        },

        validateTextTask: function (action) {
            app.textIsValidated = false;

            if (action == 'new') {
                temp = app.thisTask.texttask;

                if (temp.indexOf(" ") == 0) {
                    app.textIsValidated = false;
                    return app.thisTask.texttask = "";
                }


            } else if (action == 'edit') {
                temp = app.editingTask.texttask;

                if (temp.indexOf(" ") == 0) {
                    app.textIsValidated = false;
                    return app.editingTask.texttask = "";
                }
            }

            if (temp.length >= 3) {
                app.textIsValidated = true;
                if (action == 'update') {
                    app.showingEditTaskModal = false;
                    app.updateTask();
                }
            }
            temp = "";
        },

        validateNewUser: function (action) {
            temp = app.newUser.login;
            if (app.newUser.login != "") {
                //cut spaces from login
                temp = temp.replace(/\s/g, '');
                app.newUser.login = temp;

                if (temp.length >= 3) {
                    app.errorMessage = '';
                    temp = app.newUser.password;
                    if (temp != "") {
                        if (temp.length >= 8) {
                            app.errorMessage = '';
                            app.userValidated = true;
                            if (action == 'save') {
                                app.showingSignUpModal = false;
                                app.signUpNewUser();
                            }
                        } else {
                            app.titleSignUp = 'Password must be 8 or longer symbols';
                            app.errorMessage = 'Password must be 8 or longer symbols';
                        }
                    }

                } else {
                    app.titleSignUp = 'login must be 3 or longer symbols';
                    app.errorMessage = 'login must be 3 or longer symbols';
                    app.userValidated = false;
                    temp = "";
                }
                return app.newUser.login;
            }
        },

        areUserAutorized: function () {

            axios.get("https://rg.usejs.top/api.php?action=idautorizeduser")
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                        app.clearMessages();
                    } else {
                        app.autorizedUser = true;
                        app.user.login = response.data.login;
                        app.getAllTodos();
                    }

                });

        },

        signUpNewUser: function () {
            var formData = app.toFormData(app.newUser);

            axios.post("https://rg.usejs.top/api.php?action=signupuser", formData)
                .then(function (response) {
                    app.newUser = {login: "", password: ""};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.autorizedUser = true;
                        app.areUserAutorized();
                    }

                });
        }
        ,

        signInUser: function () {
            var formData = app.toFormData(app.user);

            axios.post("https://rg.usejs.top/api.php?action=signinuser", formData)
                .then(function (response) {
                    app.newUser = {login: "", password: ""};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        if (response.data.autorized) {
                            app.successMessage = response.data.message;
                            app.autorizedUser = true;
                            app.getAllTodos();
                        } else {
                            app.autorizedUser = false;
                            app.errorMessage = response.data.message;
                        }

                    }

                });
        }
        ,

        signOutUser: function () {
            var formData = app.toFormData(app.user);

            axios.post("https://rg.usejs.top/api.php?action=signoutuser", formData)
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.autorizedUser = false;
                        app.getAllTodos();
                    }
                });
        }
        ,

        getAllTodos: function () {
            axios.get("https://rg.usejs.top/api.php?action=readtodos")
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.clearMessages();
                        app.todos = response.data.todos;
                        app.getAllTasks();
                    }
                });
        }
        ,

        getAllTasks: function () {
            axios.get("https://rg.usejs.top/api.php?action=readtasks")
                .then(function (response) {
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        var arr = [];
                        obj = response.data.tasks;

                        for (var index in obj) {
                            arr.push(obj[index])
                        }
                        function compare(objA, objB) {
                            console.log(objA);
                            return objA.iscomplete - objB.iscomplete;
                        }
                        arr.sort(compare);
                        app.tasks = Object.assign({}, arr);
                        app.clearMessages();
                    }
                });
            // setOrderId();
        }
        ,

        setOrderId: function(){

        },

        saveTodo: function () {
            var formData = app.toFormData(app.thisTodo);

            axios.post("https://rg.usejs.top/api.php?action=createtodo", formData)
                .then(function (response) {
                    app.thisTask = {todoname: ""};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.getAllTodos();
                    }
                });
        }
        ,

        saveTask: function () {
            var formData = app.toFormData(app.thisTask);

            axios.post("https://rg.usejs.top/api.php?action=createtask", formData)
                .then(function (response) {
                    app.thisTask = {texttask: "", finaldate: "", todoid: ""};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.dataSelected = false;
                        app.getAllTasks();
                    }
                });
        }
        ,

        updateTodo: function () {

            var formData = app.toFormData(app.thisTodo);

            axios.post("https://rg.usejs.top/api.php?action=updatetodo", formData)
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

            var formData = app.toFormData(app.editingTask);
            axios.post("https://rg.usejs.top/api.php?action=updatetask", formData)
                .then(function (response) {

                    app.clickedTask = {texttask: "", finaldate: ""};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.getAllTasks();
                    }
                });
        },

        completedTask: function () {
            var formData = app.toFormData(app.clickedTask);

            axios.post("https://rg.usejs.top/api.php?action=completedtask", formData)
                .then(function (response) {

                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.getAllTasks();
                    }
                });
        },

        deleteTodo: function () {

            var formData = app.toFormData(app.clickedTodo);

            axios.post("https://rg.usejs.top/api.php?action=deletetodo", formData)
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

            axios.post("https://rg.usejs.top/api.php?action=deletetask", formData)
                .then(function (response) {

                    app.clickedTask = {};
                    if (response.data.error) {
                        app.errorMessage = response.data.message;
                    } else {
                        app.successMessage = response.data.message;
                        app.getAllTasks();
                    }
                });
        },

        selectTodo: function (todo) {
            app.clickedTodo = todo;
            app.thisTodo = Object.assign({}, todo);
        },

        selectTask: function (task) {
            app.clickedTask = task;
            app.editingTask = Object.assign({}, task);
        },

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

