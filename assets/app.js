/* 파일: dist/assets/app.js — 콘텐츠 체험과 접근성 조작 */
"use strict";
const APP_VERSION = "0.1.1";
const VERSION_HISTORY = [{ version: "0.1.1", date: "2026-11-03", summary: "임시 로고를 AI 교육 센터로 정리하고, 빛의 동행 자원봉사와 지역복지관 제안 문구를 반영했어요." }, { version: "0.1.0", date: "2026-11-02", summary: "교육 소개, 콘텐츠 체험, 앱 안내와 협력 제안 페이지를 만들었어요." }];
const LESSONS = [
  {
    category: "AI 첫걸음", title: "AI는 어떤 일을 도와줄까요?", summary: "AI가 잘하는 일과 함께 살펴볼 점을 알아봐요.",
    paragraphs: [
      "인공지능, 줄여서 AI는 우리가 주는 질문이나 자료를 바탕으로 글을 만들거나 정보를 정리하는 일을 도와주는 기술이에요.",
      "예를 들어 친구에게 보낼 안부 인사의 초안을 부탁하거나, 긴 안내문을 짧게 정리해 달라고 요청할 수 있어요. 내가 원하는 길이와 말투도 함께 알려줄 수 있어요.",
      "다만 AI의 답변이 언제나 정확한 것은 아니에요. 중요한 정보는 원래 안내문이나 공식 출처와 함께 확인하는 것이 좋아요.",
      "가볍게 연습해 볼까요? ‘친구에게 보낼 따뜻한 안부 인사를 세 문장으로 써줘’라고 질문해 보세요. 나온 답변에서 나에게 맞는 표현을 고르고 바꾸는 것까지가 연습이에요."
    ]
  },
  {
    category: "질문 연습", title: "원하는 답에 가까워지는 질문", summary: "목적과 상황, 원하는 형식을 함께 알려주는 연습이에요.",
    paragraphs: [
      "AI에게 질문할 때는 무엇을 하고 싶은지 먼저 알려주면 좋아요. 여기에 나의 상황과 원하는 답변의 형식을 더하면 답을 이해하기가 쉬워져요.",
      "예를 들어 ‘여행 계획을 짜줘’라는 질문에 조건을 더해 볼게요. ‘서울에서 지하철로 갈 수 있는 당일 여행을 계획하고 있어. 이동이 적은 코스 두 곳과 쉬는 시간을 포함해 짧게 정리해 줘.’ 이렇게 바꿀 수 있어요.",
      "답변이 너무 길다면 ‘핵심만 세 가지로 요약해 줘’라고 다시 요청할 수 있어요. 어려운 말이 있다면 ‘처음 배우는 사람도 이해할 수 있게 설명해 줘’라고 이어서 물어봐도 괜찮아요.",
      "한 번에 완벽하게 질문하지 않아도 돼요. 내가 필요한 일을 하나 떠올리고, 목적과 상황, 원하는 형식을 차례로 더해 보세요. 교통편이나 운영 시간처럼 달라질 수 있는 정보는 공식 안내로 확인해요."
    ]
  },
  {
    category: "함께 확인하기", title: "AI의 답변, 한 번 더 살펴봐요", summary: "출처와 날짜를 확인하고, 중요한 판단은 함께 검토해요.",
    paragraphs: [
      "AI는 자연스럽고 자신 있게 말해도 틀릴 수 있어요. 실제로 없는 정보를 만들거나, 오래된 내용을 현재의 사실처럼 설명하는 경우도 있어요.",
      "답변을 받으면 정보가 어디에서 나왔는지, 언제 작성된 것인지 살펴보세요. 기관의 공식 홈페이지나 원래 안내문과 비교하면 도움이 돼요. AI가 알려준 출처가 실제로 있는지도 확인해요.",
      "개인정보를 넣는 질문에도 주의가 필요해요. 이름, 연락처, 주소와 같은 정보가 포함된 문서나 사진을 보낼 때는 꼭 필요한 부분인지 먼저 생각해 봐요.",
      "AI의 답변은 나의 판단을 돕는 참고자료예요. 연습할 때는 안내문을 요약해 달라고 한 뒤 원문과 빠진 내용이 있는지 비교해 보세요. 중요한 결정이나 이동의 안전을 AI 답변 하나에 맡기지 않는 것도 함께 기억해요."
    ]
  }
];
const element = (id) => document.getElementById(id);
const speechAvailable = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
let selectedLesson = 0;
let speechState = "idle";
let currentParagraph = 0;
let playbackGeneration = 0;
let currentUtterance = null;

