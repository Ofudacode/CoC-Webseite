let daten = {};

window.onload = async function () {
  const res = await fetch('data.json');
  daten = await res.json();

  setupDropdown("truppen", daten.truppen);
  setupDropdown("zauber", daten.zauber);
  setupDropdown("helden", daten.helden);

  // Dark Mode Zustand laden
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }

  document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
  });
};

function setupDropdown(id, datenArray) {
  const select = document.getElementById(id);
  const anzeige = document.getElementById(id + "-anzeige");

  const defaultOption = document.createElement("option");
  defaultOption.text = "-- auswählen --";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  select.appendChild(defaultOption);

  datenArray.forEach((einheit, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = einheit.name;
    select.appendChild(option);
  });

  select.addEventListener("change", function () {
    const einheit = datenArray[this.value];

    anzeige.innerHTML = `
      <h4>${einheit.name}</h4>
      <img src="${einheit.bild}" alt="${einheit.name}">
      <input type="number" min="0" placeholder="Anzahl" oninput="this.value=this.value.replace(/[^\\d]/g,'')">
      <br>
      <button onclick="uebertragen('${id}', ${this.value})">Übertragen</button>
    `;
  });
}

function uebertragen(kategorie, index) {
  const einheit = daten[kategorie][index];
  const anzeige = document.getElementById(kategorie + "-anzeige");
  const input = anzeige.querySelector("input");
  const menge = parseInt(input.value);

  if (!menge || menge <= 0) {
    alert("Bitte eine gültige Anzahl eingeben.");
    return;
  }

  const ziel = document.getElementById("armee");

  const einheitDiv = document.createElement("div");
  einheitDiv.className = "armee-einheit";
  einheitDiv.innerHTML = `
    <img src="${einheit.bild}" alt="${einheit.name}">
    <strong>${einheit.name}</strong><br>
    Anzahl: ${menge}
  `;

  ziel.appendChild(einheitDiv);

  input.value = "";
}
