(function () {
  "use strict";

  /* =====================================================================
     MAP MARKERS
     Edit this array once you send over your hand-drawn map. x/y are
     percentages (0-100) from the top-left of the map image, so pins
     stay correctly placed no matter the image size.
     Swap the placeholder image by changing #map-frame's background,
     e.g. give it a real <img> or set map-frame's CSS background-image.
     ===================================================================== */
  var MARKERS = [
    { x: 42, y: 55, label: "Núnúia City", desc: "The capital, home to the Grand Warren Hall." },
    { x: 68, y: 28, label: "Laurel Coast", desc: "Cliffside villages and the Wreath Festival route." },
    { x: 22, y: 72, label: "Green Hollow", desc: "Forests, farmland, and Núnúia's best cheese." }
  ];

  function initMap() {
    var frame = document.getElementById("map-frame");
    var legend = document.getElementById("map-legend");
    if (!frame || !legend) return;

    var tooltip = document.createElement("div");
    tooltip.className = "map-tooltip";
    frame.appendChild(tooltip);

    MARKERS.forEach(function (marker) {
      var pin = document.createElement("button");
      pin.type = "button";
      pin.className = "map-pin";
      pin.style.left = marker.x + "%";
      pin.style.top = marker.y + "%";
      pin.setAttribute("aria-label", marker.label);
      pin.innerHTML =
        '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M12 0C7 0 3 4 3 9c0 7 9 15 9 15s9-8 9-15c0-5-4-9-9-9z" fill="#1f4b3f"/>' +
        '<circle cx="12" cy="9" r="3.4" fill="#faf7ee"/>' +
        "</svg>";

      function showTooltip() {
        tooltip.innerHTML = "<strong>" + marker.label + "</strong>" + marker.desc;
        tooltip.style.left = marker.x + "%";
        tooltip.style.top = marker.y + "%";
        tooltip.classList.add("is-visible");
      }
      function hideTooltip() {
        tooltip.classList.remove("is-visible");
      }

      pin.addEventListener("mouseenter", showTooltip);
      pin.addEventListener("focus", showTooltip);
      pin.addEventListener("mouseleave", hideTooltip);
      pin.addEventListener("blur", hideTooltip);
      pin.addEventListener("click", showTooltip);

      frame.appendChild(pin);

      var li = document.createElement("li");
      li.innerHTML =
        '<span class="legend-dot"></span><div><h4>' +
        marker.label +
        "</h4><p>" +
        marker.desc +
        "</p></div>";
      legend.appendChild(li);
    });
  }

  /* =====================================================================
     LANGUAGE SWITCHER
     English text lives directly in index.html and is captured below as
     the source of truth. French is hand-translated in TRANSLATIONS_FR.
     Núnúise is generated live by swapping in any words that exist in
     the official dictionary (nunuise.netlify.app/dictionary.json) —
     since it's a small, growing language, words with no entry yet are
     simply left in English.
     ===================================================================== */
  var TRANSLATIONS_FR = {
    "nav-home": "Accueil",
    "nav-news": "Actualités",
    "nav-culture": "Culture",
    "nav-map": "Carte",
    "hero-eyebrow": "Union Européenne · Fondé aujourd'hui",
    "hero-title": "Bienvenue au Royaume de Núnúia",
    "hero-sub": "Un petit royaume plein de charme. Venez pour le littoral, restez pour le fromage, repartez avec au moins trois mots de núnúise.",
    "hero-cta-culture": "Découvrir la culture",
    "hero-cta-news": "Dernières actualités",
    "flag-caption": "Drapeau du Royaume",
    "news-eyebrow": "Restez informé",
    "news-heading": "Actualités et annonces",
    "news-1-title": "Dates du Festival de la Couronne annoncées",
    "news-1-body": "Le Festival annuel du Laurier et du Lapin revient cet automne, avec des défilés sur la route côtière et des échantillons de fromage gratuits pour tous les visiteurs.",
    "news-2-title": "Nouveau sentier côtier ouvert",
    "news-2-body": "Un nouveau chemin relie désormais le port à la vieille ville, avec des points de vue sur la Côte du Laurier.",
    "news-3-title": "Le dictionnaire núnúise continue de grandir",
    "news-3-body": "Notre dictionnaire national a dépassé les 200 mots. Essayez le sélecteur de langue ci-dessous pour le voir en action.",
    "read-more": "Lire la suite →",
    "culture-eyebrow": "À voir et à faire",
    "culture-heading": "Tourisme et culture",
    "culture-1-title": "L'emblème national",
    "culture-1-body": "Notre blason — un lapin reposant dans une couronne de laurier — apparaît partout, des passeports aux lampadaires. Repérez-le dans la capitale.",
    "culture-2-title": "La Côte du Laurier",
    "culture-2-body": "Villages en falaise, criques tranquilles, et les plus beaux couchers de soleil du pays. Prenez un manteau — le vent a du caractère.",
    "culture-3-title": "La cuisine núnúienne",
    "culture-3-body": "Ne partez pas sans goûter le pain, le fromage et les frites locaux — trois mots que vous apprendrez en núnúise avant même « bonjour ».",
    "culture-4-title": "La langue núnúise",
    "culture-4-body": "Une langue jeune et faite maison, qui grandit mot par mot. Passez cette page en núnúise ci-dessous pour l'entendre en action.",
    "map-eyebrow": "Trouvez votre chemin",
    "map-heading": "Explorer la carte",
    "map-intro": "Une carte dessinée à la main du Royaume arrive bientôt. En attendant, voici un aperçu de la façon dont les régions seront indiquées.",
    "map-placeholder": "Votre carte dessinée à la main apparaîtra ici bientôt.",
    "footer-note": "Le Royaume de Núnúia est un pays fictif, créé pour le plaisir. Ce n'est pas un vrai gouvernement, et aucun fromage n'a été blessé pendant la création de ce site.",
    "lang-label": "Langue :"
  };

  var DICTIONARY_URL = "https://nunuise.netlify.app/dictionary.json";
  var dictionary = null;
  var dictionaryPromise = null;

  function loadDictionary() {
    if (dictionaryPromise) return dictionaryPromise;
    dictionaryPromise = fetch(DICTIONARY_URL)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        dictionary = data;
        return data;
      })
      .catch(function (err) {
        console.warn("Núnúise dictionary unavailable, falling back to English words.", err);
        dictionary = {};
        return dictionary;
      });
    return dictionaryPromise;
  }

  function translateWordNunuise(word, dict) {
    var stripped = word.replace(/[^A-Za-z']/g, "");
    if (!stripped) return word;
    var lower = stripped.toLowerCase();
    var match = dict[lower];
    if (!match) return word;

    // Preserve the original capitalisation style where possible.
    if (stripped[0] === stripped[0].toUpperCase() && stripped[0] !== stripped[0].toLowerCase()) {
      match = match.charAt(0).toUpperCase() + match.slice(1);
    }
    return word.replace(stripped, match);
  }

  function translateTextNunuise(text, dict) {
    return text
      .split(/(\s+)/)
      .map(function (token) {
        if (/^\s+$/.test(token)) return token;
        return translateWordNunuise(token, dict);
      })
      .join("");
  }

  function captureSourceStrings() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (!el.dataset.en) {
        el.dataset.en = el.textContent.trim();
      }
    });
  }

  function applyLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.dataset.i18n;
      var source = el.dataset.en;

      if (lang === "en") {
        el.textContent = source;
      } else if (lang === "fr") {
        el.textContent = TRANSLATIONS_FR[key] || source;
      } else if (lang === "nu") {
        el.textContent = translateTextNunuise(source, dictionary || {});
      }
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.dataset.lang === lang);
    });

    document.documentElement.lang = lang === "nu" ? "en" : lang;

    try {
      localStorage.setItem("nunuia-lang", lang);
    } catch (err) {
      /* localStorage unavailable — language choice just won't persist */
    }
  }

  function setLanguage(lang) {
    if (lang === "nu" && !dictionary) {
      loadDictionary().then(function () { applyLanguage("nu"); });
      // Apply immediately with an empty dictionary so the UI responds right away;
      // it will refresh with real translations once the fetch resolves.
      applyLanguage("nu");
    } else {
      applyLanguage(lang);
    }
  }

  function initLanguageSwitcher() {
    captureSourceStrings();

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLanguage(btn.dataset.lang);
      });
    });

    var saved = null;
    try {
      saved = localStorage.getItem("nunuia-lang");
    } catch (err) {
      /* ignore */
    }

    if (saved === "fr" || saved === "nu") {
      loadDictionary().then(function () {
        setLanguage(saved);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMap();
    initLanguageSwitcher();
  });
})();
