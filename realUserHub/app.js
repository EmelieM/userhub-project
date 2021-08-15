const BASE_URL = `https://jsonplace-univclone.herokuapp.com`;


//USER FUNCTIONS

function fetchUsers() {
    return fetch(`${BASE_URL}/users`)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        return data
    })
    .catch(function (){
        console.error("Something's broke")
    })
}

//

function renderUser(user){
    let newElement = $('<div class="user-card"></div>').html(
    `<header>
    <h2>${user.name}</h2>
  </header>
  <section class="company-info">
    <p><b>Contact:</b>${user.email}</p>
    <p><b>Works for:</b>${user.company.name}</p>
    <p><b>Company creed:</b>${user.company.catchPhrase}</p>
  </section>
  <footer>
    <button class="load-posts">POSTS BY ${user.username}</button>
    <button class="load-albums">ALBUMS BY ${user.username}</button>
  </footer>`
    )
    
    newElement.data('user', user)

    return newElement 

}

//

function renderUserList(userList){
    $('#user-list').empty()

    userList.forEach(function (profile){
        $('#user-list').append(renderUser(profile))
    })
}

//


 //ALBUM FUNCTIONS


 $('#user-list').on('click', '.user-card .load-albums', function () {
    // load albums for this user
    // render albums for this user
    let newEl = $(this).closest('.user-card').data('user')
    // console.log(newEl)
    fetchUserAlbumList(newEl.id)
    .then(function (ID){
        // console.log(ID)
        renderAlbumList(ID)
    })
  });

//

/* get an album list, or an array of albums */
function fetchUserAlbumList(userId) {
return fetchData(`${BASE_URL}/users/${userId}/albums?_expand=user&_embed=photos`)

}

//


function fetchData(url){
        return fetch(url)
        .then(function (response){
            return response.json()
        })
        .catch(function (error){
            console.error(error)
        })
    
    }

//

/* render a single album */
function renderAlbum(album) {
    console.log("album", album)

    let newAlbum = $('<div class="album-card"></div>').html(
    `<header>
    <h3>${album.title}, by ${album.user.username} </h3>
    </header>
    <section class="photo-list">
    </section>`
    )

    for (let i=0; i<album.photos.length; i++){
        let newPhoto = album.photos[i]
        $('.photo-list').append(renderPhoto(newPhoto))
    }

    return newAlbum
}


//

/* render a single photo */
function renderPhoto(photo) {

    let newPhoto = $("<div class='photo-card'></div>").html(`
    <a href=${photo.url} target="_blank">
    <img src=${photo.thumbnailUrl}>
    <figure>${photo.title}</figure>
    </a>`)

    return newPhoto
}

//

/* render an array of albums */
function renderAlbumList(albumList) {
    console.log(albumList)

    $('#app section.active').removeClass('active')

    $('#album-list').empty()
    $('#album-list').addClass('active')

    for (let i=0; i<albumList.length; i++){
        let newAlbm = albumList[i]
        $('#album-list').append(renderAlbum(newAlbm))
    }
}



//



//POST FUNCTIONS

$('#user-list').on('click', '.user-card .load-posts', function () {
    // load posts for this user
    // render posts for this user

    let newEl = $(this).closest('.user-card').data('user')
    fetchUserPosts(newEl.id)
    .then(function (ID){
        // console.log(ID)
        renderPostList(ID)
    })

  });

//

function fetchUserPosts(userId) {
    return fetchData(`${ BASE_URL }/users/${ userId }/posts?_expand=user`);
  }
  
  function fetchPostComments(postId) {
    return fetchData(`${ BASE_URL }/posts/${ postId }/comments`);
  }

  fetchUserPosts(1).then(console.log);

  fetchPostComments(1).then(console.log); 

//

function setCommentsOnPost(post) {
    //if the posts are already there don't fetch 
    if (post.comments){
        return Promise.reject(null)
    }

    //if they are, fetch
    return fetchPostComments(post.id)
    .then(function (comments){
        post.comments = comments
        return post
    });
  }

//

function renderPost(post) {

    let newPost = $('<div class="post-card"></div>').html(`<header>
    <h3>${post.title}</h3>
    <h3>--- ${post.user.username}</h3>
  </header>
  <p>"${post.body}"</p>
  <footer>
    <div class="comment-list"></div>
    <a href="#" class="toggle-comments">(<span class="verb">show</span> comments)</a>
  </footer>`)

    newPost.data("post", post)

  return newPost

}

//

function renderPostList(postList) {

    $('#app section.active').removeClass('active')

    $('#post-list').empty()
    $('#post-list').addClass('active')

    for (let i=0; i<postList.length; i++){
        let postEl = postList[i]
        $('#post-list').append(renderPost(postEl))
    }

}

//

function toggleComments(postCardElement) {
    const footerElement = postCardElement.find('footer');
  
    if (footerElement.hasClass('comments-open')) {
      footerElement.removeClass('comments-open');
      footerElement.find('.verb').text('show');
    } else {
      footerElement.addClass('comments-open');
      footerElement.find('.verb').text('hide');
    }
  }

//

  $('#post-list').on('click', '.post-card .toggle-comments', function () {
    const postCardElement = $(this).closest('.post-card');
    const post = postCardElement.data('post');
  
    setCommentsOnPost(post)
      .then(function (post) {
          let commentList = postCardElement.find(`.comment-list`)
          commentList.empty()
          
        post.comments.forEach( (el) => {
            return commentList.prepend($('<h3>').text(`"${el.body}" ${el.email}`))
        })        

        toggleComments(postCardElement)
        
      })
      .catch(function () {
        toggleComments(postCardElement)
      });
  });

//



//BOOTSTRAP
function bootstrap() {
    fetchUsers().then(renderUserList)

}

bootstrap();