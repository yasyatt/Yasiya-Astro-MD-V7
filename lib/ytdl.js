const axios = require('axios')
// import { millisToMinutesAndSeconds } from "../../helpers/formatter";
const yts = require('yt-search');

function millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < '10' ? '0' : '') + seconds;
}


const yt1s = (url, quality = '480p') => {
    return new Promise(async (resolve, reject) => {
        try {
            const config = {
                payload: {
                    q: url,
                    vt: 'home'
                },
                headers: {
                    'Accept-Encoding': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Host': 'yt1s.com',
                    'origin': 'https://yt1s.com',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Mobile Safari/537.36',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }
            const yt = await axios.post('https://yt1s.com/api/ajaxSearch/index', new URLSearchParams(config.payload), {
                headers: config.headers,
            });
            const mp3 = yt.data.links.mp3;

            // const sdLow = Object.values(mp4).find(v => {
            //     return v.q === '360p'
            // });
            // const sd = Object.values(mp4).find(v => v.q === '480p');
            const audio = Object.values(mp3).find(v => v.q === '128kbps');
            const search = await yts(yt.data.title);

            const result = {
                info: {
                    title: yt.data.title,
                    time: millisToMinutesAndSeconds(yt.data.t * 1000),
                    thumbnail: search.videos[0].thumbnail,
                    vid: yt.data.vid
                },
                media: {
                    mp3: {
                        extension: audio.f,
                        quality: audio.q,
                        size: audio.size,
                        link: await convertLink(audio.k, yt.data.vid)
                    }
                }
            };
            resolve(result);
        } catch (error) {
            reject(error);
        }
    })
}

const convertLink = async (k, vid) => {
    return new Promise((resolve, reject) => {
        axios.post('https://yt1s.com/api/ajaxConvert/convert', new URLSearchParams({ k, vid }))
            .then((res) => {
                resolve(res.data.dlink);
            }).catch((err) => {
                reject(err);
            });
    });
}

module.exports = { yt1s }
