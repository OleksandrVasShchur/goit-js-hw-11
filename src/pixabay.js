import axios from 'axios';


axios.defaults.baseURL = 'https://pixabay.com/api/';

const API_KEY = '35544989-94139f01e43b0cfec95c5298b';


export class PixabayAPI {
    #page = 1;
    #per_page = 40;
    #query = '';
    #totalPages = 0;

    
    async getPhotos() {
        const params = {
            page: this.#page,
            q: this.#query,
            per_page: this.#per_page,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
        }


        // const urlAXIOS = `?key=${API_KEY}`;
        const urlAXIOS = `?key=${API_KEY}&q=${this.#query}&page=${this.#page}&per_page=${this.#per_page}`;

        const { data } = await axios.get(urlAXIOS, { params, });
        return data;
    }

    get query() {
        this.#query;
    }

    set query(newQuery) {
        this.#query = newQuery;
    }

    incrementPage() {
        this.#page += 1;
    }

    resetPage() {
        this.#page = 1;
    }

    setTotal(total) {
        this.#totalPages = total;
    }

    hasMorePhotos() {
       
        return this.#page < Math.ceil(this.#totalPages / this.#per_page);
       
        }
    
    // if(PerPage * page > totalHits)
    
}
