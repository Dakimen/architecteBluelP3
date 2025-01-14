


            const gallery = document.querySelector(".gallery")
            const filterButtons = document.querySelector(".filter-buttons")
            let works = []
            let categoriesList = []

            const getWorks = async() => {
                await fetch ("http://localhost:5678/api/works")
                .then(async(res) => {
                    works = await res.json()
                    return works
                })
                .then(data => generateWorks(data))
            }
            const getFilters = () => {
                fetch ("http://localhost:5678/api/categories")
                .then(async(res) => {
                    categoriesList = await res.json()
                    return categoriesList
                })
                .then(data => generateFilters(data))
            }
            getWorks()
            getFilters()

            const generateWorks = (worksAfficher) => {
                for (let i = 0; i < worksAfficher.length; i++) {
                    const work = worksAfficher[i]
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
                const filteredButton = [...categories,{name:"Tous", id:0}]
                filteredButton.sort((a,b) => a.id - b.id);
                for (i = 0; i < filteredButton.length; i++) {
                    const category = filteredButton[i]
                    const buttonFilter = document.createElement("a")
                    buttonFilter.classList.add("buttonFilter")
                    buttonFilter.innerText = category.name
                    filterButtons.appendChild(buttonFilter)
                    buttonFilter.addEventListener("click", async() => {
                        let worksFiltered = []
                        if (category.id === 0) {
                            worksFiltered = works
                        } else {
                            worksFiltered = works.filter(function(Object) {
                                return Object.categoryId === category.id
                            })
                        }
                        
                        gallery.innerHTML = ""
                        generateWorks(worksFiltered)
                        removeActiveFilter()
                        buttonFilter.classList.add("active")
                    })
                }
            }

            const removeActiveFilter = () => {
                const allFilters = document.querySelectorAll(".buttonFilter")
                    for (i = 0; i < allFilters.length; i++) {
                        allFilters[i].classList.remove("active")
                    }
            }

            /******* Fonctions pour générer les éléments de mode édition *******/

            const generateDevMode = () => {
                if (window.localStorage.getItem("token") !== null ) {
                    generateBarEditTop()
                    showLogoutHideLogIn()
                    generateButtonModifier()
                }
            }

            const generateBarEditTop = () => {
                const barEdit = document.getElementById("barTop")
                barEdit.classList.remove("hidden")
                barEdit.classList.add("barDev")
                barEdit.innerHTML = `
                <i class="fa-regular fa-pen-to-square">
                </i><p>Mode édition</p>
                `
            }

            const showLogoutHideLogIn = () => {
                const navigation = document.querySelector("nav")
                navigation.innerHTML = ``
                navigation.innerHTML = `
                <ul>
			        <li><a href="#portfolio">projets</a></li>
			        <li><a href="#contact">contact</a></li>
			        <li><a href="" id="buttonLogout">logout</a></li>
			        <li><img src="./assets/icons/instagram.png" alt="Instagram"></li>
		        </ul>
                `
                const buttonLogout = document.getElementById("buttonLogout")
                buttonLogout.addEventListener("click", () => {
                    window.localStorage.removeItem("token")
                })
            }

            const generateButtonModifier = () => {
                const mesProjets = document.querySelector(".mesProjets")
                const buttonModifier = document.createElement("button")
                buttonModifier.className = "buttonModifier"
                buttonModifier.href = ""
                const imagePenSquare = document.createElement("i")
                imagePenSquare.classList.add("fa-regular")
                imagePenSquare.classList.add("fa-pen-to-square")
                const textModifier = document.createElement("p")
                textModifier.innerText = "modifier"
                mesProjets.appendChild(buttonModifier)
                buttonModifier.appendChild(imagePenSquare)
                buttonModifier.appendChild(textModifier)

                const buttonsFiltres = document.querySelector(".filter-buttons")
                buttonsFiltres.classList.add("hidden")

                buttonModifier.addEventListener("click", generateModal)
            }

            /******* Fonctions modales *******/
            
            const generateModal = () => {
                const modal = document.createElement("div")
                modal.className = "modal"
                const modalBackground = document.createElement("div")
                modalBackground.className = "modalBackground"
                const modalContent = document.createElement("div")
                modalContent.className = "modalContent"
                modal.appendChild(modalContent)
                modal.appendChild(modalBackground)
                const mesProjets = document.querySelector(".mesProjets")
                mesProjets.appendChild(modal)
                generateFirstModal()
                modalBackground.addEventListener("click", () => closeModal())
            }

            /******* Première modale *******/

            const generateFirstModal = () => {
                const modalContent = document.querySelector(".modalContent")
                modalContent.innerHTML = ""
                const navModal = document.createElement("div")
                navModal.className = "navModal"
                const buttonX = document.createElement("i")
                buttonX.className = "fa-solid fa-xmark fa-lg close"
                navModal.appendChild(buttonX)
                const h3 = document.createElement("h3")
                h3.innerText = "Galerie photo"
                const smallGallery = document.createElement("div")
                smallGallery.className = "smallGallery"
                const button = document.createElement("button")
                button.innerText = "Ajouter une photo"
                button.className = "modalContentButton"
                buttonX.addEventListener("click", closeModal)
                button.addEventListener("click", generateSecondModal)
                modalContent.appendChild(navModal)
                modalContent.appendChild(h3)
                modalContent.appendChild(smallGallery)
                generateWorksModal(works)
                modalContent.appendChild(button)
            }

            const generateWorksModal = (worksAfficher) => {
                const smallGallery = document.querySelector(".smallGallery")
                smallGallery.innerHTML = ""
                for (let i = 0; i < worksAfficher.length; i++) {
                    const work = worksAfficher[i]
                    const figure = document.createElement("figure")
                    const img = document.createElement("img")
                    const divTrash = document.createElement("div")
                    divTrash.className = "garbageDiv"
                    const garbageBin = document.createElement("i")
                    garbageBin.className = "fa-solid fa-trash-can garbage" 
                    img.className = "imgMini"
                    figure.className = "figureMini"
                    img.src = work.imageUrl
                    img.alt = work.title
                    divTrash.appendChild(garbageBin)
                    figure.appendChild(img)
                    figure.appendChild(divTrash)
                    smallGallery.appendChild(figure)
                    const supprimerWorkId = worksAfficher[i].id
                    divTrash.addEventListener("click", () => deleteWork(supprimerWorkId))
                }
            }

            const deleteWork = async(supprimerWorkId) => {
                const token = window.localStorage.getItem("token")
                await fetch(`http://localhost:5678/api/works/${supprimerWorkId}`, {
                    method: "DELETE",
                    headers: {
                          'accept': '*/*',
                          'Authorization': `Bearer ${token}`
                    }
                })
                gallery.innerHTML = ""
                await getWorks()
                generateWorksModal(works)
            }

            /******* Éléments de la seconde modale *******/

            const generateAjoutNavEtTitle = () => {
                const modalContent = document.querySelector(".modalContent")
                const modalNav = document.createElement("div")
                modalNav.className = "secondeModalNav"
                const arrowLeft = document.createElement("i")
                arrowLeft.className = "fa-solid fa-arrow-left arrowLeft fa-lg"
                const buttonX = document.createElement("i")
                buttonX.className = "fa-solid fa-xmark close fa-lg"
                modalNav.appendChild(arrowLeft)
                modalNav.appendChild(buttonX)
                modalContent.appendChild(modalNav)
                const h3 = document.createElement("h3")
                h3.innerText = "Ajout photo"
                modalContent.appendChild(h3)
                buttonX.addEventListener("click", closeModal)
                arrowLeft.addEventListener("click", generateFirstModal)
            }

            const generateAjoutFile = () => {
                const formAjout = document.querySelector(".formAjout")
                const divFile = document.createElement("div")
                divFile.className = "ajoutFile"
                const imageI = document.createElement("i")
                imageI.className = "fa-solid fa-image fa-5x"
                const buttonAjouterPhoto = document.createElement("button")
                buttonAjouterPhoto.innerText = "+ Ajouter photo"
                const inputFile = document.createElement("input")
                buttonAjouterPhoto.appendChild(inputFile)
                const inputFileText = document.createElement("p")
                inputFile.type = "file"
                inputFile.name = "Ajoutfile"
                inputFile.id = "Ajoutfile"
                inputFileText.innerText = "jpg, png : 4mo max"
                divFile.appendChild(imageI)
                divFile.appendChild(buttonAjouterPhoto)
                divFile.appendChild(inputFileText)
                formAjout.appendChild(divFile)
                
                inputFile.onchange = function (evt) {
                    var tgt = evt.target || window.event.srcElement,
                        files = tgt.files

                        const file = tgt.files[0]
                        if (file) {
                        const fileType = file.type;
                        const validTypes = ['image/jpeg', 'image/png']

                            if (validTypes.includes(fileType)) {
                                var tailleLimit = 3
                                var fileTaille = file.size
                                var fileTailleMO = (fileTaille/1000000)
                                if (fileTailleMO < tailleLimit) {
                                    if (FileReader && files && files.length) {
                                        var fr = new FileReader()
                                        fr.onload = function () {
                                        const divCover = document.createElement("div")
                                        divCover.className = "divCover"
                                        const imgUpload = document.createElement("img")
                                        imgUpload.src = fr.result
                                        imgUpload.alt = "Image selectionnée"
                                        imgUpload.className = "imageRecue"
                                        divFile.appendChild(divCover)
                                        divFile.appendChild(imgUpload)
                                        divCover.addEventListener("click", () => regenerateAjoutFile())
                                    }
                                    fr.readAsDataURL(files[0])
                                }
                                } else {
                                const erreurTaille = document.createElement("p")
                                erreurTaille.innerText = 'La taille du fichier dépasse 3 Mo'
                                divFile.appendChild(erreurTaille)
                                }
                            } else {
                                const messageMauvaisFormat = document.createElement("p")
                                messageMauvaisFormat.innerText = 'Type de fichier invalide. Veuillez sélectionner un JPEG ou PNG.'
                                divFile.appendChild(messageMauvaisFormat)
                            }
                        }
                    }
            }

            const regenerateAjoutFile = () => {
                const ajoutFile = document.querySelector(".ajoutFile")
                ajoutFile.remove()
                generateAjoutFile()
            }

            const generateAjoutTitre = () => {
                const formAjout = document.querySelector(".formAjout")
                const titreDiv = document.createElement("div")
                titreDiv.className = "titreDiv"
                const labelForTitre = document.createElement("label")
                labelForTitre.innerText = "Titre"
                const inputTitre = document.createElement("input")
                inputTitre.type = "text"
                inputTitre.name = "titreAjout"
                inputTitre.id = "titreAjout"
                labelForTitre.for = "titreAjout"
                titreDiv.appendChild(labelForTitre)
                titreDiv.appendChild(inputTitre)
                formAjout.appendChild(titreDiv)
            }
            const generateAjoutCategorie = () => {
                const formAjout = document.querySelector(".formAjout")
                const categorieDiv = document.createElement("div")
                categorieDiv.className = "categorieDiv"
                const labelForSelect = document.createElement("label")
                labelForSelect.innerText = "Catégorie"
                const selectCategorieAjout = document.createElement("select")
                selectCategorieAjout.name = "categorieAjout"
                selectCategorieAjout.id = "categorieAjout"
                labelForSelect.for = "categorieAjout"
                for (i = 0; i < categoriesList.length; i++) {
                    const optionCategory = document.createElement("option")
                    optionCategory.value = categoriesList[i].id
                    optionCategory.innerText = categoriesList[i].name
                    selectCategorieAjout.appendChild(optionCategory)
                }
                categorieDiv.appendChild(labelForSelect)
                categorieDiv.appendChild(selectCategorieAjout)
                formAjout.appendChild(categorieDiv)
            }

            const generateFormAjout = () => {
                const modalContent = document.querySelector(".modalContent")
                const formAjout = document.createElement("form")
                formAjout.className = "formAjout"
                modalContent.appendChild(formAjout)
                generateAjoutFile()
                generateAjoutTitre()
                generateAjoutCategorie()
                const buttonValider = document.createElement("button")
                buttonValider.innerText = "Valider"
                buttonValider.className = "modalContentButton"
                modalContent.appendChild(buttonValider)
                buttonValider.addEventListener("click", envoyerNewWork)
            }

            const envoyerNewWork = async() => {
                const filePhoto = document.getElementById("Ajoutfile")
                const titrePhoto = document.getElementById("titreAjout")
                const categoriePhoto = document.getElementById("categorieAjout")
                if (verifierChamps(filePhoto, titrePhoto)) {
                    if (window.localStorage.getItem("token") !== null) {
                        const bodyEnvoie = new FormData()
                        bodyEnvoie.append("image", filePhoto.files[0])
                        bodyEnvoie.append("title", titrePhoto.value)
                        bodyEnvoie.append("category", categoriePhoto.value)
                        const token = window.localStorage.getItem("token")
                        const envoie = await fetch ("http://localhost:5678/api/works", {
                            method: "POST",
                            headers: {
                                "accept": "application/json",
                                "Authorization": `Bearer ${token}`,
                            },
                            body: bodyEnvoie
                        })
                        const response = await envoie.json()
                        gallery.innerHTML = ""
                        await getWorks()
                        const formAjout = document.querySelector(".formAjout")
                        formAjout.innerHTML = ""
                        generateFormAjout()
                    }
                }
            }

            const verifierChamps = (filePhoto, titrePhoto) => { 
                if (filePhoto.value == "" || titrePhoto.value == "") {
                    const oldErrorMessage = document.getElementById("errorMessage")
                    if (oldErrorMessage !== null) {
                        oldErrorMessage.remove()
                    }
                    const errorMessageVide = document.createElement("p")
                    errorMessageVide.innerText = "Ce champ est obligatoire"
                    errorMessageVide.id = "errorMessage"
                    if (filePhoto.value == "") {
                        const errorArea = document.querySelector(".ajoutFile")
                        errorArea.appendChild(errorMessageVide)
                        return false
                    } else {
                        const errorArea = document.querySelector(".titreDiv")
                        errorArea.appendChild(errorMessageVide)
                        return false
                    }
                } else {return true}
            }

            /******* Seconde modale *******/

            const generateSecondModal = () => {
                const modalContent = document.querySelector(".modalContent")
                modalContent.innerHTML = ""
                generateAjoutNavEtTitle()
                generateFormAjout()
            }

            const closeModal = () => {
                const modalToClose = document.querySelector(".modal")
                modalToClose.remove()
            }

            generateDevMode()