//seleção de elementos
const todoForm = document.querySelector("#formulario-todo")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#lista-todo")
const editForm = document.querySelector("#formulario-edicao")
const editInput = document.querySelector("#edit-input")
const cancelEditBtn = document.querySelector("#botao-cancelar-edicao")
const searchInput = document.querySelector("#buscar-input")
const eraseBtn = document.querySelector("#botao-apagar")
const filterBtn = document.querySelector("#select-filtrar")

let valorAntigoInput;

//funções
const alternateForms = ()=>{
    editForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
    todoForm.classList.toggle("hide")
}

const saveTodo = (text, done=0, save=1) =>{
    const todo = document.createElement("div")
    todo.classList.add("todo")

    const todoDescription = document.createElement("h3")
    todoDescription.innerHTML = text

    
    todo.appendChild(todoDescription)

    const doneBtn = document.createElement("button")
    doneBtn.classList.add('finish-todo')
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    todo.appendChild(doneBtn)


    const editBtn = document.createElement("button")
    editBtn.classList.add('edit-todo')
    editBtn.innerHTML = '<i class="fa-sharp fa-solid fa-pen"></i>'
    todo.appendChild(editBtn)


    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add('remove-todo')
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    todo.appendChild(deleteBtn)

    if(done){
        todo.classList.add("done")
    }

    if(save){
        saveTodoLocalStorage({text, done})
    }

    if (done){
        todoList.appendChild(todo)
    }
    else{
        const primeiroDone = Array.from(todoList.children).find(el => el.classList.contains("done"));
        if(primeiroDone){
            todoList.insertBefore(todo,primeiroDone);
        }
        else{
            todoList.appendChild(todo);
        }
    }

    todoInput.value = "";
    todoInput.focus();

}

const updateTodo = (texto)=>{
    const allTodos = document.querySelectorAll(".todo")

    allTodos.forEach((todo) =>{
        let todoTitle = todo.querySelector("h3")

        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText = texto
            atualizarTextoNaLocalStorage(valorAntigoInput, texto);
        }
    })
}


const pegarToDosPesquisados = (search) =>{
    const allTodos = document.querySelectorAll(".todo")

    allTodos.forEach((todo) =>{
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase()

        const pesquisaPadronizada = search.toLowerCase()

        todo.style.display = "flex"

        if(!todoTitle.includes(pesquisaPadronizada)){
            todo.style.display = "none";
        }
    })

}

const filterToDos = (chosenOption) =>{
    const todos = document.querySelectorAll(".todo")

    switch(chosenOption){
        case "all":
            todos.forEach((todo) => todo.style.display = "flex")
            break;
        case "done":
            todos.forEach((todo) => todo.classList.contains("done") ? (todo.style.display = "flex") : (todo.style.display = "none")
    )
    break;
        case "todo":
            todos.forEach((todo) => !todo.classList.contains("done") ? (todo.style.display = "flex"): (todo.style.display = "none")
        )
        break;

        default:
            break;
    }
}

//eventos
todoForm.addEventListener(('submit'), (e)=>{
    e.preventDefault();
    
    const inputValue = todoInput.value;

    if(inputValue){
        saveTodo(inputValue)
    }
})


document.addEventListener(("click"), (e)=>{
    const elementoClicado = e.target;
    const elementoPai = elementoClicado.closest("div");
    let todoTitle;

    
    if(elementoPai && elementoPai.querySelector("h3")){
        todoTitle = elementoPai.querySelector("h3").innerText;
    }

    if(elementoClicado.classList.contains("finish-todo")){
        elementoPai.classList.toggle("done");
        atualizarStatusNaLocalStorage(todoTitle);
    }
    if(elementoClicado.classList.contains("remove-todo")){
        elementoPai.remove();
        removeTodoLocalStorage(todoTitle)
    }

    if(elementoClicado.classList.contains("edit-todo")){
        alternateForms();
        editInput.value = todoTitle;
        valorAntigoInput = todoTitle;
    }


})

cancelEditBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    alternateForms();
})

editForm.addEventListener("submit", (e)=>{
    e.preventDefault()

    const editInputValue = editInput.value

    if(editInputValue){
        updateTodo(editInputValue)
    }
    alternateForms()
})


searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value

    pegarToDosPesquisados(search);
})

eraseBtn.addEventListener("click", (e) =>{
    e.preventDefault()
    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"));
})

filterBtn.addEventListener("change", (e)=>{
    const chosenOption = e.target.value;
    filterToDos(chosenOption);
})

//local storage
const pegarTodosLocalStorage = () => {
    try{
    const listaTarefas = JSON.parse(localStorage.getItem("listaDeTarefas"));
    return Array.isArray(listaTarefas) ? listaTarefas : [];
    } catch (e){
        return [];
    }
}

const saveTodoLocalStorage = (todo) =>{
    const todos = pegarTodosLocalStorage();

    todos.push(todo);

    localStorage.setItem("listaDeTarefas", JSON.stringify(todos))
}

const loadTodos = () =>{
    const todos = pegarTodosLocalStorage();

    todos.forEach((todo)=>{
        saveTodo(todo.text, todo.done, 0);
    })
}

const removeTodoLocalStorage = (todoText) =>{
    const todos = pegarTodosLocalStorage();

    const filteredTodos = todos.filter((todo) => todo.text !== todoText)

    localStorage.setItem("listaDeTarefas", JSON.stringify(filteredTodos))

}

const atualizarStatusNaLocalStorage = (todoText) =>{
    const todos = pegarTodosLocalStorage();

    todos.map((todo) => todo.text === todoText ? todo.done = !todo.done : null);

    localStorage.setItem("listaDeTarefas", JSON.stringify(todos));
}

const atualizarTextoNaLocalStorage = (tituloAntigo, novoTitulo) =>{
    const todos = pegarTodosLocalStorage();

    todos.map((todo) => 
        todo.text === tituloAntigo ? (todo.text = novoTitulo) : null
);

    localStorage.setItem("listaDeTarefas", JSON.stringify(todos));
}

loadTodos()






