import * as bootstrap from "bootstrap";

const email = document.getElementById("email");
const password = document.getElementById("password");

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", e => {
  e.preventDefault();
  console.log("submitted");

  validateEmail();
  validatePassword();

  login();
});

const validateEmail = () => {
  const trimmedEmail = email.value.trim();
  if (!trimmedEmail || !trimmedEmail.includes("@")) {
    email.classList.add("is-invalid");
    return;
  }
  email.classList.remove("is-invalid");
  email.classList.add("is-valid");
};

const validatePassword = () => {
  if (
    !password.value ||
    password.value.length < 8 ||
    !password.value.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
  ) {
    password.classList.add("is-invalid");
    return;
  }
  password.classList.remove("is-invalid");
  password.classList.add("is-valid");
};

const login = async () => {
  const userInputs = { email: email.value, password: password.value };
  resetFormFields();
  let data;
  try {
    data = await fetch("https://reqres.in/api/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInputs),
    });

    if (!data.ok) {
      throw new Error(`HTTP error! status: ${data.status}`);
      return;
    }
    console.log(!data.ok);

    console.log(
      JSON.parse(localStorage.getItem("userInfo"))?.find(
        el => el.email == userInputs.email
      )
    );
    if (
      JSON.parse(localStorage.getItem("userInfo"))?.find(
        el => el.email == userInputs.email
      )
    ) {
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("currentActiveUserEmail", userInputs.email);
    } else {
      const msg =
        "Sorry seems we can't find your email ,Please register first! you will be automatically directed to the register page";
      alert(msg);
      window.location.replace("http://localhost:1234/index.html");
      return;
    }
    const content = await data.json();

    window.location.replace("http://localhost:1234/todo.html");
    console.log(content);
  } catch (e) {
    localStorage.setItem("isLoggedIn", false);
    console.log(
      "There has been a problem with your fetch operation: " + e.message
    );
  }
};

const resetFormFields = () => {
  email.value = "";
  password.value = "";
};

email.addEventListener("keyup", e => {
  validateEmail();
});

password.addEventListener("keyup", e => {
  validatePassword();
});
