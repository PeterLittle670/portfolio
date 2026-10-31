import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);
let query = '';
// store the selected year (not its index) so it survives the pie being redrawn
let selectedYear = null;

// projects matching the search query
function getSearchedProjects() {
  return projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
}

// projects matching the search query AND the selected year
function renderFilteredProjects() {
  let filteredProjects = getSearchedProjects();
  if (selectedYear !== null) {
    filteredProjects = filteredProjects.filter(
      (project) => project.year === selectedYear,
    );
  }
  renderProjects(filteredProjects, projectsContainer, 'h2');
}

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  // clear up paths and legends
  let svg = d3.select('#projects-plot');
  svg.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  // update paths and legends
  newArcs.forEach((arc, idx) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
      .on('click', () => {
        let year = newData[idx].label;
        selectedYear = selectedYear === year ? null : year;

        highlightSelected();
        renderFilteredProjects();
      });
  });

  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });

  // re-apply the highlight after redrawing
  function highlightSelected() {
    svg
      .selectAll('path')
      .attr('class', (_, i) =>
        newData[i].label === selectedYear ? 'selected' : '',
      );

    legend
      .selectAll('li')
      .attr('class', (_, i) =>
        newData[i].label === selectedYear
          ? 'legend-item selected'
          : 'legend-item',
      );
  }

  highlightSelected();
}

// Call this function on page load
renderPieChart(projects);

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  // update query value
  query = event.target.value;
  // re-render projects with both filters, and the pie with the searched projects
  renderFilteredProjects();
  renderPieChart(getSearchedProjects());
});
