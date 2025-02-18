import axios from "axios"
// import ytdl from "ytdl-core";
const breakSearchTermDownForYoutubeUrl = (term) => {
    return `${term.replace(/ /g, "+")}` 
}

const getPageToScrape = async (link) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  return page
}

export const scapeYoutubeLink = async (term) => {
    
    let url = breakSearchTermDownForYoutubeUrl(term)
    
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${url}&key=AIzaSyCriz5dDPHWXfxT7WGWSgPsnRclSDN2vE4`,
    )
    .then(async (res) => {

      
      try {
        const videoUrl = `https://www.youtube.com/watch?v=${res.data.items[1].id.videoId}`;
        console.log(videoUrl)
        // const videoInfo = await ytdl.getInfo(videoUrl);
        // const audioFormats = ytdl.filterFormats(videoInfo.formats, "audioonly");
        // return audioFormats[0].url
       
      } catch (error) {
        console.log(error);
      }
    } )
     


};
// Start the scraping
// scapeYoutubeLink("acevane");

scapeYoutubeLink