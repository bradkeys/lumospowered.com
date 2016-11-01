var posts = document.querySelector('#posts');
var no_news_template = '<p>No news yet, please come back another time.</p>';
var titleGlyph = '<span class="glyphicon glyphicon-link" aria-hidden="true"></span> ';
var uri = 'http://api.tumblr.com/v2/blog/' + $('#blog_api').attr('value') + '/posts/?callback=?';
var apiKey = '3ABbizgTjTp9XiXDwnco5WuU9UsvYrINMxNhnqufdPbe3mVdQa';
var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
var postTemplate = document.querySelector('#post-template');

function GetPosts (postLimit, postOffset, callback) {
    $.getJSON(uri, {
        api_key: apiKey,
        limit: postLimit,
        offset: postOffset
    }).then(function(json) {
        callback(json);
    }).fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
        RemoveLoadingIndicator();
        posts.innerHTML = no_news_template;
    });
}

function AppendPost (post) {
    // Ensure larger sized images are being fetched from Tumblr.
    var content = post.body.replace(/540.png/g, '1280.png');
    content = content.replace(/540.jpg/g, '1280.jpg');

    postTemplate.content.querySelector('.blog-content').innerHTML = content;

    // Insert title
    var title =  postTemplate.content.querySelector('.blog-post-title a');
    title.href = post.post_url;
    title.innerHTML = titleGlyph + post.title;

    // Insert Date
    var d = post.date.split(' ')[0].split('-');
    var dateStr =  monthNames[d[1] - 1] + ' ' + d[2] + ', ' + d[0];
    postTemplate.content.querySelector('.blog-post-date').textContent = dateStr;

    var clone = document.importNode(postTemplate.content, true);
    posts.appendChild(clone);
}

function RemoveLoadingIndicator () {
    var loading = posts.querySelector('.loading-indicator');

    if (loading) {
        loading.remove();
    }
}

function LoadDefaultPosts () {
    GetPosts(10, 0, function (json) {
        RemoveLoadingIndicator();
        var results = json.response.posts;

        if (results.length == 0) {
            posts.innerHTML = no_news_template;
        } else {
            for (var i = 0; i < results.length; i++) {
                AppendPost(results[i]);
            }
        }
    });
}

LoadDefaultPosts();