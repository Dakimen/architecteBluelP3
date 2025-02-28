const token = window.localStorage.getItem("token")
if (token) {
    window.location.href = "index.html"
}

const buttonSeConnecter = document.querySelector("#buttonSeConnecterId")
buttonSeConnecter.addEventListener("click", async() => {
    event.preventDefault()

    const champEmail = document.getElementById("email")
    const champMotdePasse = document.getElementById("champMotDePasse")

    if (verifierChamps(champEmail, champMotdePasse)) {
        const loginRequest = {"email": champEmail.value, "password": champMotdePasse.value}
        const loginRequestBody = JSON.stringify(loginRequest)
        const response = await fetch ("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            body: loginRequestBody
        })
        const returnValue = await response.json()
        if (returnValue.token === undefined) {
            loginFail()
        } else {
            const token = returnValue.token
            window.localStorage.setItem("token", token)
            loginSuccessful()
        }
     }
})

const verifierChamps = (champEmail, champMotDePasse) => { 
    if (champEmail.value === "" || champMotDePasse.value === "") {
        const oldErrorMessage = document.getElementById("errorMessage")
        if (oldErrorMessage !== null) {
            oldErrorMessage.remove()
        }
        const errorMessageVide = document.createElement("p")
        errorMessageVide.innerText = "Ce champ est obligatoire"
        errorMessageVide.id = "errorMessage"
        if (champEmail.value === "") {
            const errorArea = document.getElementById("emailDiv")
            errorArea.appendChild(errorMessageVide)
            return false
        } else {
            const errorArea = document.getElementById("motDePasseDiv")
            errorArea.appendChild(errorMessageVide)
            return false
        }
    } else {return true}
}

const loginFail = () => {
    const oldErrorMessage = document.getElementById("errorMessage")
        if (oldErrorMessage !== null) {
            oldErrorMessage.remove()
        }
    const failedLogin = document.createElement("p")
    failedLogin.innerText = "Email ou Mot de passe incorrect"
    failedLogin.id = "errorMessage"
    const errorArea = document.getElementById("idincorrect")
    errorArea.appendChild(failedLogin)
}

const loginSuccessful = () => {
    window.location.href = "index.html"
}

