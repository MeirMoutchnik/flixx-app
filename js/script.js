console.log(window.location.pathname);
// shows which html page we're on - see general on location object, pathname, search properties
const global = {
  currentPage: window.location.pathname.split("/")[2],
};

const displayPopularMovies = async () => {
  //   const results = await fetchAPIData("movie/popular");
  // gives object with included array of "results". To show just results
  // deconstructure:
  const { results } = await fetchAPIData("movie/popular");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("card");

    const a = document.createElement("a");
    a.setAttribute("href", `movie-details.html?id=${movie.id}`);
    const img = document.createElement("img");
    // img.setAttribute(
    //   "src",
    //   `${movie.poster_path}`
    //     ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    //     : "images/no-image.jpg"
    // );
    // img.setAttribute("class", "card-img-top");
    // img.setAttribute("alt", "Movie Title");
    Object.assign(img, {
      src: `${movie.poster_path}`
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "images/no-image.jpg",
      class: "card-img-top",
      alt: `${movie.title}`,
    });
    const div1 = document.createElement("div");
    div1.classList.add("card-body");
    const h5 = document.createElement("h5");
    h5.classList.add("card-title");
    const movieTitle = document.createTextNode(`${movie.title}`);
    const p = document.createElement("p");
    p.classList.add("card-text");
    const small = document.createElement("small");
    small.classList.add("text-muted");
    const cardText = document.createTextNode(`Release: ${movie.release_date}`);
    h5.appendChild(movieTitle);
    p.appendChild(small);
    div1.appendChild(h5);
    div1.appendChild(p);
    a.appendChild(img);
    div.appendChild(a);
    div.appendChild(div1);

    document.querySelector("#popular-movies").appendChild(div);
  });
};

const displayPopularShows = async () => {
  const { results } = await fetchAPIData("tv/popular");
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("card");

    const a = document.createElement("a");
    a.setAttribute("href", `tv-details.html?id=${show.id}`);
    const img = document.createElement("img");
    Object.assign(img, {
      src: `${show.poster_path}`
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : "images/no-image.jpg",
      class: "card-img-top",
      alt: `${show.name}`,
    });
    const div1 = document.createElement("div");
    div1.classList.add("card-body");
    const h5 = document.createElement("h5");
    h5.classList.add("card-name");
    const showName = document.createTextNode(`${show.name}`);
    const p = document.createElement("p");
    p.classList.add("card-text");
    const small = document.createElement("small");
    small.classList.add("text-muted");
    const cardText = document.createTextNode(
      `Air Date: ${show.first_air_date}`
    );
    h5.appendChild(showName);
    p.appendChild(small);
    div1.appendChild(h5);
    div1.appendChild(p);
    a.appendChild(img);
    div.appendChild(a);
    div.appendChild(div1);

    document.querySelector("#popular-shows").appendChild(div);
  });
};

// Display Movie Details
const displayMovieDetails = async () => {
  const movieID = window.location.search.split("=")[1];
  //   window.locatoin.search is everything after "?", params, path. Here - "id=23112",
  // so splitting string into array and taking its 2nd element leaves id only

  const movie = await fetchAPIData(`movie/${movieID}`);

  displayBackgroundImage("movie", movie.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `
  <div class="details-top">
          <div>
          ${
            movie.poster_path
              ? `
              <img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="Movie Title"
              />`
              : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${movie.title}"
              />`
          }
            </div>
            <div>
              <h2>${movie.title}</h2>
              <p>
                <i class="fas fa-star text-primary"></i>
                ${movie.vote_average.toFixed(1)} / 10
              </p>
              <p class="text-muted">Release Date: ${movie.release_date}</p>
              <p>
              ${movie.overview}
              </p>
              <h5>Genres</h5>
              <ul class="list-group">
             ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
              </ul>
              <a href="${
                movie.homepage
              }" target="_blank" class="btn">Visit Movie Homepage</a>
            </div>
          </div>
          <div class="details-bottom">
            <h2>Movie Info</h2>
            <ul>
              <li><span class="text-secondary">Budget:</span> $${addComasToNumber(
                movie.budget
              )}</li>
              <li><span class="text-secondary">Revenue:</span> $${addComasToNumber(
                movie.revenue
              )}</li>
              <li><span class="text-secondary">Runtime:</span> ${
                movie.runtime
              } minutes</li>
              <li><span class="text-secondary">Status:</span> ${
                movie.status
              }</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">${movie.production_companies
              .map((company) => `<span>${company.name}</span>`)
              .join(", ")}</div>
          </div>
  `;

  document.querySelector("#movie-details").appendChild(div);
};

// Display Show Details
const displayShowDetails = async () => {
  const showID = window.location.search.split("=")[1];
  //   window.locatoin.search is everything after "?", params, path. Here - "id=23112",
  // so splitting string into array and taking its 2nd element leaves id only

  const show = await fetchAPIData(`tv/${showID}`);

  displayBackgroundImage("tv", show.backdrop_path);

  const div = document.createElement("div");
  div.innerHTML = `
  <div class="details-top">
          <div>
          ${
            show.poster_path
              ? `
              <img
                src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="Show Name"
              />`
              : `<img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="${show.name}"
              />`
          }
            </div>
            <div>
              <h2>${show.name}</h2>
              <p>
                <i class="fas fa-star text-primary"></i>
                ${show.vote_average.toFixed(1)} / 10
              </p>
              <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
              <p>
              ${show.overview}
              </p>
              <h5>Genres</h5>
              <ul class="list-group">
             ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
              </ul>
              <a href="${
                show.homepage
              }" target="_blank" class="btn">Visit Show Homepage</a>
            </div>
          </div>
          <div class="details-bottom">
            <h2>Show Info</h2>
            <ul>
              <li><span class="text-secondary">Number of Episodes:</span> ${
                show.number_of_episodes
              }</li>
              <li><span class="text-secondary">Last Episode to Air:</span> ${
                show.last_episode_to_air.name
              }</li>
              <li><span class="text-secondary">Status:</span> ${
                show.status
              }</li>
            </ul>
            <h4>Production Companies</h4>
            <div class="list-group">${show.production_companies
              .map((company) => `<span>${company.name}</span>`)
              .join(", ")}</div>
          </div>
  `;

  document.querySelector("#show-details").appendChild(div);
};

// Display backdrop on details pages
const displayBackgroundImage = (type, backgroundPath) => {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(http://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
};

// Fetch data from TBDB API
const fetchAPIData = async (endpoint) => {
  const API_KEY = "0a2b2b4b6a53d717e02707c376c473d2";
  const API_URL = "https://api.themoviedb.org/3/";

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();

  hideSpinner();

  return data;
};

const showSpinner = () => {
  document.querySelector(".spinner").classList.add("show");
};

const hideSpinner = () => {
  document.querySelector(".spinner").classList.remove("show");
};

// Display SLider Movies
const displaySlider = async () => {
  const { results } = await fetchAPIData("movie/now_playing");
  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
      </h4>
    `;

    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
};

const initSwiper = () => {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: true,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
};

// Highlight active link
const highLightActiveLnk = () => {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") === global.currentPage) {
      link.classList.add("active");
    }
  });
};

const addComasToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Init App
const init = () => {
  switch (global.currentPage) {
    case "/":
    case "index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "shows.html":
      displayPopularShows();
      break;
    case "movie-details.html":
      displayMovieDetails();
      break;
    case "tv-details.html":
      displayShowDetails();
      break;
    case "search.html":
      console.log("Search");
      break;
  }

  highLightActiveLnk();
};

document.addEventListener("DOMContentLoaded", init);
