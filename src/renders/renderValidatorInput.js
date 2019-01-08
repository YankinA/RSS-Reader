export default ({ inputProcess }) => {
  const inputForLink = document.getElementById('inputForLink');
  inputForLink.value = inputProcess.value;
  if (inputProcess.valid) {
    inputForLink.classList.remove('is-invalid');
    inputForLink.classList.add('is-valid');
  } else {
    inputForLink.classList.remove('is-valid');
    inputForLink.classList.add('is-invalid');
  }
};
