import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import validator from 'validator';
import axios from 'axios';
import WatchJS from 'melanke-watchjs';
import state from './state';
import { renderChannel, renderValidatorInput, renderDisabledSabmit } from './renders';

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

const parseRss = (XMLdata, linkChannel) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(XMLdata, 'application/xml');
  const items = doc.querySelectorAll('item');
  const channel = doc.querySelector('channel');
  const channelTitle = channel.querySelector('title').textContent;
  return {
    channelTitle,
    linkChannel,
    news: [...items].map(item => ({
      titleText: item.querySelector('title').textContent,
      descriptionText: item.querySelector('description').textContent,
      linkText: item.querySelector('link').textContent,
    })),
  };
};

const proxyLink = 'https://cors-anywhere.herokuapp.com/';
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  state.articleLinks.add(inputForLink.value);
  axios.get(`${proxyLink}${inputForLink.value}`, { headers: { 'Access-Control-Allow-Origin': '*' } }).then(
    response => parseRss(response.data, inputForLink.value),
  ).then((data) => {
    state.channel = [...state.channel, data];
    return state.channel;
  }).then(() => {
    state.disabled = false;
    inputForLink.value = '';
  })
    .catch((err) => {
      state.disabled = true;
      console.log(err);
    });
});

WatchJS.watch(state, () => renderValidatorInput(state));
WatchJS.watch(state, () => renderDisabledSabmit(state));
WatchJS.watch(state, () => renderChannel(state));
