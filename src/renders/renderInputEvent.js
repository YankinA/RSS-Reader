export default ({ inputProcess }) => {
  const inputForLink = document.getElementById('inputForLink');
  inputForLink.value = inputProcess.value;
  inputForLink.disabled = inputProcess.disabledInput;
  if (inputProcess.valid === '') {
    inputForLink.classList.remove('is-valid');
    inputForLink.classList.remove('is-invalid');
  } else if (inputProcess.valid === 'valid') {
    inputForLink.classList.remove('is-invalid');
    inputForLink.classList.add('is-valid');
  } else if (inputProcess.valid === 'invalid') {
    inputForLink.classList.remove('is-valid');
    inputForLink.classList.add('is-invalid');
  }
};
