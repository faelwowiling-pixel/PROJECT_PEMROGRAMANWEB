document.addEventListener("DOMContentLoaded", function () {
  /* ANIMASI REVEAL */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => obs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("reveal-visible"));
  }

  /* POPUP MATERI */
  const modalBackdrop = document.createElement("div");
  modalBackdrop.className = "material-modal-backdrop";
  modalBackdrop.innerHTML = `
    <div class="material-modal-dialog">
      <button class="material-modal-close" type="button" aria-label="Tutup">&times;</button>
      <h2 id="material-modal-title"></h2>
      <div class="material-modal-body" id="material-modal-body"></div>
    </div>
  `;
  document.body.appendChild(modalBackdrop);

  const modalTitleEl = document.getElementById("material-modal-title");
  const modalBodyEl = document.getElementById("material-modal-body");
  const modalCloseBtn = modalBackdrop.querySelector(".material-modal-close");

  function openMaterialModal(title, targetId) {
    const src = document.getElementById(targetId);
    if (!src) return;

    modalTitleEl.textContent = title;
    modalBodyEl.innerHTML = src.innerHTML;
    modalBackdrop.classList.add("is-open");
  }

  function closeMaterialModal() {
    modalBackdrop.classList.remove("is-open");
  }

  modalCloseBtn.addEventListener("click", closeMaterialModal);
  modalBackdrop.addEventListener("click", function (e) {
    if (e.target === modalBackdrop) closeMaterialModal();
  });

  document.querySelectorAll(".material-more-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const title = this.dataset.title || "";
      const target = this.dataset.target || "";
      openMaterialModal(title, target);
    });
  });

  /* PETA LEAFLET */
  const mapContainer = document.getElementById("map-papua");
  if (mapContainer && typeof L !== "undefined") {
    const map = L.map("map-papua", {
      zoomControl: true
    }).setView([-4.0, 137.0], 5.3);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution:
        'Leaflet | © OpenStreetMap contributors'
    }).addTo(map);

    /* DATA LOKASI BERDASARKAN KAJIAN */
    const suryaLocations = [
      {
        name: "Skouw, Kota Jayapura",
        coords: [-2.55, 140.78],
        subtitle: "Lokasi contoh potensi energi surya berdasarkan kajian global dan nasional.",
        text:
          "Wilayah perbatasan di utara Jayapura. Data radiasi global harian dari atlas surya dan ringkasan Kementerian ESDM menunjukkan nilai sekitar 4,8 sampai 5 kilowatt jam per meter persegi per hari, sesuai untuk PLTS atap dan penerangan kawasan.",
        sourceUrl: "https://globalsolaratlas.info/map?c=-2.55,140.78,9",
        sourceLabel: "Global Solar Atlas dan Technology Data for the Indonesian Power Sector."
      },
      {
        name: "Merauke (Rawa Biru dan sekitarnya)",
        coords: [-8.52, 140.31],
        subtitle: "Lokasi contoh potensi energi surya dari kajian PLTS terapung.",
        text:
          "Kajian PLTS terapung di area Rawa Biru melaporkan radiasi global harian sekitar 4,6 kilowatt jam per meter persegi per hari. Nilai ini mendukung pengembangan PLTS skala kecil sampai menengah untuk suplai energi di Merauke dan sekitarnya.",
        sourceUrl: "https://ojs.uho.ac.id/index.php/jemt/article/view/22891",
        sourceLabel: "Karim dkk. Floating photovoltaic potential in the Rawa Biru Area of Merauke."
      }
    ];

    const anginLocations = [
      {
        name: "Kabupaten Kaimana",
        coords: [-3.66, 133.74],
        subtitle: "Lokasi contoh potensi energi angin di Papua Barat Daya.",
        text:
          "Analisa potensi energi terbarukan di Kabupaten Kaimana menunjukkan kecepatan angin rata rata sekitar 4,6 sampai 4,7 meter per detik. Kelas angin ini cocok untuk turbin angin skala kecil dan menengah di pesisir maupun bukit yang cukup terbuka.",
        sourceUrl: "https://repository.unhas.ac.id/id/eprint/5331/",
        sourceLabel: "Analisa Potensi Energi Terbarukan di Kabupaten Kaimana."
      },
      {
        name: "Biak Numfor",
        coords: [-1.00, 136.08],
        subtitle: "Lokasi contoh kombinasi energi surya dan angin.",
        text:
          "Dokumen iklim Kabupaten Biak Numfor mencatat kecepatan angin rata rata sekitar 3,2 knot atau sekitar 1,6 meter per detik dengan paparan surya yang baik. Kondisi ini membuka peluang sistem hybrid surya angin untuk kebutuhan listrik pulau.",
        sourceUrl: "https://papua.go.id/potensi-daerah/iklim-dan-topografi-kabupaten-biak-numfor",
        sourceLabel: "Profil iklim dan topografi Kabupaten Biak Numfor."
      }
    ];

    const suryaLayer = L.layerGroup().addTo(map);
    const anginLayer = L.layerGroup().addTo(map);

    function makePopupHtml(loc) {
      return `
        <div class="map-popup">
          <h3>${loc.name}</h3>
          <p class="map-popup-subtitle">${loc.subtitle}</p>
          <p class="map-popup-text">${loc.text}</p>
          <p class="map-popup-source">
            <strong>Sumber data:</strong>
            <a href="${loc.sourceUrl}" target="_blank" rel="noopener">${loc.sourceLabel}</a>
          </p>
        </div>
      `;
    }

    suryaLocations.forEach((loc) => {
      L.circleMarker(loc.coords, {
        radius: 8,
        color: "#ea580c",
        weight: 2,
        fillColor: "#fb923c",
        fillOpacity: 0.9
      })
        .bindPopup(makePopupHtml(loc))
        .addTo(suryaLayer);
    });

    anginLocations.forEach((loc) => {
      L.circleMarker(loc.coords, {
        radius: 8,
        color: "#0284c7",
        weight: 2,
        fillColor: "#38bdf8",
        fillOpacity: 0.9
      })
        .bindPopup(makePopupHtml(loc))
        .addTo(anginLayer);
    });

    /* UPDATE DATA RINGKAS */
    const summarySurya = document.getElementById("summary-surya");
    const summaryAngin = document.getElementById("summary-angin");
    const summaryTotal = document.getElementById("summary-total");

    if (summarySurya) summarySurya.textContent = suryaLocations.length.toString();
    if (summaryAngin) summaryAngin.textContent = anginLocations.length.toString();
    if (summaryTotal)
      summaryTotal.textContent = (suryaLocations.length + anginLocations.length).toString();

    /* KONTROL LEGENDA DENGAN FILTER */
    const legendControl = L.control({ position: "topright" });

    legendControl.onAdd = function () {
      const container = L.DomUtil.create("div", "map-legend");

      container.innerHTML = `
        <button type="button" class="legend-toggle-btn" aria-label="Tampilkan legenda">
          <span class="legend-toggle-icon"></span>
          <span class="legend-toggle-label">Legenda</span>
        </button>
        <div class="map-legend-panel map-legend-panel-hidden">
          <div class="map-legend-title">Potensi energi terbarukan</div>

          <div class="map-legend-section-title">Jenis titik</div>
          <ul class="map-legend-list">
            <li class="map-legend-item">
              <span class="map-legend-dot solar"></span>
              <span>Lokasi contoh potensi energi surya</span>
            </li>
            <li class="map-legend-item">
              <span class="map-legend-dot wind"></span>
              <span>Lokasi contoh potensi energi angin</span>
            </li>
          </ul>

          <div class="map-legend-section-title">Filter tampilan</div>
          <label class="legend-filter-label" id="legend-label-surya">
            <input type="checkbox" class="legend-filter-input" id="legend-filter-surya" checked>
            Tampilkan titik surya
          </label>
          <label class="legend-filter-label" id="legend-label-angin">
            <input type="checkbox" class="legend-filter-input" id="legend-filter-angin" checked>
            Tampilkan titik angin
          </label>

          <p class="map-legend-section-title" style="margin-top:8px;">Catatan peta</p>
          <p class="map-popup-source">
            Garis batas berasal dari layer dasar OpenStreetMap.
            Simbol bersifat ilustratif dan dapat disesuaikan dengan data resmi bila tersedia.
          </p>
        </div>
      `;

      L.DomEvent.disableClickPropagation(container);
      return container;
    };

    legendControl.addTo(map);

    const legendContainer = legendControl.getContainer();
    const legendToggleBtn = legendContainer.querySelector(".legend-toggle-btn");
    const legendPanel = legendContainer.querySelector(".map-legend-panel");
    const filterSurya = legendContainer.querySelector("#legend-filter-surya");
    const filterAngin = legendContainer.querySelector("#legend-filter-angin");
    const labelSurya = legendContainer.querySelector("#legend-label-surya");
    const labelAngin = legendContainer.querySelector("#legend-label-angin");

    if (legendToggleBtn && legendPanel) {
      legendToggleBtn.addEventListener("click", function () {
        legendPanel.classList.toggle("map-legend-panel-hidden");
      });
    }

    if (filterSurya) {
      filterSurya.addEventListener("change", function () {
        if (this.checked) {
          map.addLayer(suryaLayer);
          if (labelSurya) labelSurya.classList.remove("legend-off");
        } else {
          map.removeLayer(suryaLayer);
          if (labelSurya) labelSurya.classList.add("legend-off");
        }
      });
    }

    if (filterAngin) {
      filterAngin.addEventListener("change", function () {
        if (this.checked) {
          map.addLayer(anginLayer);
          if (labelAngin) labelAngin.classList.remove("legend-off");
        } else {
          map.removeLayer(anginLayer);
          if (labelAngin) labelAngin.classList.add("legend-off");
        }
      });
    }
  }
});