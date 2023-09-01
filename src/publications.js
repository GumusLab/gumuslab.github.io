// API URL
const apiURL = "https://pub.orcid.org/v2.0/0000-0002-7364-2202/works";
// const crossrefApiUrl = `https://api.crossref.org/works/${doi}`;

// Set headers to request JSON response
const headers = {
  "Accept": "application/json"
};

const publicationInfoElement = document.getElementById("papers");
const loadingIndicator = document.getElementById("loading-indicator");

const monthDict = {
    '1':'Jan',
    '2':'Feb',
    '3':'March',
    '4':'April',
    '5':'May',
    '6':'June',
    '7':'July',
    '8':'Aug',
    '9':'Sept',
    '10':'Oct',
    '11':'Nov',
    '12':'Dec',
}

function generateContentForWork(crossrefWork, paperDoiValue) {
    // ... generate content for a work
    // Return the content as a string
    let content = ""
    const title = crossrefWork.title[0] || "Untitled";
    const publicationDate = crossrefWork.created["date-parts"][0];
    const year = publicationDate[0];
    const month = publicationDate[1];
    const day = publicationDate[2];
    const publisher = crossrefWork.publisher;
    content += `<div class="paper">`;
    content += `<img src="../static/DNA1.jpeg">`;
    content += `<div class="paper-content">`;
    content += `<a href="${crossrefWork.URL}" target="_blank">`;
    content += `<p class="paper-headline">${title}</p>`;
    content += `</a>`;
    content += `<p>${publisher} · ${day} ${monthDict[month]} ${year} · doi:${paperDoiValue}</p>`;
    content += `</div>`;
    content += `<h1>${year}</h1>`;
    content += `</div>`;

    return content
}

// Make the API request using the fetch API
fetch(apiURL, { headers })
  .then(response => {
    loadingIndicator.style.display = "block";

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Handle the JSON data
    const works = data.group || []; // Assuming "group" is the key in the response
    let content = ""
    const fetchPromises = works.map(work => {
        const workSummary = work["work-summary"][0] || {}; // Assuming "work-summary" is the key in the response
        const paperDoi = workSummary["external-ids"]["external-id"].filter(obj=>obj["external-id-type"] == "doi")


        if(paperDoi.length > 0){
            const paperDoiValue = paperDoi[0]["external-id-value"];
            const corsAnywhereUrl = "http://cors-anywhere.herokuapp.com/";
            const crossrefApiUrl = `https://api.crossref.org/works/${paperDoiValue}`;
            const fullCrossrefApiUrl = `${corsAnywhereUrl}${crossrefApiUrl}`;
            return fetch(fullCrossrefApiUrl)
                .then(response => {
                if (!response.ok) {
                  throw new Error(`Request failed with status ${response.status}`);
                }
                return response.json();
              }).then(crossrefData => {
                const crossrefWork = crossrefData.message;
                const publicationDate = crossrefWork.created["date-parts"][0];
                const year = publicationDate[0];
                
                return {
                    year,
                    content:generateContentForWork(crossrefWork, paperDoiValue)
                };

              })
              .catch(error => {
                console.error("Crossref API Error:", error);
              });
        }
  
      });

    Promise.all(fetchPromises)
        .then(results => {
        
        loadingIndicator.style.display = "none";
        const validResults = results.filter(result => result);

        const sortedResults = validResults.sort((a, b) => b.year - a.year);

        // Update the content with sorted data
        sortedResults.forEach(result => {
            content += result.content;
        });

        // Set the innerHTML of publicationInfoElement
        publicationInfoElement.innerHTML = content;
    })
    .catch(error => {
        console.error("Error:", error);
    });

  })
  .catch(error => {
    console.error("Error:", error);
  });




   // content += "<div class=paper><img src=https://media.springernature.com/lw685/springer-static/image/art%3A10.1038%2Fs41698-023-00354-3/MediaObjects/41698_2023_354_Fig2_HTML.png?>"
            // const paperSrc = paperDoi[0]["external-id-url"] ? paperDoi[0]["external-id-url"].value:null;
    
            // const title = workSummary.title.title.value || "Untitled"; // Assuming "title" is the key in the work summary
            // const publicationDay = workSummary["publication-date"].day ? workSummary["publication-date"].day.value:null;
            // const publicationMonth = workSummary["publication-date"].month ? monthDict[workSummary["publication-date"].month.value]:null;
            // const publicationYear = workSummary["publication-date"].year ?  workSummary["publication-date"].year.value:null;
            // const articleType = workSummary.type;
    
            // content += 
            // `<div class=paper-content>
            // <a href=${paperSrc} target="_blank">
            // <p class="paper-headline">${title}</p>
            // </a>`
            // content += `<p>${articleType}   ·   ${publicationDay} ${publicationMonth} ${publicationYear}   ·   doi:${paperDoiValue}</p></div>`
            // content += `<h1>${publicationYear}</h1></div>`
