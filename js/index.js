const photographerSection = document.getElementById("photographer-section");

const dataLocation = "../public/json/photographers-data.json";

// Récupération des données stockées dans le JSON
console.log("Récupération des données du JSON");

// Création de la class Photographer et de la factory
class Photographer {
  constructor(
    id,
    name,
    description,
    city,
    country,
    tags,
    tagline,
    price,
    portrait
  ) {
    this._id = id;
    this._name = name;
    this._description = description;
    this._city = city;
    this._country = country;
    this._tags = tags;
    this._tagline = tagline;
    this._price = price;
    this._portrait = portrait;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get city() {
    return this._city;
  }

  get country() {
    return this._country;
  }

  get tags() {
    return this._tags;
  }

  get tagline() {
    return this._tagline;
  }

  get price() {
    return this._price;
  }

  get portrait() {
    return this._portrait;
  }
}

const PhotographerFactory = {
  makePhotographer: function (
    id,
    name,
    description,
    city,
    country,
    tags,
    tagline,
    price,
    portrait
  ) {
    return new Photographer(
      id,
      name,
      description,
      city,
      country,
      tags,
      tagline,
      price,
      portrait
    );
  },
};

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
        photographerSection.innerHTML += `
        <article class="photographer--article">
                <a href="details.html?id=${photographer.id}" aria-label="Cliquez sur l'image pour accéder au profil de ${photographer.name}"><img id="${photographer.id}-profilePicture" class="photographer--profilePicture" onclick= "console.log(this)" src="./public/img/SamplePhotos/Photographers ID Photos/${photographer.portrait}" alt="${photographer.description}" tabindex="12"/></a>
                <aside class="photographer--article--description">
                    <h2 tabindex="13" aria-label="Le nom du photographe est ${photographer.name} ">${photographer.name}</h2>
                    <h3 tabindex="14" aria-label="Le photographe viens de ${photographer.city}">${photographer.city}, ${photographer.country}</h3>
                    <blockquote tabindex="15" aria-label="La devise du photographe est :${photographer.tagline}">${photographer.tagline}</blockquote>
                    <p  tabindex="16" aria-label="Le prix de ce photographe est ${photographer.price}€ par jour">${photographer.price}€ /jour</p>
                </aside>
                <aside id="article-tags-${photographer.id}" class="articles--tags--${photographer.id}"></aside>
        </article>  
        `;

        // Récupération des tags correspondant à chaque photographe
        const articleTags = document.getElementById(
          "article-tags-" + photographer.id
        );
        for (tag of photographer.tags) {
          articleTags.innerHTML += `<span class="photographerTag" data-tag="${tag}" tabindex="${photographer.id}" aria-label="Les spécialités de ${photographer.name} sont ${tag}" >#${tag}</span>`;
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
        photographerSection.innerHTML += `
        <article class="photographer--article">
        <a href="details.html?id=${photographer.id}" aria-label="Cliquez sur l'image pour accéder au profil de ${photographer.name}"><img id="${photographer.id}-profilePicture" class="photographer--profilePicture" onclick= "console.log(this)" src="./public/img/SamplePhotos/Photographers ID Photos/${photographer.portrait}" alt="${photographer.description}" tabindex="12"/></a>
        <aside class="photographer--article--description">
            <h2 tabindex="13" aria-label="Le nom du photographe est ${photographer.name} ">${photographer.name}</h2>
            <h3 tabindex="14" aria-label="Le photographe viens de ${photographer.city}">${photographer.city}, ${photographer.country}</h3>
            <blockquote tabindex="15" aria-label="La devise du photographe est :${photographer.tagline}">${photographer.tagline}</blockquote>
            <p  tabindex="16" aria-label="Le prix de ce photographe est ${photographer.price}€ par jour">${photographer.price}€ /jour</p>
        </aside>
        <aside id="article-tags-${photographer.id}" class="articles--tags--${photographer.id}"></aside>
        </article>  
            `;
        // récupération des tags
        const articleTags = document.getElementById(
          "article-tags-" + photographer.id
        );
        for (tag of photographer.tags) {
          articleTags.innerHTML += `<span class="photographerTag" data-tag="${tag}" tabindex="${photographer.id}" aria-label="Les spécialités de ${photographer.name} sont ${tag}" >#${tag}</span>`;
        }
      }
    });
}
