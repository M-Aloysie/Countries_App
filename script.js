document.addEventListener('DOMContentLoaded', function () {
    const countryList = document.getElementById('country-list');
    const countryInfo = document.getElementById('country-info');
    const mapDiv = document.getElementById('map');
    const searchInput = document.getElementById('search-input');

    let countriesData = []; // To store the fetched countries data

    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(countries => {
            countriesData = countries; // Store the data for future search

            const sortedCountries = countries.sort((a, b) => {
                const nameA = a.name.common.toUpperCase();
                const nameB = b.name.common.toUpperCase();
                return nameA.localeCompare(nameB);
            });

            sortedCountries.forEach(country => {
                const countryName = country.name.common;
                const li = document.createElement('li');
                li.textContent = countryName;
                li.addEventListener('click', () => {
                    displayCountryInfo(country);
                });
                countryList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

    function displayCountryInfo(country) {
        const countryData = country;
        const countryInfoHTML = `
            <h3>${countryData.name.common}</h3>
            <p>Languages: ${Object.values(countryData.languages).join(', ')}</p>
            <p>Population: ${countryData.population}</p>
            <p>Continent: ${countryData.region}</p>
        `;
        countryInfo.innerHTML = countryInfoHTML;

        // Display the location on the map
        const location = countryData.latlng;
        if (location) {
            const map = new google.maps.Map(mapDiv, {
                center: { lat: location[0], lng: location[1] },
                zoom: 6
            });
            const marker = new google.maps.Marker({
                position: { lat: location[0], lng: location[1] },
                map: map
            });
        } else {
            mapDiv.innerHTML = 'Location data not available for this country.';
        }
    }

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCountries = countriesData.filter(country => country.name.common.toLowerCase().includes(searchTerm));
        
        countryList.innerHTML = ''; // Clear the existing list

        filteredCountries.forEach(country => {
            const countryName = country.name.common;
            const li = document.createElement('li');
            li.textContent = countryName;
            li.addEventListener('click', () => {
                displayCountryInfo(country);
            });
            countryList.appendChild(li);
        });
    });
});




