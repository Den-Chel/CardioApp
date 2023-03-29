"use strict";

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputs = document.querySelectorAll("#input-field");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputTemp = document.querySelector(".form__input--temp");
const inputClimb = document.querySelector(".form__input--climb");

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; // km
    this.duration = duration; // min
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, temp) {
    super(coords, distance, duration);
    this.temp = temp;
    this.calculatePace();
  }

  calculatePace() {
    // min/km
    this.pace = this.duration / this.distance;
  }
}
class Cycling extends Workout {
  constructor(coords, distance, duration, climb) {
    super(coords, distance, duration);
    this.climb = climb;
  }
  calculateSpeed() {
    // km/h
    this.speed = this.distance / this.duration / 60;
  }
}

const running = new Running([50, 39], 7, 40, 170 );
const cycling = new Cycling([50, 39], 37, 80, 370 );
console.log(running, cycling);

class App {
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();

    form.addEventListener("submit", this._newWorkout.bind(this));

    inputType.addEventListener("change", this._toggleClimbField);
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Unable to get your location.");
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude},14z`);

    const coords = [latitude, longitude];

    this.#map = L.map("map").setView(coords, 13);

    L.tileLayer("http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}", {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }).addTo(this.#map);

    // click processing on the map
    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(e) {
    this.#mapEvent = e;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toggleClimbField() {
    inputClimb.closest(".form__row").classList.toggle("form__row--hidden");
    inputTemp.closest(".form__row").classList.toggle("form__row--hidden");
    inputs.forEach((input) => {
      input.value = "";
    });
  }

  _newWorkout(e) {
    e.preventDefault();

    // Сlearing input fields

    inputDistance.value =
      inputDuration.value =
      inputTemp.value =
      inputClimb.value =
        "";

    // Marker display
    const { lat, lng } = this.#mapEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("Training")
      .openPopup();
  }
}

const app = new App();
