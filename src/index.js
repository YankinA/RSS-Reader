import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import validator from 'validator';
import axios from 'axios';
import WatchJS from 'melanke-watchjs';
import parseRss from './parser';
import { renderListNews, renderValidatorInput, renderDisabledSabmit } from './renders';

const state = {
  articleLinks: new Set(),
  articleData: [],
  disabled: false,
  valid: true,
};

const inputForLink = document.getElementById('inputForLink');
inputForLink.addEventListener('keyup', () => {
  if (inputForLink.value === '') {
    state.valid = false;
    state.disabled = true;
  } else if (!validator.isURL(inputForLink.value)) {
    state.valid = false;
    state.disabled = true;
  } else if (state.articleLinks.has(inputForLink.value)) {
    state.valid = false;
    state.disabled = true;
  } else {
    state.valid = true;
    state.disabled = false;
  }
});

const proxyLink = 'https://crossorigin.me/';
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  state.articleLinks.add(inputForLink.value);
  axios.get(`${proxyLink}${inputForLink.value}`, { headers: { 'Access-Control-Allow-Origin': '*' } }).then(
    response => parseRss(response.data),
  ).then(response => [...state.articleData, ...response]).catch(() => {
    state.disabled = true;
  });
});

WatchJS.watch(state, () => renderValidatorInput(state));
WatchJS.watch(state, () => renderDisabledSabmit(state));
WatchJS.watch(state, () => renderListNews(state));
