/* eslint-disable no-undef */

// Emplacement du fichier JSON contenant les donées
const dataLocation = './public/json/photographers-data.json'

const photographerSectionArticle = document.getElementById(
  'photographer-section-article'
) // Article contenant les informations du photographe
const photographerMediaSection = document.getElementById(
  'photographer-media-section'
) // Section pour l'affichage des photographies de l'auteur

let totalLikes = 0 // Nombre de likes total sur toutes les photos du photographe

let photographer = '' // Initialisation de l'objet photographe

const photographerId = location.search.substring(4) // Récupération de l'ID du photographe dans l'URL de la page

const orderMediaSelected = document.getElementById('order-by') // Ordre d'affichage des photographies
let orderMediaSelectedValue = document.getElementById('order-by').value // Ordre d'affichage des photographies

let mediaData // Initialisation du tableau contenant les différents médias

orderMediaSelect() // Appel de la fonction permettant d'ordonner les médias

orderMediaSelected.addEventListener('change', orderMediaSelect)

// Fonction permettant de trier les photos selon les critères
function orderMediaSelect () {
  orderMediaSelectedValue = document.getElementById('order-by').value
  console.log(orderMediaSelectedValue)

  totalLikes = 0

  displayPage(orderMediaSelectedValue)
  return orderMediaSelectedValue
}

