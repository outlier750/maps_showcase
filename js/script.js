document.addEventListener('DOMContentLoaded', function() {
    const mapsContainer = document.getElementById('maps-grid');

    // Parse JSON data embedded in the HTML
    const mapDataElement = document.getElementById('map-data');
    const mapData = JSON.parse(mapDataElement.textContent);
    const mapsPath = './maps/';
    function generateMapTiles(maps) {
        // Clear existing tiles
        mapsContainer.innerHTML = '';
        // <a href="${map.mirror}">Mirror</a>
        maps.forEach(map => {
            const mapTile = document.createElement('div');
            mapTile.classList.add('map-tile');
            mapTile.innerHTML = `
                <img src="${mapsPath + map.path + '/' + map.image}" alt="${map.name}">
                <div class="map-info">
                    <h2>${map.name}</h2>
                    <p>Version: ${map.version}</p>
                    <div class="map-links">
                        <a href="#" data-download-url="${map.download}" class="download-link">Download</a>
                        <a href="#" data-download-url="${map.mirror}" class="download-link">Mirror</a>
                        </div>
                     <a href="${mapsPath + map.path + '/' + map.history}">View History</a>
                    <div class="map-embed">
                        <iframe src="${map.osmEmbed}" style="border: 0;" width="100%" height="150"></iframe>
                    </div>
                </div>
            `;
            mapsContainer.appendChild(mapTile);
        });

        // Attach event listeners for download links
        const downloadLinks = document.querySelectorAll('.download-link');
        downloadLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const url = this.getAttribute('data-download-url');
                fetch(url)
                    .then(response => response.blob())
                    .then(blob => {
                        const downloadUrl = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = downloadUrl;
                        a.download = url.split('/').pop(); // Extract the file name from the URL
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        URL.revokeObjectURL(downloadUrl);
                    })
                    .catch(error => console.error('Download failed:', error));
            });
        });
    }

    // Initial display of all maps
    generateMapTiles(mapData.maps);

    // Search functionality
    const searchInput = document.getElementById('map-search');
    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        const filteredMaps = mapData.maps.filter(map => map.name.toLowerCase().includes(query));
        generateMapTiles(filteredMaps);
    });

    // Theme toggle functionality
    const toggleButton = document.getElementById('mode');
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    document.body.classList.add(currentTheme);
    toggleButton.checked = currentTheme === 'light';

    toggleButton.addEventListener('change', () => {
        const newTheme = toggleButton.checked ? 'light' : 'dark';
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(newTheme);
        localStorage.setItem('theme', newTheme);
    });
});
