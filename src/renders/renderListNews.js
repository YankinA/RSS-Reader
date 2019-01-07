export default ({ articleData }) => {
  const div = document.getElementById('articleLists');
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  const li = document.createElement('li');
  li.classList.add('list-group-item');
  console.log('render.js');
  articleData.forEach(({ titeleText, descriptionText, linkText }) => {
    li.innerHTML = `<div class="card">
      <div class="card-header">
        <a href="${linkText}" class="btn btn-primary">${titeleText}</a>
      </div>
      <div class="card-body">
        <p class="card-text">${descriptionText}</p>
     </div>
    </div>`;
    ul.appendChild(li);
    div.appendChild(ul);
  });
};