// 개인 보기 선호만 이 브라우저에 저장하며, 차단된 저장소에서도 동작한다.
function storePreference(key, value) { try { localStorage.setItem(key, value); } catch { /* 저장이 막혀도 화면 조작은 유지한다. */ } }
function readPreference(key) { try { return localStorage.getItem(key); } catch { return null; } }

// 사용자 보기 선호와 버튼의 눌림 상태를 함께 반영한다.
function applyPreferences(large, contrast) {
  document.documentElement.dataset.largeText = String(large);
  document.documentElement.dataset.contrast = contrast ? "max" : "standard";
  element("font-toggle").setAttribute("aria-pressed", String(large));
  element("font-toggle").setAttribute("aria-label", large ? "기본 글자 크기 사용" : "큰 글자 사용");
  element("contrast-toggle").setAttribute("aria-pressed", String(contrast));
  element("contrast-toggle").setAttribute("aria-label", contrast ? "기본 대비 사용" : "대비 강화 사용");
}

// 현재 재생 상태에 맞게 조작 이름과 대본 강조를 동기화한다.
function updatePlayer(message) {
  element("play-label").textContent = speechState === "playing" ? "일시정지" : speechState === "paused" ? "이어서 듣기" : "음성으로 듣기";
  element("play-icon").innerHTML = speechState === "playing" ? '<path d="M8 5v14M16 5v14"/>' : '<path d="m8 5 11 7-11 7V5Z"/>';
  element("stop-button").disabled = speechState === "idle";
  const total = LESSONS[selectedLesson].paragraphs.length;
  element("paragraph-status").textContent = speechState === "idle" ? `총 ${total}개 문단` : `${currentParagraph + 1} / ${total} 문단`;
  element("lesson-transcript").querySelectorAll("p").forEach((p, i) => p.classList.toggle("reading", speechState !== "idle" && i === currentParagraph));
  if (message) element("play-status").textContent = message;
}

// 이 페이지가 시작한 음성만 취소하고 늦게 도착하는 이벤트를 무효화한다.
function stopSpeech(message = "재생을 멈췄어요. 처음부터 다시 들을 수 있어요.") {
  playbackGeneration += 1;
  if (speechAvailable && currentUtterance) window.speechSynthesis.cancel();
  currentUtterance = null;
  speechState = "idle";
  currentParagraph = 0;
  updatePlayer(message);
}

// 짧은 문단 단위로 한국어 음성을 읽고 정상 종료 뒤 다음 문단을 이어간다.
function speakParagraph(generation) {
  if (generation !== playbackGeneration) return;
  const lesson = LESSONS[selectedLesson];
  if (currentParagraph >= lesson.paragraphs.length) { stopSpeech("수업을 모두 들었어요. 대본을 다시 읽으며 연습해 보세요."); return; }
  try {
    const utterance = new SpeechSynthesisUtterance(lesson.paragraphs[currentParagraph]);
    currentUtterance = utterance;
    utterance.lang = "ko-KR";
    utterance.rate = Number(element("speed").value);
    const koreanVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("ko"));
    if (koreanVoice) utterance.voice = koreanVoice;
    utterance.onstart = () => { if (generation === playbackGeneration) updatePlayer(`${lesson.title}. ${currentParagraph + 1}번째 문단을 읽고 있어요.`); };
    utterance.onend = () => { if (generation === playbackGeneration) { currentParagraph += 1; speakParagraph(generation); } };
    utterance.onerror = (event) => {
      if (generation !== playbackGeneration || ["canceled", "interrupted"].includes(event.error)) return;
      stopSpeech("이 기기에서 음성을 읽을 수 없어요. 아래 대본으로 같은 내용을 읽을 수 있어요.");
    };
    speechState = "playing";
    updatePlayer("음성 재생을 준비하고 있어요.");
    window.speechSynthesis.speak(utterance);
  } catch { stopSpeech("음성 기능을 사용할 수 없어요. 아래 대본은 그대로 읽을 수 있어요."); }
}

