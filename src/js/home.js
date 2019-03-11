fetch('https://randomuser.me/api/')
    .then((response) => response.json())
    .then((data) => console.log(data.results[0].name.first))
    .catch((error) => console.log('Hubo un error en la conexion'));

(async function load(){
    async function getData(url){
        const response = await fetch('https://yts.am/api/v2/list_movies.json')
        const data = await response.json()
        return data
    }
    
    const actionList = await getData('https://yts.am/api/v2/list_movies.json?genre=action')
    const dramaList = await getData('https://yts.am/api/v2/list_movies.json?genre=drama')
    const animationList = await getData('https://yts.am/api/v2/list_movies.json?genre=animation')

    console.log(actionList, dramaList, animationList)

    const $actionContainer = document.getElementById('action')
    const $dramaContainer = document.getElementById('drama')
    const $animationContainer = document.getElementById('animation')

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

    actionList.data.movies.forEach(movie => {
        const HTMLString = templateItemsVideo(movie)
        const html = document.implementation.createHTMLDocument()
        html.body.innerHTML = HTMLString
        //debugger
        //$actionContainer.append(html.body.children[0])
        $actionContainer.innerHTML += HTMLString
    });
    const $featuringContainer = document.getElementById('featuring')
    const $form = document.getElementById('form')
    const $home = document.getElementById('home')

    const $modal = document.getElementById('modal')
    const $overlay = document.getElementById('overlay')
    const $hideModal = document.getElementById('hide-modal')

    const $modalTitle = $modal.querySelector('h1')
    const $modalImg = $modal.querySelector('img')
    const $modalDescription = $modal.querySelector('p')

    
})()