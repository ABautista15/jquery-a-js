fetch('https://randomuser.me/api/')
    .then((response) => response.json())
    .then((data) => console.log(data.results[0].name.first))
    .catch((error) => console.log('Hubo un error en la conexion'));

(async function load(){
    async function getData(url){
        const response = await fetch(url);
        const data = await response.json();
        return data;
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
    const actionList = await getData('https://yts.am/api/v2/list_movies.json?genre=action');
    const dramaList = await getData('https://yts.am/api/v2/list_movies.json?genre=drama');
    const animationList = await getData('https://yts.am/api/v2/list_movies.json?genre=animation');
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
        const {
            data: {
                movies
            }
        } = await getData(`${BASE_URL}list_movies.json?limit=1&query_term=${data.get('name')}`)
        
        const HTMLString = featuringTemplate(movies[0])
        $featuringContainer.innerHTML = HTMLString

    })
    const $actionContainer = document.getElementById('action');
    const $dramaContainer = document.getElementById('drama');
    const $animationContainer = document.getElementById('animation');

    function templateItemsVideo(movie){
        return (
            `<div class="primaryPlaylistItem">
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

    function showModal($element){
        $overlay.classList.add('active')
        $modal.style.animation = 'modalIn .8s forwards'
    }

    function hideModal(){
        $overlay.classList.remove('active')
        $modal.style.animation = 'modalOut .8s forwards'
    }
    $hideModal.addEventListener('click', hideModal)
    function renderMovieList(list,$container){
        $container.children[0].remove()
        list.forEach(movie => {
            const HTMLString = templateItemsVideo(movie);
            const movieElement = createTemplate(HTMLString);
            
            //debugger
            $container.append(movieElement);
            addEventClick(movieElement)
            //$actionContainer.innerHTML += HTMLString
        });
    }
    renderMovieList(actionList.data.movies,$actionContainer)
    renderMovieList(dramaList.data.movies,$dramaContainer)
    renderMovieList(animationList.data.movies,$animationContainer)
})()