// 사용자 클릭에만 음성 재생·일시정지·다시 듣기를 실행한다.
function togglePlayback() {
  if (!speechAvailable) { updatePlayer("이 브라우저는 음성 읽기를 지원하지 않아요. 아래 대본을 이용할 수 있어요."); return; }
  if (speechState === "playing") { window.speechSynthesis.pause(); speechState = "paused"; updatePlayer("일시정지했어요. 이어서 듣기를 누르면 계속 읽어드려요."); return; }
  if (speechState === "paused") { window.speechSynthesis.resume(); speechState = "playing"; updatePlayer("이어서 읽고 있어요."); return; }
  playbackGeneration += 1;
  currentParagraph = 0;
  speakParagraph(playbackGeneration);
}

// 선택한 수업의 제목과 대본을 변경하고 화면읽기 초점을 제목으로 보낸다.
function selectLesson(index) {
  if (!Number.isInteger(index) || !LESSONS[index]) return;
  stopSpeech("");
  selectedLesson = index;
  const lesson = LESSONS[index];
  element("lesson-title").textContent = lesson.title;
  element("lesson-category").textContent = lesson.category;
  element("lesson-summary").textContent = lesson.summary;
  element("lesson-counter").textContent = `${String(index + 1).padStart(2, "0")} / 03`;
  element("lesson-transcript").replaceChildren(...lesson.paragraphs.map((text) => { const p = document.createElement("p"); p.textContent = text; return p; }));
  document.querySelectorAll("[data-lesson]").forEach((button) => { const active = Number(button.dataset.lesson) === index; button.classList.toggle("selected", active); button.setAttribute("aria-pressed", String(active)); });
  updatePlayer("수업을 선택했어요. 음성으로 듣거나 대본을 읽을 수 있어요.");
  element("lesson-title").focus({ preventScroll: true });
  if (window.matchMedia("(max-width: 720px)").matches) element("lesson-title").scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
}

applyPreferences(readPreference("bd-large-text") === "true", readPreference("bd-contrast") === "true");
element("font-toggle").addEventListener("click", () => { const next = element("font-toggle").getAttribute("aria-pressed") !== "true"; applyPreferences(next, element("contrast-toggle").getAttribute("aria-pressed") === "true"); storePreference("bd-large-text", String(next)); });
element("contrast-toggle").addEventListener("click", () => { const next = element("contrast-toggle").getAttribute("aria-pressed") !== "true"; applyPreferences(element("font-toggle").getAttribute("aria-pressed") === "true", next); storePreference("bd-contrast", String(next)); });
document.querySelectorAll("[data-lesson]").forEach((button) => button.addEventListener("click", () => selectLesson(Number(button.dataset.lesson))));
element("play-toggle").addEventListener("click", togglePlayback);
element("stop-button").addEventListener("click", () => stopSpeech());
element("speed").addEventListener("change", () => {
  if (speechState === "idle") return;
  const paragraph = currentParagraph;
  stopSpeech("");
  currentParagraph = paragraph;
  speakParagraph(playbackGeneration);
});
window.addEventListener("pagehide", () => stopSpeech(""));
element("svil-year").textContent = String(new Date().getFullYear());
document.querySelectorAll("[data-version]").forEach((node) => { node.textContent = `v${APP_VERSION}`; });
element("version-list").replaceChildren(...VERSION_HISTORY.map((item) => { const li = document.createElement("li"); li.textContent = `${item.date} · v${item.version} · ${item.summary}`; return li; }));
if (!speechAvailable) { element("play-toggle").disabled = true; element("speed").disabled = true; updatePlayer("이 브라우저는 음성 읽기를 지원하지 않아요. 아래 대본으로 같은 내용을 읽을 수 있어요."); }
