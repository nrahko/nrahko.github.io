const pagesToSearch = [
  "index.html",
  "about.html",
  "blog.html",
  "consultation.html",
  "lowcostwebsite_article.html",
  "project_management.html",
  "retail_article.html",
  "spotlight_cloudflare.html",
  "spotlight_shopify.html",
  "tech_article.html",
];

// 1. Get the search term from the URL
const params = new URLSearchParams(window.location.search);
const keyword = params.get("query")?.toLowerCase() || "";

// 2. Search all pages
async function runSearch() {
  const results = [];

  for (const page of pagesToSearch) {
    try {
      const response = await fetch(page);
      const text = await response.text();

      // Check if keyword exists in the page
      if (text.toLowerCase().includes(keyword)) {
        const title = extractTitle(text) || page;
        results.push({ page, title });
      }
    } catch (err) {
      console.error("Error loading:", page, err);
    }
  }

  displayResults(results);
}

// 3. Extract <title> from HTML text
function extractTitle(html) {
  const match = html.match(/<title>(.*?)<\/title>/i);
  return match ? match[1] : null;
}

// 4. Display results on the page
function displayResults(matches) {
  const container = document.getElementById("results");

  if (!keyword) {
    container.innerHTML = "<p>No search term provided.</p>";
    return;
  }

  if (matches.length === 0) {
    container.innerHTML = `<p>No matches found for <strong>${keyword}</strong>.</p>`;
    return;
  }

  let html = `<p>Found <strong>${keyword}</strong> in:</p><ul>`;
  matches.forEach(result => {
    html += `
      <li>
        <a href="${result.page}">
          ${result.title}
        </a>
      </li>
    `;
  });
  html += "</ul>";

  container.innerHTML = html;
}

runSearch();