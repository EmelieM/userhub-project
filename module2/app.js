const CARD_URL = `https://api.magicthegathering.io/v1/cards?pageSize=20`

function renderCard(card) {
    let cardImg

    if (card.imageUrl){
    cardImg = card.imageUrl
    }
    
    let result = $('<div></div>').html(
    `<div class="card">
    <h3>${card.name} - ${card.manaCost}</h3>
    <h4>${card.type}</h4>
    <h5 class="set-name">${card.set}</h5>
    <pre>${card.text}</pre>
    <img src=${cardImg}>
    </div>`
    )

    result.find('.set-name').data()

    return result
}

//

function renderCardList(cardList) {
    $('#results').empty()

    cardList.forEach(function (item){
        $('#results').append(renderCard(item))
    })

}

//

function fetchCardList(url) {
    $('.searching').addClass('active')

    fetch (url)
    .then( function (response){
        console.log(response)
        return response.json()
    })
    .then(function (data){
        $('.searching').removeClass('active')
        console.log(data.cards)
        renderCardList(data.cards)
    })
    .catch(function (error){
        console.error(error)
    })
}

//

// fetchCardList(CARD_URL)

$('#card-search').on('submit', function (event) {
    event.preventDefault()

    let cardName = $('#cname').val()
    let cardText = $('#ctext').val()

    $('#cname').val(null)
    $('#ctext').val(null)

    let newURL = `https://api.magicthegathering.io/v1/cards?pageSize=20&name=${cardName}&text=${cardText}`

    fetchCardList(newURL)


});

//

$('#results').on('click', '.card .set-name', function () {
    let setName = $(this).data('setName', setName)
    let newUrl = `https://api.magicthegathering.io/v1/cards?pageSize=20&set=${setName}`
    fetchCardList(newUrl)
});