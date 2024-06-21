console.log("Lets write some javascript")
let currentsong=new Audio;
let songs
let currfolder

function convertSecondsToMinutesSeconds(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) {
        return "00:00";
    }

    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    // Format the result with leading zeros
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // Return the formatted string
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder){
    currfolder=folder
    let a=await fetch(`/${folder}/`)
    let response=await a.text();
    let div=document.createElement("div");
    div.innerHTML=response
    let as=div.getElementsByTagName("a");
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    
    //show all the songs in the playlist
    let songUL=document.querySelector(".songslist").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+ 
        `<li>
        <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20"," ")}</div>
            <div>Lucky</div>
        </div>
        
        <div class="playnow">
            <span>Play now</span>
            <img class="invert" src="Play.svg" alt="">
        </div>
        </li> `
    }

    //Attach an event listner to each song
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
} 

const playMusic = (track,pause=false)=>{
    currentsong.src=`/${currfolder}/`+track
    if(!pause){
        currentsong.play()
        play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00.00/00.00"
}

async function main(){
    //Get the list of all songs
    await getsongs("songs/karanaujla") 
    playMusic(songs[0],true)


    //Attach an even listner to play prev and next
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play();
            play.src="pause.svg"
        }
        else{
            currentsong.pause()
            play.src="play.svg"
        }
    })

    //Listen for timeupdate event
    currentsong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML=`${convertSecondsToMinutesSeconds(currentsong.currentTime)}/${convertSecondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
    })

    //Add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=percent+"%"
        currentsong.currentTime=((currentsong.duration)*percent)/100
    })

    //Add an event listner for Hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })

    //Add an event listner for close button
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })

    //Add an event Listner to previous
    previous.addEventListener("click",()=>{
        currentsong.pause()
        console.log("previous clicked")
        
        let index=songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        if((index-1) >=0){
            playMusic(songs[index-1])
        }
    })

    //Add an event listner to next
    next.addEventListener("click",()=>{
        currentsong.pause()
        console.log("next clicked")
        
        let index=songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }
    })

    //Add am event listner to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting volume to",e.target.value,"/ 100")
        currentsong.volume=parseInt(e.target.value)/100
    })

    //Load the playlist when card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            console.log(item,item.currentTarget.dataset)
            songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })

    //Add an event listner to mute the track
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentsong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currentsong.volume=.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10
        }
        
    })

}

main()
