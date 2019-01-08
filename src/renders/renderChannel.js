export default ({ channel }) => {
  const div = document.getElementById('articleLists');
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  const li = document.createElement('li');
  li.classList.add('list-group-item');
  channel.forEach(({ channelTitle, linkChannel, news }) => {
    li.innerHTML = `<div class="card">
      <div class="card-header"><h5 class="card-title">
        <a href="${linkChannel}" class="btn btn-primary">${channelTitle}</a>
        </h5>
      </div>
        ${news.map(({ titleText, descriptionText, linkText }) => `<div class="card-body"><a href="${linkText}" class="btn btn-primary">${titleText}</a>
<p class="card-text">${descriptionText}</p></div>`).join('')}
    </div>`;
    ul.appendChild(li);
    div.appendChild(ul);
  });
};
