function createHTMLCode(photographer) {
  const photographerHtmlCode = `
<article class="photographer--article">
        <a href="photographer-page.html?id=${photographer.id}" aria-label="Cliquez sur l'image pour accéder au profil de ${photographer.name}"><img id="${photographer.id}-profilePicture" class="photographer-profile-picture" onclick= "console.log(this)" src="./public/img/SamplePhotos/Photographers ID Photos/${photographer.portrait}" alt="${photographer.description}" tabindex="12"/>
            <h2 class="photographer--name" tabindex="13" aria-label="Le nom du photographe est ${photographer.name} ">${photographer.name}</h2></a>
            <aside class="photographer--article--description">
            <h3 class="photographer--location" tabindex="14" aria-label="Le photographe viens de ${photographer.city}">${photographer.city}, ${photographer.country}</h3>
            <blockquote class="photographer--quote" tabindex="15" aria-label="La devise du photographe est :${photographer.tagline}">${photographer.tagline}</blockquote>
            <p class="photographer--price" tabindex="16" aria-label="Le prix de ce photographe est ${photographer.price}€ par jour">${photographer.price}€ /jour</p>
        </aside>
        <aside id="article-tags-${photographer.id}" class="articles--tags--${photographer.id}"></aside>
</article>  
`;
  return photographerHtmlCode;
}
