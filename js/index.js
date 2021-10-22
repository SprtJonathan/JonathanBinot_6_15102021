const photographerSection = document.getElementById("photographer-section");

const dataLocation = "../public/json/photographers-data.json";

// Identification des boutons
const allPhotographers = document.getElementById("allPhotographers");

// Sélection des tags
const portraitFilter = document.getElementById("portrait");
const artFilter = document.getElementById("art");
const fashionFilter = document.getElementById("fashion");
const architectureFilter = document.getElementById("architecture");
const travelFilter = document.getElementById("travel");
const sportFilter = document.getElementById("sport");
const animalsFilter = document.getElementById("animals");
const eventsFilter = document.getElementById("events");

allPhotographers.addEventListener("click", displayPhotographers);

portraitFilter.addEventListener("click", filterPhotographer);
artFilter.addEventListener("click", filterPhotographer);
fashionFilter.addEventListener("click", filterPhotographer);
architectureFilter.addEventListener("click", filterPhotographer);
travelFilter.addEventListener("click", filterPhotographer);
sportFilter.addEventListener("click", filterPhotographer);
animalsFilter.addEventListener("click", filterPhotographer);
eventsFilter.addEventListener("click", filterPhotographer);

portraitFilter.addEventListener("keypress", filterPhotographer);
artFilter.addEventListener("keypress", filterPhotographer);
fashionFilter.addEventListener("keypress", filterPhotographer);
architectureFilter.addEventListener("keypress", filterPhotographer);
travelFilter.addEventListener("keypress", filterPhotographer);
sportFilter.addEventListener("keypress", filterPhotographer);
animalsFilter.addEventListener("keypress", filterPhotographer);
eventsFilter.addEventListener("keypress", filterPhotographer);

function scrollDiv() {
  let y = window.scrollY;
  if (y >= 10) {
    allPhotographers.className = "content-button--link--show"
  } else {
    allPhotographers.className = "content-button--link"
  }
};

window.addEventListener("scroll", scrollDiv);

function displayPhotographers() {
  photographerSection.innerHTML = "";
  // Récupération des données des photographes
  fetch(dataLocation)
    .then((response) => response.json())
    .then(function getPhotographersInfo(data) {
      for (object of data.photographers) {
        const photographer = PhotographerFactory.makePhotographer(
          object.id,
          object.name,
          object.description,
          object.city,
          object.country,
          object.tags,
          object.tagline,
          object.price,
          object.portrait
        );

        // Bloc créé pour chaque photographe
        photographerSection.innerHTML += createHTMLCode(photographer);

        // Récupération des tags correspondant à chaque photographe
        const articleTags = document.getElementById(
          "article-tags-" + photographer.id
        );
        for (tag of photographer.tags) {
          articleTags.innerHTML += `<span id="${tag}" class="tags" data-filter="${tag}" tabindex="${photographer.id}" aria-label="Les spécialités de ${photographer.name} sont ${tag}" >#${tag}</span>`;
        }
      }
    });
}

function filterPhotographer() {
  photographerSection.innerHTML = "";
  let activeFilter = this.dataset.filter;
  console.log(activeFilter);
  let photographerMatchList = [];

  fetch(dataLocation)
    .then((response) => response.json())
    .then(function (data) {
      for (object of data.photographers) {
        const photographer = PhotographerFactory.makePhotographer(
          object.id,
          object.name,
          object.description,
          object.city,
          object.country,
          object.tags,
          object.tagline,
          object.price,
          object.portrait
        );
        compareTags();
        function compareTags() {
          photographer.tags.forEach((e) => {
            if (e === activeFilter) {
              photographerMatchList.push(photographer);
            }
          });
        }
      }
      for (photographer of photographerMatchList) {
        photographerSection.innerHTML += createHTMLCode(photographer);
        // récupération des tags
        const articleTags = document.getElementById(
          "article-tags-" + photographer.id
        );
        for (tag of photographer.tags) {
          articleTags.innerHTML += `<span id="${tag}" class="tags" data-filter="${tag}" tabindex="${photographer.id}" aria-label="Les spécialités de ${photographer.name} sont ${tag}" >#${tag}</span>`;
        }
      }
    });
}
