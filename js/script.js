// console.log(window.location.pathname);
// shows which html page we're on - see general on location object, pathname, search properties
const global = {
  currentPage: window.location.pathname.split("/")[2],
  search: {
    term: "",
    type: "",
    // for movie or show types
    page: 1,
    // for pagination, page 1 by default
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: "0a2b2b4b6a53d717e02707c376c473d2",
    apiUrl: "https://api.themoviedb.org/3/",
  },
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
    small.appendChild(cardText);
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

// Search movies/shows
const search = async () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  // console.log(urlParams.get("type"));
  // see properties in "global" object above
  global.search.type = urlParams.get("type");
  // as in html input of radio buttons movie/show has name="type".
  // And of search input - "search-term"
  global.search.term = urlParams.get("search-term");

  if (global.search.term !== "" && global.search.term !== null) {
    const { results, page, total_pages, total_results } = await searchAPIData();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
      showAlert("No results found");
      return;
    }

    displaySearchResults(results);

    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please enter a search term", "alert-error");
  }
};

// Fetch data from TBDB API
const fetchAPIData = async (endpoint) => {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();

  hideSpinner();

  return data;
};

// Fetch data in search
const searchAPIData = async () => {
  const API_KEY = global.api.apiKey;
  const API_URL = global.api.apiUrl;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?query=${global.search.term}&api_key=${API_KEY}&page=${global.search.page}&language=en-US`
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

const displaySearchResults = (results) => {
  // CLear previous results
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";

  results.forEach((result) => {
    const div = document.createElement("div");
    div.classList.add("card");

    const a = document.createElement("a");
    a.setAttribute(
      "href",
      `${global.search.type}-details.html?id=${result.id}`
    );
    const img = document.createElement("img");
    Object.assign(img, {
      src: `${result.poster_path}`
        ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
        : "images/no-image.jpg",
      class: "card-img-top",
      alt:
        `${global.search.type}` === "movie"
          ? `${result.title}`
          : `${result.name}`,
    });
    const div1 = document.createElement("div");
    div1.classList.add("card-body");
    const h5 = document.createElement("h5");
    h5.classList.add("card-title");
    const resultTitle = document.createTextNode(
      `${global.search.type}` === "movie" ? `${result.title}` : `${result.name}`
    );
    const p = document.createElement("p");
    p.classList.add("card-text");
    const small = document.createElement("small");
    small.classList.add("text-muted");
    const cardText = document.createTextNode(
      `${global.search.type}` === "movie"
        ? `Release: ${result.release_date}`
        : `Aired: ${result.first_air_date}`
    );
    h5.appendChild(resultTitle);
    small.appendChild(cardText);
    p.appendChild(small);
    div1.appendChild(h5);
    div1.appendChild(p);
    a.appendChild(img);
    div.appendChild(a);
    div.appendChild(div1);

    document.querySelector(
      "#search-results-heading"
    ).innerHTML = ` <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>`;

    document.querySelector("#search-results").appendChild(div);
  });

  displayPagination();
};

// Create and Display Pagination for Search
const displayPagination = () => {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `;
  document.querySelector("#pagination").appendChild(div);

  // Next page
  document.querySelector("#next").addEventListener("click", async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
  // Prev page
  document.querySelector("#prev").addEventListener("click", async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  // Disapble Prev/Next button if on 1st/last page
  if (global.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }
  if (global.search.page === global.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }
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

// Display SLider Shows
const displayShowSlider = async () => {
  const { results } = await fetchAPIData("tv/airing_today");
  results.forEach((show) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");
    div.innerHTML = `
      <a href="movie-details.html?id=${show.id}">
        <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${show.vote_average} / 10
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
      delay: 4000,
      disableOnInteraction: false,
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

// Show Alert (to make a UI html alert for 3 sec. rather than JS alert)
const showAlert = (message, className) => {
  const alertEl = document.createElement("div");
  alertEl.classList.add("alert", className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertEl);

  setTimeout(() => {
    alertEl.remove();
  }, 3000);
};

// Add comas to numbers (like budget in movies)
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
      displayShowSlider();
      displayPopularShows();
      break;
    case "movie-details.html":
      displayMovieDetails();
      break;
    case "tv-details.html":
      displayShowDetails();
      break;
    case "search.html":
      search();
      break;
  }

  highLightActiveLnk();
};

document.addEventListener("DOMContentLoaded", init);
