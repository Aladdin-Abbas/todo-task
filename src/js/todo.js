import * as bootstrap from "bootstrap";

console.log("todo");

let input = document.getElementById("inputText");
let list = document.getElementById("list");
const addBtn = document.getElementById("addBtn");
const logout = document.getElementById("logout");

let minimalValue = 3;
let listNum = 0;

/* */
const isLoggedIn = localStorage.getItem("isLoggedIn");
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const currentActiveUserEmail = localStorage.getItem("currentActiveUserEmail");
console.log(isLoggedIn, userInfo);

if (isLoggedIn && userInfo.length > 0) {
  console.log("heeeey");
  //   getLoggedUserTodos(userInfo[0].userId).then(result => console.log(result));
  const activeUser = userInfo.find(el => el.email === currentActiveUserEmail);
  if (
    JSON.parse(localStorage.getItem("usersWithModifiedTodos")) &&
    JSON.parse(localStorage.getItem("usersWithModifiedTodos")).find(
      el => el.email === currentActiveUserEmail
    )
  ) {
    const storedTodos = JSON.parse(localStorage.getItem("usersIdsTodos"));
    renderUserTodos(storedTodos[activeUser.userId]);
  } else {
    getLoggedUserTodos(activeUser.userId);
  }
}
0;
async function getLoggedUserTodos(userId) {
  try {
    const data = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}/todos`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status}`);
      return;
    }
    const todos = await data.json();

    localStorage.setItem("usersIdsTodos", JSON.stringify({ [userId]: todos }));
    const storedTodos = JSON.parse(localStorage.getItem("usersIdsTodos"));
    console.log(storedTodos);
    renderUserTodos(storedTodos[userId]);
  } catch (e) {
    console.log(
      "There has been a problem with your fetch operation: " + e.message
    );
  }
}

function renderUserTodos(todos) {
  list.innerHTML = todos.map(
    todo => ` <li class=" my-3 py-3 shadow list-group-item " id="list${
      todo.id
    }">
    <div class="row">
    <div class="col-1">
    <input class="" type="checkbox" id="check${todo.id}"   ${
      todo.completed ? "checked" : null
    } >
    </div>
    <div class="col-6">
        <span class=" h4 ${
          todo.completed ? "text-decoration-line-through" : null
        }" id="text${todo.id}"> ${todo.title} </span>
    </div>
    <div class="col-4">
         <button class=" btn btn-dark deleteBtn" >Delete</button>
         <button class=" btn btn-dark editBtn" >Edit</button>
    </div>                  
     </div>    
    </li> `
  );
}

async function createNewTodo(recentAddedTodo) {
  try {
    const data = await fetch(
      `https://jsonplaceholder.typicode.com/users/${recentAddedTodo.userId}/todos`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recentAddedTodo),
      }
    );
    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status}`);
      return;
    }
    const todos = await data.json();
  } catch (e) {
    console.log(
      "There has been a problem with your fetch operation: " + e.message
    );
  }
}

addBtn.addEventListener("click", e => {
  let inputText = filterList(input.value);

  const storedTodos = JSON.parse(localStorage.getItem("usersIdsTodos"));

  const activeUser = userInfo.find(el => el.email === currentActiveUserEmail);
  console.log(activeUser);

  const newTodoId =
    storedTodos[activeUser.userId][storedTodos[activeUser.userId].length - 1]
      .id + 20;

  const recentAddedTodo = {
    completed: false,
    id: newTodoId,
    title: inputText,
    userId: activeUser.userId,
  };
  const newTodos = [recentAddedTodo, ...storedTodos[activeUser.userId]];

  if (inputText) {
    createNewTodo(recentAddedTodo);
    localStorage.setItem(
      "usersIdsTodos",
      JSON.stringify({ [activeUser.userId]: newTodos })
    );

    if (JSON.parse(localStorage.getItem("usersWithModifiedTodos"))) {
      localStorage.setItem(
        "usersWithModifiedTodos",
        JSON.stringify(
          [
            ...JSON.parse(localStorage.getItem("usersWithModifiedTodos")),
            activeUser,
          ].filter(
            (value, index, self) =>
              index === self.findIndex(t => t.email === value.email)
          )
        )
      );
    } else {
      localStorage.setItem(
        "usersWithModifiedTodos",
        JSON.stringify(
          [activeUser].filter(
            (value, index, self) =>
              index === self.findIndex(t => t.email === value.email)
          )
        )
      );
    }

    renderUserTodos(newTodos);

    input.value = " ";
  }
});

async function deleteTodo(todoId) {
  try {
    console.log("trying");
    const data = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId}`,
      {
        method: "Delete",
      }
    );
    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status}`);
      return;
    }
    const todos = await data.json();
  } catch (e) {
    console.log(
      "There has been a problem with your fetch operation: " + e.message
    );
  }
}

list.addEventListener("click", e => {
  if (e.target.matches(".deleteBtn")) {
    e.preventDefault();

    let deleteComfirm = confirm(
      `Are you sure to delete ${
        e.target.parentElement.parentElement.querySelector("span").innerHTML
      }`
    );

    if (deleteComfirm) {
      const storedTodos = JSON.parse(localStorage.getItem("usersIdsTodos"));

      const activeUser = userInfo.find(
        el => el.email === currentActiveUserEmail
      );

      const newTodos = storedTodos[activeUser.userId].filter(
        el =>
          el.title !=
          e.target.parentElement.parentElement.querySelector("span").innerText
      );

      console.log(newTodos);

      deleteTodo(activeUser.userId);
      localStorage.setItem(
        "usersIdsTodos",
        JSON.stringify({ [activeUser.userId]: newTodos })
      );

      if (JSON.parse(localStorage.getItem("usersWithModifiedTodos"))) {
        localStorage.setItem(
          "usersWithModifiedTodos",
          JSON.stringify(
            [
              ...JSON.parse(localStorage.getItem("usersWithModifiedTodos")),
              activeUser,
            ].filter(
              (value, index, self) =>
                index === self.findIndex(t => t.email === value.email)
            )
          )
        );
      } else {
        localStorage.setItem(
          "usersWithModifiedTodos",
          JSON.stringify(
            [activeUser].filter(
              (value, index, self) =>
                index === self.findIndex(t => t.email === value.email)
            )
          )
        );
      }

      renderUserTodos(newTodos);
    }
    return;
  }
});

async function updateTodo(todoId, updatedData) {
  try {
    const data = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );
    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status}`);
      return;
    }
    const todos = await data.json();
  } catch (e) {
    console.log(
      "There has been a problem with your fetch operation: " + e.message
    );
  }
}

