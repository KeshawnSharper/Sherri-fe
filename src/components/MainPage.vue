<script setup>
import { useSpeechRecognition } from '@vueuse/core'
import { ref,onMounted,useTemplateRef, watchEffect, } from 'vue'
import {scapeYoutubeLink} from '../index.js'
import axios from 'axios'
import { useRoute } from 'vue-router';
import MainPageView from './MainPageView.vue';

const content = document.querySelector('.content')
const route = window.location.search
console.log(route)
onMounted(() => {
  console.log(route)
  if (route.length > 0){
  const start = route.indexOf("=")
  const end = route.indexOf("&")
  const token = route.substring(start+1,end)
  console.log(token)
  axios.post(`http://localhost:3000/token/`,{"token": token})
        .then(res => console.log(res.data))
        .catch(err => console.log(err))
  }
})

 /* exported gapiLoaded */
      /* exported gisLoaded */
      /* exported handleAuthClick */
      /* exported handleSignoutClick */

      // TODO(developer): Set to client ID and API key from the Developer Console
      const CLIENT_ID = '788268317161-l39iqf2eo3t0hnknlq7r0lug8vmjseep.apps.googleusercontent.com';
      const API_KEY = 'AIzaSyBL6InNe5E2L9sHd63efY7R8yUx5OcuvCU';

      // Discovery doc URL for APIs used by the quickstart
      const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

      let tokenClient;
      let gapiInited = false;
      let gisInited = false;

      // document.getElementById('authorize_button').style.visibility = 'hidden';
      // document.getElementById('signout_button').style.visibility = 'hidden';

      /**
       * Callback after api.js is loaded.
       */
      function gapiLoaded() {
        gapi.load('client', initializeGapiClient);
      }

      /**
       * Callback after the API client is loaded. Loads the
       * discovery doc to initialize the API.
       */
      async function initializeGapiClient() {
        await gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableButtons();
      }

      /**
       * Callback after Google Identity Services are loaded.
       */
      function gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        });
        gisInited = true;
        maybeEnableButtons();
      }

      /**
       * Enables user interaction after all libraries are loaded.
       */
      function maybeEnableButtons() {
        if (gapiInited && gisInited) {
          document.getElementById('authorize_button').style.visibility = 'visible';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick() {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          document.getElementById('signout_button').style.visibility = 'visible';
          document.getElementById('authorize_button').innerText = 'Refresh';
          await listUpcomingEvents();
        };

        if (gapi.client.getToken() === null) {
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({prompt: ''});
        }
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
          google.accounts.oauth2.revoke(token.access_token);
          gapi.client.setToken('');
          document.getElementById('content').innerText = '';
          document.getElementById('authorize_button').innerText = 'Authorize';
          document.getElementById('signout_button').style.visibility = 'hidden';
        }
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      async function listUpcomingEvents() {
        let response;
        try {
          const request = {
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime',
          };
          response = await gapi.client.calendar.events.list(request);
        } catch (err) {
          document.getElementById('content').innerText = err.message;
          return;
        }

        const events = response.result.items;
        if (!events || events.length == 0) {
          document.getElementById('content').innerText = 'No events found.';
          return;
        }
        // Flatten to string to display
        const output = events.reduce(
            (str, event) => `${str}${event.summary} (${event.start.dateTime || event.start.date})\n`,
            'Events:\n');
        document.getElementById('content').innerText = output;
      }

const result = ref("")
const btn = useTemplateRef("btn")
const modal_container = ref(null)
const audioStack = []

function speak(text){
    const text_speak = new SpeechSynthesisUtterance(text);

    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;

    window.speechSynthesis.speak(text_speak);
    result.value = ""
}

function wishMe(){
    var day = new Date();
    var hour = day.getHours();

    if(hour>=0 && hour<12){
        speak("Good Morning Boss...")
    }

    else if(hour>12 && hour<17){
        speak("Good Afternoon Master...")
    }

    else{
        speak("Good Evenining Sir...")
    }

}

window.addEventListener('load', ()=>{
  recognition.stop()
    speak("Initializing JARVIS..");
    recognition.stop()
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition =  new SpeechRecognition();

recognition.onresult = (event)=>{
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    result.value = transcript
    takeCommand(transcript.toLowerCase());
    recognition.stop()
  
    startSpeech()
    

}

const startSpeech = () => {
    result.value = "Listening...."
    if (audioStack.length > 0){
    console.log(audioStack)
    audioStack[audioStack.length - 1].pause()
  }
    recognition.start();
}

function takeCommand(message){
 
  let resumeSong = true
    // if(message.includes('hey') || message.includes('hello')){
    //     speak("Hello Sir, How May I Help You?");
    // }
    if(message.includes("open google")){
        window.open("https://google.com", "_blank");
        speak("Opening Google...")
    }
    else if(message.includes("open youtube")){
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...")
    }
    else if(message.includes("hey cherry") || message.includes("hey siri")){
        speak("Opening ...")
        let result = message.replace("hey","")
        result = result.replace("sherry","")
        result = result.replace("siri","")
        console.log(result)
        if (result.includes("weather") || result.includes("forecast")){
          axios.get(`http://localhost:3000/weather/${result}`)
        .then(res => speak(res.data))
        .catch(err => console.log(err))
        }
        else{
        axios.get(`http://localhost:3000/ai/${result}`)
        .then(res => speak(res.data))
        .catch(err => console.log(err))
        }
    }
    else if(message.includes("play")){
        let result = message.replace("play","") + " lyrics"
        console.log(result)
        axios.get(`http://localhost:3000/youtube/${result}`).then(res => {
        // console.log(res))
        speak(`Play ${result}...`)
        const audio = new Audio(res.data);
        audioStack.push(audio)
        audioStack[audioStack.length - 1].play()
        resumeSong = false
        console.log(resumeSong)
      })

    }
    else if(message.includes("open facebook")){
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...")
    }

    else if(message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what i found on internet regarding " + message;
	    speak(finalText);
  
    }

    else if(message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
        const finalText = "This is what i found on wikipedia regarding " + message;
        speak(finalText);
    }

    else if(message.includes('time')) {
        const time = new Date().toLocaleString(undefined, {hour: "numeric", minute: "numeric"})
        const finalText = time;
        speak(finalText);
    }

    else if(message.includes('date')) {
        const date = new Date().toLocaleString(undefined, {month: "short", day: "numeric"})
        const finalText = date;
        speak(finalText);
    }

    else if(message.includes('calculator')) {
        window.open('Calculator:///')
        const finalText = "Opening Calculator";
        speak(finalText);
    }

    else {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "I found some information for " + message + " on google";
        speak(finalText);

    }

    console.log(resumeSong)

    if(audioStack.length > 1){
      audioStack[audioStack.length-2].pause()
    }
    result.value = ""

}


var videos_modal = document.getElementById('video-model-div');

const closeModal = () => {
  modal_container.value.style.display = "none";
}
window.onclick = function(event) {

if (event.target == modal_container.value) {

closeModal()
 }

 if (event.target == videos_modal) {

   videos_modal.style.display = "none";

 }

}
const showCommands = e => {
  console.log(modal_container)
  modal_container.value.style.display = "block"

}

</script>

<template>
  
<button id="m1-c"  @click="showCommands" class="button-64 link-1 show-commands-button" role="button"><span class="text">Show Commands</span></button>

<div class="modal-container" id="m1-o" style="background: transparent;" ref="modal_container">
    <div class="modal">
      <h1 class="modal__title">Sherry Commands</h1>
      <p class="modal__text" >
        <ul>
          <li>To Play Music: Say "Play {Artist}{Song Name}" or "Play {Song Name}"</li>
          <li>To Talk to Sherry AI: Say "Hey Sherry {Your question}"</li>
          <li>For Weather: Say "Hey Sherry, what's the weather in {City}{State}"</li>
          <li>To open Google,Youtube,Wikipedia or Facebook: Say "Open {sites mentioned 1 of the 4 sites mentioned}"</li>
          <li>To open Calculator: Say "Open Calculator"</li>
          <li>To get the time or date : Say "What is the time" or "What is the date"</li>
          <li>To look something up on google: Say "What is {quesion}" or "Who is {quesion}" or "What are {question}"</li>
        </ul>
      </p>
      <button class="modal__btn" @click="closeModal">Close</button>
    </div>
  </div>

<MainPageView />

<p class="listening-text">{{result}}</p>

<button ref="btn" @click="startSpeech" class="button-49 bottom" role="button">Click To Talk to Sherry</button>
</template>

<style scoped>
body {
  --light: hsl(220, 50%, 90%);
  --primary: hsl(255, 30%, 55%);
  --focus: hsl(210, 90%, 50%);
  --border-color: hsla(0, 0%, 100%, .2);
  --global-background: hsl(220, 25%, 10%);
  --shadow-1: hsla(236, 50%, 50%, .3);
  --shadow-2: hsla(236, 50%, 50%, .4);

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Open Sans', sans-serif;
  color: var(--light);
  background: var(--global-background);
}
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;

  display: none;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;

  /* --m-background is set as inline style */
  background:linear-gradient(to right, hsl(210, 30%, 20%), hsl(255, 30%, 25%));

}

.modal-container:target {
  display: flex;
}

.modal {
  width: 60rem;
  padding: 4rem 2rem;
  border-radius: .8rem;

  color: hsl(220, 50%, 90%);
  background:linear-gradient(to right, hsl(210, 30%, 20%), hsl(255, 30%, 25%));
  box-shadow: hsla(236, 50%, 50%, .3);
  position: relative;

  overflow: hidden;
}

.modal__title {
  font-size: 3.2rem;
}

.modal__text {
  padding: 0 4rem;
  margin-top: 4rem;

  font-size: 1.6rem;
  line-height: 2;
}

.modal__btn {
  margin-top: 4rem;
  padding: 1rem 1.6rem;
  border: 1px solid hsla(0, 0%, 100%, .2);
  border-radius: 100rem;

  color: inherit;
  background: transparent;
  font-size: 1.4rem;
  font-family: inherit;
  letter-spacing: .2rem;

  transition: .2s;
  cursor: pointer;
}

.modal__btn:nth-of-type(1) {
  margin-right: 1rem;
}

.modal__btn:hover,
.modal__btn:focus {
  background: var(--focus);
  border-color: var(--focus);
  transform: translateY(-.2rem);
}


/* link-... */
.link-1 {
  font-size: 1.8rem;

  color: var(--light);
  background: hsla(0, 0%, 100%, .2);
  box-shadow: .4rem .4rem 2.4rem .2rem var(--shadow-1);
  border-radius: 100rem;
  padding: 1.4rem 3.2rem;

  transition: .2s;
}

.link-1:hover,
.link-1:focus {
  transform: translateY(-.2rem);
  box-shadow: 0 0 4.4rem .2rem var(--shadow-2);
}

.link-1:focus {
  box-shadow:
    0 0 4.4rem .2rem var(--shadow-2),
    0 0 0 .4rem var(--global-background),
    0 0 0 .5rem var(--focus);
}
.box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 4rem 2rem;
}

/* CSS */
.button-64 {
  align-items: center;
  position: absolute;
  background-image: linear-gradient(144deg,#AF40FF, #5B42F3 50%,#00DDEB);
  border: 0;
  border-radius: 8px;
  box-shadow: rgba(151, 65, 252, 0.2) 0 15px 30px -5px;
  box-sizing: border-box;
  color: #FFFFFF;
  display: flex;
  font-family: Phantomsans, sans-serif;
  font-size: 9px;
  justify-content: center;
  line-height: 1em;
  padding: 1px;
  text-decoration: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  white-space: nowrap;
  cursor: pointer;
  width: 200px;
  height: 55px;
  left: 5%;

}

.button-64:active,
.button-64:hover {
  outline: 0;
}

.button-64 span {
  background-color: rgb(5, 6, 45);
  padding: 16px 24px;
  border-radius: 6px;
  width: 100%;
  height: 100%;
  transition: 300ms;
  font-size: medium;
}

.button-64:hover span {
  background: none;
}

@media (min-width: 768px) {
  .button-64 {
    font-size: 24px;
    min-width: 196px;
  }
}
/* CSS */

.listening-text{
  left: 44%;
  position: absolute;
  bottom: 25%;
  color: white;
}
.button-49,
.button-49:after {
  width: 150px;
  height: 76px;
  line-height: 78px;
  font-size:x-small;
  font-family: 'Bebas Neue', sans-serif;
  background: linear-gradient(45deg, transparent 5%, #7a5fff 5%);
  border: 0;
  color: #fff;
  letter-spacing: 3px;
  box-shadow: 6px 0px 0px #00E6F6;
  outline: transparent;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  left: 44%;
  position: absolute;
  bottom: 10%;

}

.button-49:after {
  --slice-0: inset(50% 50% 50% 50%);
  --slice-1: inset(80% -6px 0 0);
  --slice-2: inset(50% -6px 30% 0);
  --slice-3: inset(10% -6px 85% 0);
  --slice-4: inset(40% -6px 43% 0);
  --slice-5: inset(80% -6px 5% 0);
  
  content: 'ALTERNATE TEXT';
  display: block;
  background: linear-gradient(45deg, transparent 3%, #00E6F6 3%, #00E6F6 5%, #7a5fff 5%);
  text-shadow: -3px -3px 0px #F8F005, 3px 3px 0px #00E6F6;
  clip-path: var(--slice-0);
}

.button-49:hover:after {
  animation: 1s glitch;
  animation-timing-function: steps(2, end);
}

@keyframes glitch {
  0% {
    clip-path: var(--slice-1);
    transform: translate(-20px, -10px);
  }
  10% {
    clip-path: var(--slice-3);
    transform: translate(10px, 10px);
  }
  20% {
    clip-path: var(--slice-1);
    transform: translate(-10px, 10px);
  }
  30% {
    clip-path: var(--slice-3);
    transform: translate(0px, 5px);
  }
  40% {
    clip-path: var(--slice-2);
    transform: translate(-5px, 0px);
  }
  50% {
    clip-path: var(--slice-3);
    transform: translate(5px, 0px);
  }
  60% {
    clip-path: var(--slice-4);
    transform: translate(5px, 10px);
  }
  70% {
    clip-path: var(--slice-2);
    transform: translate(-10px, 10px);
  }
  80% {
    clip-path: var(--slice-5);
    transform: translate(20px, -10px);
  }
  90% {
    clip-path: var(--slice-1);
    transform: translate(-10px, 0px);
  }
  100% {
    clip-path: var(--slice-1);
    transform: translate(0);
  }
}

@media (min-width: 768px) {
  .button-49,
  .button-49:after {
    width: 200px;
    height: 86px;
    line-height: 88px;
  }
}
</style>
