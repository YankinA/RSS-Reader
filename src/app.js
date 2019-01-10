import validator from 'validator';
import axios from 'axios';
import { watch } from 'melanke-watchjs';
import $ from 'jquery';

import {
  renderChannel, renderValidatorInput, renderDisabledSabmit, renderModalContent,
  renderUserInformation,
} from './renders';

export default () => {
  const state = {
    userInformation: '.',
    articleLinks: new Set(),
    channel: [],
    updateChannel: false,
    inputProcess: {
      disabled: true,
      valid: '',
      value: '',
    },
    modal: {
      description: '',
    },
  };


  const inputForLink = document.getElementById('inputForLink');
  inputForLink.addEventListener('input', (e) => {
    const eventValue = e.target.value;
    state.inputProcess.value = eventValue;
    if (inputForLink.value === '') {
      state.inputProcess.valid = '';
      state.inputProcess.disabled = true;
    } else if (!validator.isURL(inputForLink.value)) {
      state.userInformation = eventValue.length > 20 ? 'it doesn"t look like a URL danger' : '.';
      state.inputProcess.valid = 'invalid';
      state.inputProcess.disabled = true;
    } else if (state.articleLinks.has(inputForLink.value)) {
      state.userInformation = 'This URL has already been entered by you or your dog danger';
      state.inputProcess.valid = 'invalid';
      state.inputProcess.disabled = true;
    } else {
      state.inputProcess.valid = 'valid';
      state.inputProcess.disabled = false;
      state.userInformation = '.';
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
      linksNews: new Set(),
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
    state.userInformation = 'Loading, please wait';
    state.inputProcess.disabled = true;
    axios.get(`${proxyLink}${inputForLink.value}`, { headers: { 'Access-Control-Allow-Origin': '*' } }).then(
      ({ data }) => {
        const dataDocument = parseRss(data, inputForLink.value);
        state.channel = [...state.channel, dataDocument];
      },
    ).then(() => {
      state.inputProcess.disabled = false;
      state.inputProcess.value = '';
      state.userInformation = 'Loaded';
    })
      .catch((err) => {
        state.userInformation = 'Oops, something went wrong danger';
        state.inputProcess.disabled = true;
        console.log(err);
      });
  });

  const showModalText = (event) => {
    const button = $(event.relatedTarget);
    const description = button.data('description');
    state.modal.description = description;
  };

  const hideModalText = () => {
    state.modal.description = '';
  };
  $('#modal').on('show.bs.modal', showModalText).on('hide.bs.modal', hideModalText);

  $('#clear').click(() => {
    $('#inputForLink').val('').focus();
  });
  /*
  const updateChannel = () => {
    axios.get(`${proxyLink}${inputForLink.value}`,
    { headers: { 'Access-Control-Allow-Origin': '*' } }).then(
      ({ data }) => {
        return parseRss(data, inputForLink.value);
      },
    ).then((data) => {
      state.channel = [...state.channel, data];
      return state.channel;
    }).then(() => {
    })
      .catch((err) => {
        console.log(err);
      });
  };
  watch(state, () => updateChannel()); */
  watch(state, () => renderUserInformation(state));
  watch(state, () => renderChannel(state));
  watch(state, 'inputProcess', () => renderValidatorInput(state));
  watch(state, 'inputProcess', () => renderDisabledSabmit(state));
  watch(state, 'modal', () => renderModalContent(state));
};
