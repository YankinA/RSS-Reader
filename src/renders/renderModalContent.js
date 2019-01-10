export default ({ modal }) => {
  const modalLabel = document.getElementById('descriptionModal');
  modalLabel.textContent = modal.description;
};
