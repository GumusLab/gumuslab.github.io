const apiURL = "https://pub.orcid.org/v2.0/0000-0002-7364-2202/works";
const headers = {
  "Accept": "application/json"
};

const publicationInfoElement = document.getElementById("papers");
const monthDict = {
    '01': 'Jan',
    '02': 'Feb',
    // ... (rest of the months)
};

// Make the ORCID API request using the fetch API
fetch(apiURL, { headers })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const works = data.group || []; // Assuming "group" is the key in the response
    let content = "";

    works.forEach(work => {
      const workSummary = work["work-summary"][0] || {}; // Assuming "work-summary" is the key in the response
      const paperDoi = workSummary["external-ids"]["external-id"].find(obj => obj["external-id-type"] == "doi");

      if (paperDoi) {
        const paperDoiValue = paperDoi["external-id-value"];
        const crossrefApiUrl = `https://api.crossref.org/works/${paperDoiValue}`;

        // Make the Crossref API request
        fetch(crossrefApiUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
          })
          .then(crossrefData => {
            // Extract and use additional metadata from the Crossref API response
            const crossrefWork = crossrefData.message;
            const title = crossrefWork.title[0] || "Untitled";
            const publicationDate = crossrefWork.created["date-parts"][0];
            const year = publicationDate[0];
            const month = publicationDate[1];
            const day = publicationDate[2];
            const publisher = crossrefWork.publisher;

            // ... (similarly extract other metadata you need)

            // Build the content for the publication
            content += `<div class="paper">`;
            content += `<img src="https://media.springernature.com/lw685/springer-static/image/art%3A10.1038%2Fs41698-023-00354-3/MediaObjects/41698_2023_354_Fig2_HTML.png">`;
            content += `<div class="paper-content">`;
            content += `<a href="${crossrefWork.URL}" target="_blank">`;
            content += `<p class="paper-headline">${title}</p>`;
            content += `</a>`;
            content += `<p>${publisher} · ${day} ${monthDict[month]} ${year} · doi:${paperDoiValue}</p>`;
            content += `</div>`;
            content += `<h1>${year}</h1>`;
            content += `</div>`;
            
            // Update the content of the publicationInfoElement
            publicationInfoElement.innerHTML = content;
          })
          .catch(error => {
            console.error("Crossref API Error:", error);
          });
      }
    });
  })
  .catch(error => {
    console.error("ORCID API Error:", error);
  });
