const TODOS_URL = `https://jsonplace-univclone.herokuapp.com/todos`

function fetchTodos() {
    fetch (TODOS_URL)
    .then(function (result){
        return result.json()
    })
    .then(function (data){
        console.log(data)
        renderAllTodos(data)
    })
    .catch(function (error){
        console.error(error)
    })
}

function renderAllTodos(todos) {

    todos.filter(function (item){
        if (item.completed === true){
            return true
        } else {
            return false
        }
    }).forEach(function (todo){
        $(".todo-list.complete").append(renderTodo(todo))
    })


    todos.filter(function (item){
        if (item.completed === false){
            return true
        } else {
            return false
        }
    }).forEach(function (todo){
        $('.todo-list.incomplete').append(renderTodo(todo))
    })


    // todos.forEach(function (todos){
    //     if (todo.completed === true){
    //         $(".todo-list.complete").append(renderTodo(todo))
    //     } else {
    //         $('.todo-list.incomplete').append(renderTodo(todo))
    //     }
    // })
    
}

function renderTodo(todo) {
    if (todo.completed === true){
        return $("<div class='todo'></div>").html(`<h3>${todo.title}</h3>
            <footer>
              <button>UNDO</button>
            </footer>`)
    } else {
        return $("<div class='todo'></div>").html(`<h3>${todo.title}</h3>
            <footer>
              <button>DONE</button>
            </footer>`)
    }
}

function bootstrap() {
    fetchTodos()
}

bootstrap();