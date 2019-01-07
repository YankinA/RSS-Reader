export default ({ valid }) => {
  const inputForLink = document.getElementById('inputForLink');
  if (valid) {
    inputForLink.classList.remove('is-invalid');
    inputForLink.classList.add('is-valid');
  } else {
    inputForLink.classList.remove('is-valid');
    inputForLink.classList.add('is-invalid');
  }
};
