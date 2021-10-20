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
