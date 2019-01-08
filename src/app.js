import validator from 'validator';
import axios from 'axios';
import WatchJS from 'melanke-watchjs';
import $ from 'jquery';

import {
  renderChannel, renderValidatorInput, renderDisabledSabmit,
} from './renders';

export default () => {
  const state = {
    articleLinks: new Set(),
    channel: [],
    inputProcess: {
      disabled: false,
      valid: true,
      value: '',
    },
  };
  const showModalText = (e) => {
    const button = $(e.relatedTarget);
    const description = button.data('description ');
    const modalLabel = $('#descriptionModal');
    modalLabel.text(description);
  };

  const inputForLink = document.getElementById('inputForLink');
  inputForLink.addEventListener('keyup', (e) => {
    state.inputProcess.value = e.target.value;
    if (inputForLink.value === '') {
      state.inputProcess.valid = false;
      state.inputProcess.disabled = true;
    } else if (!validator.isURL(inputForLink.value)) {
      state.inputProcess.value = e.target.value.length > 20 ? 'it doesn"t look like a URL' : e.target.value;
      state.inputProcess.valid = false;
      state.inputProcess.disabled = true;
    } else if (state.articleLinks.has(inputForLink.value)) {
      state.inputProcess.value = 'This URL has already been entered by your dog';
      state.inputProcess.valid = false;
      state.inputProcess.disabled = true;
    } else {
      state.inputProcess.value = e.target.value;
      state.inputProcess.valid = true;
      state.inputProcess.disabled = false;
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
      state.inputProcess.disabled = false;
      state.inputProcess.value = '';
    })
      .catch((err) => {
        state.inputProcess.disabled = true;
        console.log(err);
      });
  });

  $('#modal').on('shown.bs.modal', showModalText).modal('show');

  WatchJS.watch(state, 'inputProcess', () => renderValidatorInput(state));
  WatchJS.watch(state, 'inputProcess', () => renderDisabledSabmit(state));
  WatchJS.watch(state, () => renderChannel(state));
};