list.addEventListener("click", e => {
  if (e.target.matches('[type="checkbox"]')) {
    console.log(e.target.id);
    const checkboxId = e.target.id;
    let spanId = checkboxId.split("k")[1];
    spanId = `text${spanId}`;
    const span = document.getElementById(spanId);
    console.log(span);

    const storedTodos = JSON.parse(localStorage.getItem("usersIdsTodos"));

    const activeUser = userInfo.find(el => el.email === currentActiveUserEmail);

    const editedTodoIndex = storedTodos[activeUser.userId].findIndex(
      el => el.title == span.innerText
    );
    let newTodos = [...storedTodos[activeUser.userId]];

    newTodos[editedTodoIndex].completed =
      !storedTodos[activeUser.userId][editedTodoIndex].completed;

    console.log(newTodos[editedTodoIndex].id);

    if (newTodos[editedTodoIndex].id <= 200) {
      updateTodo(newTodos[editedTodoIndex].id, {
        completed: newTodos[editedTodoIndex].completed,
      });
    }

    localStorage.setItem(
      "usersIdsTodos",
      JSON.stringify({ [activeUser.userId]: newTodos })
    );

    if (JSON.parse(localStorage.getItem("usersWithModifiedTodos"))) {
      localStorage.setItem(
        "usersWithModifiedTodos",
        JSON.stringify(
          [
            ...JSON.parse(localStorage.getItem("usersWithModifiedTodos")),
            activeUser,
          ].filter(
            (value, index, self) =>
              index === self.findIndex(t => t.email === value.email)
          )
        )
      );
    } else {
      localStorage.setItem(
        "usersWithModifiedTodos",
        JSON.stringify([activeUser])
      );
    }

    renderUserTodos(newTodos);
  }
});

list.addEventListener("click", e => {
  if (e.target.matches(".editBtn")) {
    e.preventDefault();

    let currentText =
      e.target.parentElement.parentElement.querySelector("span");
    let newText = prompt("Wanna Change list?", currentText.innerHTML);
    if (filterList(newText)) {
      const storedTodos = JSON.parse(localStorage.getItem("usersIdsTodos"));

      const activeUser = userInfo.find(
        el => el.email === currentActiveUserEmail
      );

      const editedTodoIndex = storedTodos[activeUser.userId].findIndex(
        el => el.title == currentText.innerText
      );
      let newTodos = [...storedTodos[activeUser.userId]];

      newTodos[editedTodoIndex].title = newText;

      console.log(newTodos[editedTodoIndex].title);

      if (newTodos[editedTodoIndex].id <= 200) {
        updateTodo(newTodos[editedTodoIndex].id, {
          title: newTodos[editedTodoIndex].title,
        });
      }

      localStorage.setItem(
        "usersIdsTodos",
        JSON.stringify({ [activeUser.userId]: newTodos })
      );

      if (JSON.parse(localStorage.getItem("usersWithModifiedTodos"))) {
        localStorage.setItem(
          "usersWithModifiedTodos",
          JSON.stringify(
            [
              ...JSON.parse(localStorage.getItem("usersWithModifiedTodos")),
              activeUser,
            ].filter(
              (value, index, self) =>
                index === self.findIndex(t => t.email === value.email)
            )
          )
        );
      } else {
        localStorage.setItem(
          "usersWithModifiedTodos",
          JSON.stringify([activeUser])
        );
      }

      renderUserTodos(newTodos);
    }
  }
});

let filterList = x => {
  if (x) {
    if (x.length >= minimalValue) {
      return x;
    } else {
      alert("Please enter more than 3 words");
    }
  } else {
    return false;
  }
};

logout.addEventListener("click", e => {
  e.preventDefault();
  localStorage.setItem("isLoggedIn", "false");
  localStorage.setItem("currentActiveUserEmail", "");
  window.location.replace("http://localhost:1234/index.html");
});
