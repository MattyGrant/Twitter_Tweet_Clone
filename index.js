import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';



// Click events for page
document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if (e.target.dataset.comment){
        handleTweetComment(e.target.dataset.comment)
    }
    else if (e.target.dataset.delete){
        handleDeleteTweet(e.target.dataset.delete)
    }
})

// like btn click handler
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

// retweet btn click handler
function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

// Reply btn click handler
function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

// Tweet btn click handler
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

// Tweet Comment section handler
function handleTweetComment(commentId){
    let commentInput = document.getElementById(`comment-text-${commentId}`).value
    if(commentInput){
        let targetTweetObj = tweetsData.filter(function(tweet){
            return tweet.uuid === commentId
        })[0]
        targetTweetObj.replies.unshift({
            handle: `@MattyIce9918`,
            profilePic: `images/matt.jpg`,
            tweetText: commentInput
        })
    render()
    commentInput = ''   
    }
}

// User Tweet Delete handler
function handleDeleteTweet(tweetId){
    let targetTweet = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    let targetTweetIndex = tweetsData.indexOf(targetTweet)
    tweetsData.splice(targetTweetIndex,1)
    render()
}

// feed render
function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        let retweetIconClass = ''
        let repliesHtml = ''
        
        if (tweet.isLiked){ likeIconClass = 'liked'}
        if (tweet.isRetweeted){ retweetIconClass = 'retweeted'}
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                        </div>
                    </div>
                `
            })
        }

        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">

                            <span class="tweet-detail">
                                <i class="fa-solid fa-comment-dots" data-reply="${tweet.uuid}"></i>
                                ${tweet.replies.length}
                            </span>

                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                                ${tweet.likes}
                            </span>

                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                                ${tweet.retweets}
                            </span>

                            <span class="tweet-detail">
                                <i class="fa-solid fa-trash" data-delete="${tweet.uuid}"></i>
                            </span>
                            
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    <div class="comment-container">
                        <textarea class="comment-text" id="comment-text-${tweet.uuid}" placeholder="Join the conversion!"></textarea>
                        <button id="comment-btn" data-comment="${tweet.uuid}">Add Comment</button>
                    </div>
                    ${repliesHtml}
                </div>   
            </div>
        `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}
render()

