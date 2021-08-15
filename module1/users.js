const USERS_URL = `https://reqres.in/api/users?per_page=2`;

const metadata = {
  minPage: 1,
  currentPage: null,
  maxPage: null
};

function renderUser(user) {
    return $("<div></div>").html(
        `<h3>${user.first_name}  ${user.last_name}</h3>
        <p>${user.email}</p>
        <img src=${user.avatar}>`
    )
}

function renderUserList(userList) {

    $("#user-list").empty()

    userList.data.forEach(function(item){
        $("#user-list").append(renderUser(item))
    })

}

function updatePageInfo() {
    if (metadata.currentPage !== null){
    $('#page-info').text(`${metadata.currentPage}`)
    } else {
    $('#page-info').text('1')
    }
}

function updateButtons() {
    if (metadata.currentPage === 1){
        $('#back').attr('disabled', true)
    } else if (metadata.maxPage === false){
        $('#forward').attr('disabled', true)
    } else {
        $('#forward').removeAttr('disabled')
        $('#back').removeAttr('disabled')
    }

}

function fetchUserList(currentPage = 1) {
    fetch (`${USERS_URL}&page=${currentPage}`)
    .then(function (result){
        return result.json()
    })
    .then(function (data){
        console.log(data)

        if (data.page < 1){
            metadata.minPage = false
        } else if (data.page >= 6){
            metadata.maxPage = false
        }

        renderUserList(data)

        updatePageInfo()

        updateButtons()
        

    })
    .catch(function (error){
        console.error(error)
    })

}

$('#back').on('click', function () {
    console.log("back")
    if (metadata.currentPage >= 1 && metadata.minPage !== false){
        fetchUserList(metadata.currentPage -= 1)
    } else if (metadata.currentPage < 0){
        console.log("error")
    }

});


$('#forward').on('click', function () {
    console.log("forward")
    if (metadata.maxPage !== false){
        fetchUserList(metadata.currentPage += 1)
    } else if (metadata.currentPage > 6){
        console.log('error')
    }

});

function bootstrap() {
    fetchUserList()

}

bootstrap();