// // Create a cache object for the initial API call
// const apiCache = {};

// // Create a cache object for the Crossref API calls
// const crossrefCache = {};

// const apiURL = "https://pub.orcid.org/v2.0/0000-0002-7364-2202/works";


// const publicationInfoElement = document.getElementById("papers");
// const loadingIndicator = document.getElementById("loading-indicator");

// const monthDict = {
//     '1':'Jan',
//     '2':'Feb',
//     '3':'March',
//     '4':'April',
//     '5':'May',
//     '6':'June',
//     '7':'July',
//     '8':'Aug',
//     '9':'Sept',
//     '10':'Oct',
//     '11':'Nov',
//     '12':'Dec',
// }

// function generateContentForWork(crossrefWork, paperDoiValue) {
//   // ... generate content for a work
//   // Return the content as a string
//   let content = ""
//   const title = crossrefWork.title[0] || "Untitled";
//   const publicationDate = crossrefWork.created["date-parts"][0];
//   const year = publicationDate[0];
//   const month = publicationDate[1];
//   const day = publicationDate[2];
//   const publisher = crossrefWork.publisher;
//   content += `<div class="paper">`;
//   content += `<img src="../static/DNA1.jpeg">`;
//   content += `<div class="paper-content">`;
//   content += `<a href="${crossrefWork.URL}" target="_blank">`;
//   content += `<p class="paper-headline">${title}</p>`;
//   content += `</a>`;
//   content += `<p>${publisher} · ${day} ${monthDict[month]} ${year} · doi:${paperDoiValue}</p>`;
//   content += `</div>`;
//   content += `<h1>${year}</h1>`;
//   content += `</div>`;

//   return content
// }

// // Define a function to fetch data from the API with memoization
// function fetchWithMemoization(url, headers, cache) {
//   if (cache[url]) {
//     // If the data is already in the cache, return it as a resolved promise
//     return Promise.resolve(cache[url]);
//   } else {
//     // If not in the cache, fetch the data and store it in the cache
//     return fetch(url, { headers })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`Request failed with status ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         // Store the data in the cache
//         cache[url] = data;
//         return data;
//       })
//       .catch((error) => {
//         console.error("API Error:", error);
//         throw error; // Propagate the error
//       });
//   }
// }

// // Make the initial API request using the fetchWithMemoization function
// fetchWithMemoization(apiURL, headers = {
//   "Accept": "application/json"
// }, apiCache)
//   .then((data) => {
//     // Handle the JSON data
//     const works = data.group || []; // Assuming "group" is the key in the response
//     let content = "";
//     const fetchPromises = works.map((work) => {
//       const workSummary = work["work-summary"][0] || {}; // Assuming "work-summary" is the key in the response
//       const paperDoi = workSummary["external-ids"]["external-id"].filter(
//         (obj) => obj["external-id-type"] == "doi"
//       );

//       if (paperDoi.length > 0) {
//         const paperDoiValue = paperDoi[0]["external-id-value"];
//         // const corsAnywhereUrl =
//         //   "https://radiant-stream-45835-7a55665f22ae.herokuapp.com/";
//         const corsAnywhereUrl = "https://cors-anywhere-iota-two.vercel.app/"
//         const crossrefApiUrl = `https://api.crossref.org/works/${paperDoiValue}`;
//         const fullCrossrefApiUrl = `${corsAnywhereUrl}${crossrefApiUrl}`;

//         // Use fetchWithMemoization to fetch the Crossref data
//         return fetchWithMemoization(
//           fullCrossrefApiUrl,
//           headers={},
//           crossrefCache
//         ).then((crossrefData) => {
//           const crossrefWork = crossrefData.message;
//           const publicationDate = crossrefWork.created["date-parts"][0];
//           const year = publicationDate[0];

//           return {
//             year,
//             content: generateContentForWork(crossrefWork, paperDoiValue),
//           };
//         });
//       }
//     });

//     const validFetchPromises = fetchPromises.filter((promise) => promise);
    
//     console.log(validFetchPromises);


//     if (validFetchPromises.length > 0) {
//       Promise.all(validFetchPromises)
//         .then((results) => {
//           console.log('Hola I am isnide')
//           loadingIndicator.style.display = "none";
//           // const validResults = results.filter((result) => result);
//           const sortedResults = results.sort((a, b) => b.year - a.year);

//           // Update the content with sorted data
//           sortedResults.forEach((result) => {
//             content += result.content;
//           });

//           // Set the innerHTML of publicationInfoElement
//           publicationInfoElement.innerHTML = content;
//         })
//         .catch((error) => {
//           console.error("Error:", error);
//         });
//     } else {
//       // Handle the case where no papers with DOIs were found
//       loadingIndicator.style.display = "none";
//       publicationInfoElement.innerHTML = "No papers with DOIs found.";
//     }
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });

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
            // const corsAnywhereUrl = "https://cors-anywhere.herokuapp.com/";
            const corsAnywhereUrl = "https://cors-proxy-server-rust.vercel.app/api"
            const crossrefApiUrl = `https://api.crossref.org/works/${paperDoiValue}`;
            const fullCrossrefApiUrl = `${corsAnywhereUrl}?url=${crossrefApiUrl}`;
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

