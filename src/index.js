import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { createMarkup } from './markup.js';
import { PixabayAPI } from './pixabay.js';


const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  backdrop: document.querySelector('.backdrop'),
  body: document.querySelector('body'),
  searchInput: document.querySelector('.search-form-input'),
};


const modalLightboxGallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});


window.addEventListener('load', () => {
  console.log('All resources is load');
});


const pixaby = new PixabayAPI();

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

const loadMorePhotos = async function (entries, observer) {
  
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      pixaby.incrementPage();


      try {
    
        const { hits } = await pixaby.getPhotos();
        const markup = createMarkup(hits);
        refs.gallery.insertAdjacentHTML('beforeend', markup);

        if (pixaby.hasMorePhotos) {

           const lastItem = document.querySelector('.gallery a:last-child');
          observer.observe(lastItem);
        } else
          Notify.info(
            "We're sorry, but you've reached the end of search results."
          );

        modalLightboxGallery.refresh();
        scrollPage();
      } catch (error) {
        Notify.failure(error.message, 'Something went wrong!');
        clearPage();
      } 
    }
  });
};

const observer = new IntersectionObserver(loadMorePhotos, options);

const onSubmitClick = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.target;

  const search_query = searchQuery.value.trim().toLowerCase();

  if (!search_query) {
    clearPage();
    Notify.info('Enter data to search!');

    return;
  }

  pixaby.query = search_query;

  clearPage();

  try {
    const { hits, total } = await pixaby.getPhotos();


    if (hits.length === 0) {
      Notify.failure(
        `Sorry, there are no images matching your ${search_query}. Please try again.`
      );

      return;
    }
 

    const markup = createMarkup(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markup);

    pixaby.setTotal(total);
    Notify.success(`Hooray! We found ${total} images.`);

    console.log("this is total", total);
    
    

    if (pixaby.hasMorePhotos) {

      const lastItem = document.querySelector('.gallery a:last-child');
      observer.observe(lastItem);
    }
    
    modalLightboxGallery.refresh();
  } catch (error) {
    Notify.failure(error.message, 'Something went wrong!');

    clearPage();
  } 
};

// const onLoadMore = async () => {
//   pixaby.incrementPage();

//   if (!pixaby.hasMorePhotos) {
    
//     Notify.info("We're sorry, but you've reached the end of search results.");
//   }
//   try {
//     const { hits } = await pixaby.getPhotos();
//     const markup = createMarkup(hits);
//     refs.gallery.insertAdjacentHTML('beforeend', markup);

//     modalLightboxGallery.refresh();
//   } catch (error) {
//     Notify.failure(error.message, 'Something went wrong!');

//     clearPage();
//   }
// };


function clearPage() {
  pixaby.resetPage();
  refs.gallery.innerHTML = '';
}

refs.form.addEventListener('submit', onSubmitClick);

function scrollPage() {
  try{
    const { height: cardHeight } = document
    .querySelector('.photo-gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
  } catch(error) {
    Notify.info("We're sorry, but you've reached the end of search results.")
  }
  
}
