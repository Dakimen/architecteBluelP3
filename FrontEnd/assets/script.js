/*
 <figure>
				<img src="assets/images/abajour-tahina.png" alt="Abajour Tahina">
				<figcaption>Abajour Tahina</figcaption>
			</figure> */

            /* */

            const gallery = document.querySelector(".gallery")
            const filterButtons = document.querySelector(".filter-buttons")

            const getWorks = () => {
                fetch ("http://localhost:5678/api/works")
                .then(res => res.json())
                .then(data => generateWorks(data)) 
            }
            const getFilters = () => {
                fetch ("http://localhost:5678/api/categories")
                .then(res => res.json())
                .then(data => generateFilters(data))
            }
            getWorks()
            getFilters()

            const generateWorks = (works) => {
                for (let i = 0; i < works.length; i++) {
                    const work = works[i]
                    const figure = document.createElement("figure")
                    const img = document.createElement("img")
                    img.src = work.imageUrl
                    img.alt = work.title
                    const figcaption = document.createElement("figcaption")
                    figcaption.innerHTML = work.title
                    figure.appendChild(img) 
                    figure.appendChild(figcaption)
                    gallery.appendChild(figure)
                }
            }

            const generateFilters = (categories) => {
                generateButtonTous()
                for (i = 0; i < categories.length; i++) {
                    const category = categories[i]
                    const buttonFilter = document.createElement("a")
                    buttonFilter.classList.add("buttonFilter")
                    buttonFilter.innerText = category.name
                    filterButtons.appendChild(buttonFilter)
                    buttonFilter.addEventListener("click", async() => {
                        const allWorks = await fetch ("http://localhost:5678/api/works").then(allWorks => allWorks.json())
                        const worksFiltered = allWorks.filter(function(Object) {
                            return Object.categoryId === category.id
                        })
                        gallery.innerHTML = ""
                        generateWorks(worksFiltered)
                        removeActiveFilter()
                        buttonFilter.classList.add("active")
                    })
                }
            }

            const generateButtonTous = () => {
                const buttonTous = document.createElement("a")
                buttonTous.classList.add("buttonFilter")
                buttonTous.innerText = "Tous"
                filterButtons.appendChild(buttonTous)
                buttonTous.classList.add("active")
                buttonTous.addEventListener("click", async() => {
                    gallery.innerHTML = ""
                    getWorks()
                    removeActiveFilter()
                    buttonTous.classList.add("active")
                })
            }

            const removeActiveFilter = () => {
                const allFilters = document.querySelectorAll(".buttonFilter")
                    for (i = 0; i < allFilters.length; i++) {
                        allFilters[i].classList.remove("active")
                    }
            }
            

            // Fonctions sign in //

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
                    const errorMessageVide = document.createElement("p")
                    errorMessageVide.innerText = "Ce champ est obligatoire"
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
                const failedLogin = document.createElement("p")
                failedLogin.innerText = "Email ou Mot de passe incorrect"
                const errorArea = document.getElementById("motDePasseDiv")
                errorArea.appendChild(failedLogin)
            }

            const loginSuccessful = () => {
                window.location.href = "index.html"
                console.log(window.localStorage.getItem("token"))
            }

