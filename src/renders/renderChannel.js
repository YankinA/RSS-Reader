const modal = `<div class="modal" id="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 id="modalTitle"></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
         x
        </button>
      </div>
      <div class="modal-body">
      <p id="descriptionModal"></ p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>`;
export default ({ channel }) => {
  const div = document.getElementById('articleLists');
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  const li = document.createElement('li');
  li.classList.add('list-group-item');
  channel.forEach(({ channelTitle, linkChannel, news }) => {
    li.innerHTML = `<div class="card">
      <div class="card-header"><h5 class="card-title">
        <a href="${linkChannel}" class="btn btn-info">${channelTitle.toUpperCase()}</a>
        </h5>
      </div>
        ${news.map(({ titleText, descriptionText, linkText }) => `<div class="card-body"><a href="${linkText}" class="btn btn-outline-primary btn-sm">${titleText}</a>
<p class="card-text">${descriptionText}</p>
</div><button class="btn-myModal btn btn-outline-primary btn-sm" type="button" data-toggle="modal" data-description="${descriptionText}", data-target="#modal">Open news</button>`).join('')}
    </div>`;
    ul.appendChild(li);
    div.appendChild(ul);
    const divModal = document.createElement('div');
    divModal.innerHTML = modal;
    div.appendChild(divModal);
  });
};
