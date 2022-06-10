# todo-task

prerequisite
installing NodeJS v16.9.0,Npm v8.5.3

getting started
Use npm install to get started with downloading the required packages
npm build will build the project using parcel
npm start would run a dev server

additional informations about the task
keep in mind the available routes are
/index.html
which includes the signup form , form validation made in Vanilla JS
/todo.html
which include the todo list where you can fetch your tasks using the email you signup with keep in mind that the email should be one of the valid emails which is
provided by the following end point users: https://reqres.in/api/users and the tasks will be fetched for this specific email userId from the todo endpoint
todos: https://jsonplaceholder.typicode.com/todos , the following operation is possible create, update and delete keep in mind that the endpoint provide a fake
response when it come to posting a new todo task or trying to update or delete and that it doesn't get added to their database so i have used local storage to make
that work
and the last route is /login.html in which you would use the email you registered with and the password to login