// Fonction affichant la page
function displayPage (sorter) {
  fetch(dataLocation)
    .then((data) => {
      return data.json()
    }) // récupération des données
    .then((data) => {
      const photographerData = data.photographers.filter((photographer) => photographer.id === parseInt(photographerId))
      photographer = PhotographerFactory.makePhotographer(
        photographerData[0].id,
        photographerData[0].name,
        photographerData[0].description,
        photographerData[0].city,
        photographerData[0].country,
        photographerData[0].tags,
        photographerData[0].tagline,
        photographerData[0].price,
        photographerData[0].portrait
      )
      // Affichage de l'en-tête comportant les infos du photographe
      photographerSectionArticle.innerHTML = `
        <div class="photographer-page--header">
        <div class="photographer-page--lblock">
        <h1 id="photographer-name" class="photographer-page--name" aria-label="Le photographe sélectionné est ${photographer.name}" tabindex="3">
          ${photographer.name}
        </h1>
        <h3 tabindex="4" class="photographer-page--location">${photographer.city}, ${photographer.country}</h3>
        <p tabindex="5" class="photographer-page--tagline">${photographer.tagline}</p>
        <aside id="article-tags-${photographer.id}" tabindex="6" aria-label="${photographer.name} est spécialisée dans les photos de type"></aside>
        </div>
        <div id="contact-button-block" class="contact-button-div"><span id="contact-button" class="button" tabindex="7">Contactez-moi</span></div>
        </div>
        <img id="${photographer.id}-profilePicture" class="photographer-page--picture photographer-profile-picture" src="./public/img/SamplePhotos/Photographers ID Photos/${photographer.portrait}" alt="${photographer.description}" tabindex="19"/>
        `

      // Récupération des tags correspondant au photographe sélectionné
      const articleTags = document.getElementById(
        'article-tags-' + photographer.id
      )
      for (tag of photographer.tags) {
        articleTags.innerHTML += `<span id="${tag}" class="tags" data-filter="${tag}" tabindex="6" aria-label="${tag}" >#${tag}</span>`
      }

      // Affichage du nom du photographe dans le formulaire de contact
      const contactFormTitle = document.getElementById('contact-me')
      contactFormTitle.textContent = photographer.name

      const modalbg = document.getElementById('form-background') // Div d'arrière plan du formulaire

      const contactButton = document.getElementById('contact-button') // Bouton permettant d'ouvrir le formulaire

      const closeButton = document.getElementById('close-button') // Bouton pour fermer la modale de contact

      const formBody = document.getElementById('contact-form') // Formulaire

      const formSubmitButton = document.getElementById('contact-button-submit')

      const closeFormButton = document.getElementById('form-close-button')

      contactButton.addEventListener('click', openModal) // Evènement déclencheant l'ouverture de la modale
      closeButton.addEventListener('click', closeModal) // Fermeture de la modale

      // Fonction d'ouverture de la modale de contact
      function openModal () {
        modalbg.style.display = 'flex'
        contactButton.style.display = 'none'
      }

      // Fonction de réinitialisation du formulaire de contact
      function resetForm () {
        formBody.reset()
        successMessage.style.display = 'none'
        formBody.style.display = 'flex'
        closeModal()
      }

      // Fonction de fermeture de la modale de contact
      function closeModal () {
        console.log(validateForm())
        if (validateForm() === 1) {
          resetForm()
        }
        modalbg.style.display = 'none'
        contactButton.style.display = 'flex'
      }

      // Lorsque l'on clique sur le bouton de validation
      formSubmitButton.addEventListener('click', ($event) => {
        $event.preventDefault() // On empêche le comportement par défaut
        // On vérifie que tous les champs soient validés grâce à une variable
        validateForm()
      })

      // Lorsque l'on clique sur le bouton de fermeture
      closeFormButton.addEventListener('click', ($event) => {
        $event.preventDefault() // On empêche le comportement par défaut
        // On ferme la modale
        resetForm()
      })

      // Filtrage des médias selon l'ID du photographe afin que seuls les médias du photographe sélectionné soient visibles
      mediaData = data.media.filter(
        (media) => media.photographerId === parseInt(photographerId)
      )

      // Fonction permettant de trier les photos selon les critères du média
      function GetSortOrder (prop) {
        return function (a, b) {
          if (a[prop] > b[prop]) {
            return 1
          } else if (a[prop] < b[prop]) {
            return -1
          }
          return 0
        }
      }

      // Constructeur de l'objet Media
      photographerMediaSection.innerHTML = ''
      for (let j = 0; j < mediaData.length; j++) {
        mediaData.sort(GetSortOrder(sorter))
        const media = MediaFactory.makeMedia(
          mediaData[j].id,
          mediaData[j].photographerId,
          mediaData[j].title,
          mediaData[j].image,
          mediaData[j].video,
          mediaData[j].tags,
          mediaData[j].likes,
          mediaData[j].date,
          mediaData[j].price,
          mediaData[j].description
        )

        console.log(media)

        // Calcul du nombre total de likes pour tous les médias du photographe
        totalLikes += media.likes

        // Récupération des images du photographe
        // Création d'un bloc figure pour chaque média du photographe
        photographerMediaSection.innerHTML += createMediaHTMLCode(media)

        // Récupération de l'icône coeur pour les likes
        const likesIcon = document.querySelectorAll('.fa-heart')

        // Pour chaque icône "coeur" de la page, on appelle la fonction permettant de gérer les likes lors du clic
        likesIcon.forEach((el) =>
          el.addEventListener('click', (e) => {
            setLikes(e.target.id) // On passe l'id de l'élément cliqué en paramètre
          })
        ) // Détection du clic sur la séction media pour appeler la fonction des likes

        // Même chose pour la pression de la touche entrée
        likesIcon.forEach((el) =>
          el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              setLikes(e.target.id)
            }
          })
        )

        const likedElements = [] // Tableau dans lequel seront stockés les id des éléments déjà likés

        // Fonction permettant d'incrémenter ou de décrémenter le nombre de likes d'une photo
        function setLikes (e) {
          // On récupère l'id seul du like souhaité
          const elementId = e.split('like-media-').pop()

          // Si l'élement a déjà été liké (est dans le tableau), alors on effectue la fonction de décrémentation
          if (likedElements.includes(elementId)) {
            const elementIndex = likedElements.indexOf(elementId)
            if (elementIndex !== -1) {
              likedElements.splice(elementIndex, 1) // On retire l'id de l'élément liké du tableau
            }
            tweakLikes(elementId, -1) // Décrémentation
            document
              .getElementById(e)
              .setAttribute('aria-label', 'Like retiré')
            document.getElementById(e).className = 'fa fa-heart' // Feedback visuel lorsqu'un élément est unliké : la couleur change
          } else {
            // Sinon on l'incrémente en appelant la fonction chargée de le faire

            likedElements.push(elementId) // On envoie l'ID de l'élément liké dans le tableau
            tweakLikes(elementId, 1) // On ajoute un like
            document
              .getElementById(e)
              .setAttribute('aria-label', 'Like ajouté')
            document.getElementById(e).className = 'liked fa fa-heart' // Feedback visuel lorsqu'un élément est liké : la couleur change
          }
        }
      }

      // Fonciton permettant d'ajouter et de retirer des likes selon les valeurs passées en paramètre
      function tweakLikes (elementId, value) {
        const likesText = document.getElementById(`like-counter-${elementId}`)
        const likesValue = parseInt(likesText.innerHTML)
        const newLikesValue = likesValue + value
        likesText.innerHTML = newLikesValue
        console.log(
          'on ajoute ' +
            value +
            ' à ' +
            likesValue +
            '. Et on a donc ' +
            newLikesValue
        )
        refreshLikesCounter(value) // Rafraîchaissement du compteur total de likes
      }

      // Fonction permettant de rafraîchir le nombre total de likes selon un paramètre correspondant au nombre à ajouter
      function refreshLikesCounter (value) {
        totalLikes += value
        totalLikesText.innerHTML = totalLikes + ' <i class="fas fa-heart"></i>'
        totalLikesText.setAttribute('aria-label', 'Le nombre total de likes pour la page de ' + photographer.name + ' est de ' + totalLikes)
      }

      // Élément permettant d'afficher le nombre total de likes
      const totalLikesText = document.getElementById(
        'photographer-total-likes'
      )

      // Ajout du label ARIA (afin de pouvoir le modifier) donnant le nombre total de likes
      totalLikesText.setAttribute('aria-label', 'Le nombre total de likes pour la page de ' + photographer.name + ' est de ' + totalLikes)

      const priceText = document.getElementById('photographer-price')

      totalLikesText.innerHTML = totalLikes + ' <i class="fas fa-heart"></i>'
      priceText.textContent = photographer.price + '€ / jour'

      // Code consacré à la modale Lightbox
      let currentMedia

      // Variables
      const lightboxModal = document.getElementById('lightbox-modal')
      const lightboxImage = document.getElementById('lightbox-image')
      const lightboxClose = document.getElementById('lightbox-close')
      const lightboxPrevious = document.getElementById('lightbox-previous')
      const lightboxNext = document.getElementById('lightbox-next')
      const lightboxTitle = document.getElementById('lightbox-title')

      // Lors du clic sur une image, ouverture de la lightbox
      photographerMediaSection.addEventListener('click', launchLightbox)

      // Lors du clic sur la croix, fermeture de la lightbox
      lightboxClose.addEventListener('click', closeLightbox)

      // Clic sur le bouton précédent, photo précédente
      lightboxPrevious.addEventListener('click', (event) => {
        changePicture(-1)
      })

      // Clic sur le bouton suivante, photo suivante
      lightboxNext.addEventListener('click', (event) => {
        changePicture(1)
      })

      // Photo précédente lors de la pression de la touche flèche de gauche
      window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          changePicture(-1)
        }
      })

      // Photo suivante lors de la pression de la touche flèche de droite
      window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
          changePicture(1)
        }
      })

      // Fermeture de la lightbox lors de la pression de la touche Echap
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          closeLightbox()
        }
      })

      // Ouverture de la lightbox lors de la pression de la touche entrée (selon le paramètre de l'élément)
      window.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          launchLightbox(event)
        }
      })

      // Fonction permettant la fermeture de la lightbox
      function closeLightbox () {
        lightboxModal.style.display = 'none'
      }

      // Fonction permettant l'ouverture de la lightbox
      function launchLightbox (e) {
        // Si l'élément sur lequel le focus était lors de la pression d'"Entrée" a un id commençant par "media-img-"
        if (e.target.id.startsWith('media-img-')) {
          const pictureId = e.target.id.split('-').pop() // On récupère l'ID de la photo
          const media = mediaData.find((element) => element.id === parseInt(pictureId)) // On cherche la photo correspondant à l'ID du média
          currentMedia = media
          lightboxImage.innerHTML = generateMediaTag(
            media,
            'lightbox--image--img'
          ) // Création de l'image grâce à la fonction précédemment utilisée pour la création des médias
          lightboxTitle.innerHTML = `<p class="lightbox--title" tabindex="${currentMedia.photographerId}" aria-label="La photo actuellement à l'écran est ${currentMedia.title} ${currentMedia.description}">${currentMedia.title}</p>` // Affichage du titre de l'image
          lightboxModal.style.display = 'flex'
        }
      }

      // Fonction permettant de changer de photo (suivante ou précédente) selon la valeur passée en paramètre
      function changePicture (value) {
        const index = mediaData.indexOf(currentMedia) // Index de l'image actuelle
        const newMedia = mediaData[index + value] // Image située juste avant ou après l'image actuelle selon le paramètre
        currentMedia = newMedia // Le nouveau média devient le média actuel

        if (currentMedia !== undefined) {
          lightboxImage.innerHTML = generateMediaTag(
            currentMedia,
            'lightbox--image--img'
          ) // Création de l'image grâce à la fonction précédemment utilisée pour la création des médias
          lightboxTitle.innerHTML = `<p class="lightbox--title" tabindex="${currentMedia.photographerId}" aria-label="La photo actuellement à l'écran est ${currentMedia.title}. ${currentMedia.description}">${currentMedia.title}</p>`
        }
      }
    })
}
