import * as bootstrap from "bootstrap";

console.log("here");

const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const repeatPassword = document.getElementById("repeat-password");
const agreeCheckbox = document.getElementById("agree-check");

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", e => {
  e.preventDefault();
  console.log("submitted");

  validateName();
  validateEmail();
  validatePassword();
  validateConfirmPassword();
  register();
});

const validateName = () => {
  const trimmedName = name.value.trim();
  if (!trimmedName || trimmedName.length < 2) {
    name.classList.add("is-invalid");
    return;
  }
  name.classList.remove("is-invalid");
  name.classList.add("is-valid");
};

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

const validateConfirmPassword = () => {
  if (!repeatPassword.value || password.value != repeatPassword.value) {
    repeatPassword.classList.add("is-invalid");
    return;
  }
  repeatPassword.classList.remove("is-invalid");
  repeatPassword.classList.add("is-valid");
};

name.addEventListener("keyup", e => {
  validateName();
});

email.addEventListener("keyup", e => {
  validateEmail();
});

password.addEventListener("keyup", e => {
  validatePassword();
});

repeatPassword.addEventListener("keyup", e => {
  validateConfirmPassword();
});

const register = async () => {
  const userInputs = { email: email.value, password: password.value };
  resetFormFields();
  let data;
  try {
    data = await fetch("https://reqres.in/api/register", {
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

    const content = await data.json();
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("currentActiveUserEmail", userInputs.email);
    if (JSON.parse(localStorage.getItem("userInfo"))) {
      localStorage.setItem(
        "userInfo",
        JSON.stringify(
          [
            ...JSON.parse(localStorage.getItem("userInfo")),
            {
              email: userInputs.email,
              userId: content.id,
            },
          ].filter(
            (value, index, self) =>
              index === self.findIndex(t => t.email === value.email)
          )
        )
      );
    } else {
      localStorage.setItem(
        "userInfo",
        JSON.stringify([
          {
            email: userInputs.email,
            userId: content.id,
          },
        ])
      );
    }

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
  name.value = "";
  email.value = "";
  password.value = "";
  repeatPassword.value = "";
};
