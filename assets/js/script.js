
// DOM Elements
const audioFile = document.getElementById("audio-upload");
const conversionType = document.getElementById("conversiontype");
const convertBtn = document.getElementById("convert");
const res_blk = document.getElementById("res_blk");
const err_blk = document.getElementById("err_blk");
let results = document.getElementById("results");
const loader = document.querySelector("#loader");
const loadSampleBtn = document.getElementById("loadsample");
const sampleAudio = document.getElementById("sample-audio");
// Open AI URL's
const translateOpenAI_URL = "https://api.openai.com/v1/audio/translations";
const transcribeOpenAI_URL = "https://api.openai.com/v1/audio/transcriptions";

const headers = {
  Authorization: `Bearer ${window.OPEN_AI_KEY}`,
};

async function audioToText(selectedAudioFile, selectedConversionType) {
  loader.classList.remove("d-none");
  let data = new FormData();
  let dataObj;
  let URL = "";
  res_blk.classList.add("d-none");
  err_blk.classList.add("d-none");
  err_blk.innerHTML = null;
  if (selectedConversionType === "transcript") {
    data.append("file", selectedAudioFile);
    data.append("model", "whisper-1");
    data.append("language", "en");
    URL = translateOpenAI_URL;
  } else {
    data.append("file", selectedAudioFile);
    data.append("model", "whisper-1");
    URL = transcribeOpenAI_URL;
  }
  dataObj = {
    headers: headers,
    method: "POST",
    body: data,
  };
  try {
    const response = await fetch(URL, dataObj);
    if (!response.ok) {
      const err = await response.json();
      console.log(err.error.message);
      throw new Error(`${err.error.message}`);
    }
    const res = await response.json();
    res_blk.classList.remove("d-none");
    results.innerHTML = res.text;
  } catch (error) {
    console.log(error.message);
    err_blk.classList.remove("d-none");
    err_blk.innerHTML = error.message;
    res_blk.classList.add("d-none");
  } finally {
    loader.classList.add("d-none");
    conversionType.selectedIndex = 0;
    audioFile.value = "";
  }
}

async function convertSampleAudio(params) {
  const response = await fetch(sampleAudio.src);
  const blob = await response.blob();
  const file = new File([blob], "sample.mp3", { type: "audio/mpeg" });
  console.log(response);
  console.log(blob);
  console.log(file);
  audioToText(file, "transcript");
}

loadSampleBtn.addEventListener("click", convertSampleAudio);

convertBtn.addEventListener("click", (e) => {
  if (audioFile.value === "") {
    alert("please select a file");
    return;
  }
  if (conversionType.value === "") {
    alert("please select the conversion type");
    conversionType.focus();
    return;
  } else {
    audioToText(audioFile.files[0], conversionType.value);
  }
});