import validator from 'validator';
import axios from 'axios';
import { watch } from 'melanke-watchjs';
import $ from 'jquery';

import {
  renderChannel, renderInputEvent, renderDisabledSubmit, renderModalContent,
  renderUserInformation,
} from './renders';

const parseRss = (XMLdata, linkChannel) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(XMLdata, 'application/xml');
  const items = doc.querySelectorAll('item');
  const channel = doc.querySelector('channel');
  const channelTitle = channel.querySelector('title').textContent;
  return {
    channelTitle,
    linkChannel,
    linksNews: new Set([...items].map(item => item.querySelector('link').textContent)),
    news: [...items].map(item => ({
      titleText: item.querySelector('title').textContent,
      descriptionText: item.querySelector('description').textContent,
      linkText: item.querySelector('link').textContent,
    })),
  };
};

export default () => {
  const state = {
    userInformation: '.',
    articleLinks: new Set(),
    channels: [],
    updateChannel: false,
    inputProcess: {
      disabledSubmit: true,
      disabledInput: false,
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
      state.inputProcess.disabledSubmit = true;
    } else if (!validator.isURL(inputForLink.value)) {
      state.userInformation = eventValue.length > 20 ? 'it doesn"t look like a URL danger' : '.';
      state.inputProcess.valid = 'invalid';
      state.inputProcess.disabledSubmit = true;
    } else if (state.articleLinks.has(inputForLink.value)) {
      state.userInformation = 'This URL has already been entered by you or your dog danger';
      state.inputProcess.valid = 'invalid';
      state.inputProcess.disabledSubmit = true;
    } else {
      state.inputProcess.valid = 'valid';
      state.inputProcess.disabledSubmit = false;
      state.userInformation = '.';
    }
  });

  const proxyLink = 'https://cors-anywhere.herokuapp.com/';

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.inputProcess.disabledSubmit = true;
    state.inputProcess.disabledInput = true;
    state.articleLinks.add(inputForLink.value);
    state.userInformation = 'Loading, please wait';
    axios.get(`${proxyLink}${inputForLink.value}`, { headers: { 'Access-Control-Allow-Origin': '*' } }).then(
      ({ data }) => {
        const dataDocument = parseRss(data, inputForLink.value);
        state.channels = [dataDocument, ...state.channels];
      },
    ).then(() => {
      state.inputProcess.disabledInput = false;
      state.inputProcess.disabledSubmit = false;
      state.inputProcess.value = '';
      state.userInformation = 'Loaded';
      state.updateChannel = true;
    })
      .catch((err) => {
        state.userInformation = 'Oops, something went wrong danger';
        state.inputProcess.disabledInput = false;
        state.inputProcess.disabledSubmit = true;
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

  const updateChannel = () => state.channels
    .forEach(({
      linkChannel, linksNews, news, channelTitle,
    }) => axios
      .get(`${proxyLink}${linkChannel}`,
        { headers: { 'Access-Control-Allow-Origin': '*' } }).then(
        ({ data }) => parseRss(data, linkChannel),
      ).then((data) => {
        const linksNewsData = data.linksNews;
        const newsData = data.news;
        linksNewsData.forEach((link) => {
          if (!linksNews.has(link)) {
            linksNews.add(link);
            newsData.forEach((n) => {
              if (n.linkText === link) {
                console.log(n);
                news.unshift(n);
              }
            });
          }
        });
      }).then(() => {
        console.log('finished');
        setTimeout(updateChannel, 5000);
      })
      .catch((err) => {
        console.log(err);
        state.userInformation = `ERROR No added new news from: ${channelTitle}`;
      }));
  watch(state, 'updateChannel', () => setTimeout(updateChannel, 5000));
  watch(state, () => renderUserInformation(state));
  watch(state, 'channels', () => renderChannel(state));
  watch(state, 'inputProcess', () => renderInputEvent(state));
  watch(state, 'inputProcess', () => renderDisabledSubmit(state));
  watch(state, 'modal', () => renderModalContent(state));
};
