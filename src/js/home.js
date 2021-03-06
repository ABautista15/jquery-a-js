fetch('https://randomuser.me/api/')
    .then((response) => response.json())
    .then((data) => console.log(data.results[0].name.first))
    .catch((error) => console.log('Hubo un error en la conexion'));

(async function load(){
    async function getData(url){
        const response = await fetch(url);
        const data = await response.json();
        if(data.data.movie_count > 0){
            return data;
        }
        throw new Error("don't found any results");
    }
    const BASE_URL = 'https://yts.am/api/v2/'
    const $form = document.getElementById('form')
    const $home = document.getElementById('home')
    const $modal = document.getElementById('modal')
    const $overlay = document.getElementById('overlay')
    const $hideModal = document.getElementById('hide-modal')

    const $modalTitle = $modal.querySelector('h1')
    const $modalImg = $modal.querySelector('img')
    const $modalDescription = $modal.querySelector('p')

    

    const $featuringContainer = document.getElementById('featuring')

    function setAttributes($element, attributes){
        for(const attribute in attributes){
            $element.setAttribute(attribute, attributes[attribute])
        }
    }

    function featuringTemplate(movie){
        return (
            `<div class="featuring">
                <div class="featuring-image">
                    <img src="${movie.medium_cover_image}" width="70" height="100" alt="">
                </div>
                <div class="featuring-content">
                    <p class="featuring-title">Pelicula encontrada</p>
                    <p class="featuring-album">${movie.title}</p>
                </div>
          </div>`
        )
    }

    $form.addEventListener('submit',async function(e){
        e.preventDefault()
        $home.classList.add('search-active')
        const $loader =  document.createElement('img')
        setAttributes($loader, {
            src: 'src/images/loader.gif',
            height: '50px',
            width: '50px'
        })
        $featuringContainer.append($loader)

        const data = new FormData($form)
        try{
            const {
                data: {
                    movies
                }
            } = await getData(`${BASE_URL}list_movies.json?limit=1&query_term=${data.get('name')}`)
            
            const HTMLString = featuringTemplate(movies[0])
            $featuringContainer.innerHTML = HTMLString
        }catch(error){
            alert(error.message)
            $loader.remove()
            $home.classList.remove('search-active')
        }

    })

    function templateItemsVideo(movie, category){
        return (
            `<div class="primaryPlaylistItem" data-id="${movie.id}" data-category="${category}" >
                <div class="primaryPlaylistItem-image">
                    <img src="${movie.medium_cover_image}">
                </div>
                <h4 class="primaryPlaylistItem-title">
                    ${movie.title}
                </h4>
            </div>`
        );
    }

    function createTemplate(HTMLString){
        const html = document.implementation.createHTMLDocument();
        html.body.innerHTML = HTMLString;
        return html.body.children[0];
    }

    function addEventClick($element){
        $element.addEventListener('click', function(){
            showModal($element)
        })
    }

    function findById(list, id){
        return list.find(movie => movie.id === parseInt(id,10))
    }
    function findMovie(id, category){
        switch(category){
            case 'action':
                return findById(actionList,id)
                break;
            
            case 'drama':
                return findById(dramaList,id)
                break;

            default:
                return findById(animationList,id)
                break;
        }
    }

    function showModal($element){
        $overlay.classList.add('active')
        $modal.style.animation = 'modalIn .8s forwards'
        const id = $element.dataset.id
        const category = $element.dataset.category
        const data = findMovie(id, category)

        $modalTitle.textContent = data.title
        $modalImg.setAttribute('src',data.medium_cover_image)
        $modalDescription.textContent = data.description_full
    }

    function hideModal(){
        $overlay.classList.remove('active')
        $modal.style.animation = 'modalOut .8s forwards'
    }
    $hideModal.addEventListener('click', hideModal)

    function renderMovieList(list,$container,category){
        $container.children[0].remove()
        list.forEach(movie => {
            const HTMLString = templateItemsVideo(movie,category);
            const movieElement = createTemplate(HTMLString);
            const images = movieElement.querySelector('img')

            $container.append(movieElement);

            images.addEventListener('load', (event)=>{
                event.srcElement.classList.add('fadeIn')
            })
            //debugger
            
            addEventClick(movieElement)
            //$actionContainer.innerHTML += HTMLString
        });
    }
    
    async function cacheExist(category){
        const listName = `${category}List`
        const cacheList = window.localStorage.getItem(listName)
        if(cacheList){
            return JSON.parse(cacheList)
        }

        const {data: { movies: data}} = await getData(`https://yts.am/api/v2/list_movies.json?genre=${category}`);
        window.localStorage.setItem(listName,JSON.stringify(data))
        return data;
    }

    const actionList = await cacheExist('action')
    const $actionContainer = document.getElementById('action');
    renderMovieList(actionList,$actionContainer,'action')

    const dramaList = await cacheExist('drama')
    const $dramaContainer = document.getElementById('drama');
    renderMovieList(dramaList,$dramaContainer,'drama')

    const animationList = await await cacheExist('animationList')
    const $animationContainer = document.getElementById('animation');
    renderMovieList(animationList,$animationContainer,'animation')
})()