/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const formBody = document.getElementById('contact-form') // Formulaire

const formSubmitButton = document.getElementById('contact-button-submit')
const fnameId = document.getElementById('fname')
const lnameId = document.getElementById('lname')
const emailId = document.getElementById('email')
const messageId = document.getElementById('message')

// Vérification des champs

// Création d'éléments du DOM pour les messages d'erreur

// Fonction créant des messages d'erreur
function createErrorMessage (elementErrorId, name) {
  elementErrorId.insertAdjacentHTML(
    'afterend',
    "<span id='" + name + "-error' class='error-text'></span>"
  )
}

// Fonction permettant de cacher les messages d'erreurs des champs
function hideError (errorName) {
  errorName.className = 'error-text'
}

// Erreur du champ Prénom
createErrorMessage(fnameId, 'fname')

const fnameError = document.getElementById('fname-error')
hideError(fnameError)

// Message d'erreur du champ nom de famille
createErrorMessage(lnameId, 'lname')

const lnameError = document.getElementById('lname-error')
hideError(lnameError)

// Message d'erreur du champ email
createErrorMessage(emailId, 'email')

const emailError = document.getElementById('email-error')
hideError(emailError)

// Message d'erreur du champ date de naissance
createErrorMessage(messageId, 'message')

const messageError = document.getElementById('message-error')
hideError(messageError)

// Validation Email par expression régulière
function emailRegexValidation (email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(email).toLowerCase())
}

// Validation des noms par expression régulière
function nameRegexValidation (name) {
  const re = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/
  return re.test(String(name))
}

// Fonction permettant de valider le prénom
function nameValidation (nameId, nameError) {
  // Si la valeur du champ est moins longue que deux caractères, on renvoie une erreur
  if (nameId.value.length < 2) {
    nameError.textContent = 'Minimum deux caractères' // Message d'erreur affiché
    nameError.className = 'error-text--expanded' // On affiche le bloc d'erreur
    nameId.setAttribute('aria-invalid', 'true')
    return false
  } else {
    // Sinon, si la valeur du champ contient des chiffres ou caractères spéciaux, on renvoie une erreur
    if (nameRegexValidation(nameId.value) === false) {
      nameError.textContent = 'Pas de chiffres ou de caractères spéciaux' // Message d'erreur affiché
      nameError.className = 'error-text--expanded' // On affiche le bloc d'erreur
      nameId.setAttribute('aria-invalid', 'true')
      return false
      // Sinon on valide le champ et on renvoie "true"
    } else {
      nameError.className = 'error-text' // On cache le bloc d'erreur s'il n'y en a pas
      nameId.setAttribute('aria-invalid', 'false')
      return true
    }
  }
}

// Fonction permettant de valider l'email. On utilise l'expression régulière pour vérifier les caractères
function emailValidation () {
  if (emailRegexValidation(emailId.value) === false) {
    emailError.textContent = 'Adresse email invalide'
    emailError.className = 'error-text--expanded'
    emailId.setAttribute('aria-invalid', 'true')
    return false
  } else {
    emailError.className = 'error-text'
    emailId.setAttribute('aria-invalid', 'false')
    return true
  }
}

// Fonction permettant de valider la date de naissance
function messageValidation () {
  // Si aucun message n'est entré, alors on renvoie une erreur
  if (!messageId.value) {
    messageError.textContent = 'Précisez la raison de votre message'
    messageError.className = 'error-text--expanded'
    messageId.setAttribute('aria-invalid', 'true')
    return false
  } else {
    // Sinon vrai
    messageError.className = 'error-text'
    messageId.setAttribute('aria-invalid', 'false')
    return true
  }
}

// Création d'un bloc pour le message de succès
formBody.insertAdjacentHTML(
  'afterend',
  '<div id="success" class="success-block" tabindex="13"><h2 class="success-title">Formulaire validé !</h2> <p class="success-text">Merci de m\'avoir contacté, je vous répondrai prochainement</p><input class="modal--contact-form--submit button" id="form-close-button" type="submit" value="Fermer" tabindex="13"/></div>'
)
const successMessage = document.getElementById('success')
successMessage.style.display = 'none' // On le cache par défaut

// Fonction de validation du formulaire
function validateForm () {
  const formValidator =
    nameValidation(fnameId, fnameError) *
    nameValidation(lnameId, lnameError) *
    emailValidation() *
    messageValidation()
  console.log(formValidator)
  if (formValidator === 1) {
    // Si tous les champs sont valides, on affiche le message de succès
    successMessage.style.display = 'flex'
    formBody.style.display = 'none' // Affichage du bloc de succès avec le bouton fermer
    return 1
  } else {
    return 0
  }
}
