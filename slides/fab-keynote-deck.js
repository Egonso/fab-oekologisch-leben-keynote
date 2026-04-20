const fs = require("fs");
const path = require("path");
const PptxGenJS = require("pptxgenjs");
const { calcTextBox } = require("./pptxgenjs_helpers/text");
const {
  imageSizingContain,
  imageSizingCrop,
} = require("./pptxgenjs_helpers/image");
const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("./pptxgenjs_helpers/layout");

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Codex";
pptx.company = "FAB";
pptx.subject = "KI, Unternehmertum und Coding mit KI";
pptx.title = "KI und die Zukunft von Unternehmertum und Coding mit KI";
pptx.lang = "de-DE";
pptx.theme = {
  headFontFace: "Avenir Next",
  bodyFontFace: "Avenir Next",
  lang: "de-DE",
};

const TOTAL_SLIDES = 14;

const C = {
  paper: "F5F3EE",
  ink: "1D201C",
  inkSoft: "2A2E29",
  inkMute: "6E756B",
  line: "D0D5CB",
  mist: "ECE8DE",
  accent: "345900",
  accentSoft: "6B8A45",
  night: "141713",
  white: "F9F8F3",
};

const FONT = {
  head: "Avenir Next",
  body: "Avenir Next",
};

const ROOT = path.resolve(__dirname, "..");
const asset = (...parts) => path.join(ROOT, ...parts);
const outFile = path.join(__dirname, "fab-keynote-deck.pptx");

const A = {
  momoSpeaking: asset("assets", "local", "momo-speaking.jpg"),
  momoPortrait: asset("assets", "local", "momo-portrait.jpg"),
  codex: asset("assets", "local", "codex-screenshot.png"),
  quickCapture: asset("assets", "local", "KIRegister_Quick-Capture_Screenshot.png"),
  quickCaptureInvestor: asset("assets", "local", "KIRegister_Quick-Capture_Investor.png"),
  pricing: asset("assets", "site", "screenshots", "gemini-pricing.png"),
  aiStudioDocs: asset("assets", "site", "screenshots", "ai-studio-build-mode-docs.png"),
  oelHome: asset("assets", "site", "screenshots", "oekologisch-leben-home.png"),
  banner: asset("assets", "site", "banner-final.png"),
  christoff: asset("assets", "site", "christoff-web.png"),
  design: asset("assets", "site", "design.webp"),
  homaHof: asset("assets", "site", "homa-hof-1.jpg"),
  team: asset("assets", "site", "team.png"),
  hero6: asset("assets", "site", "website-hero6.png"),
  hero7: asset("assets", "site", "website-hero7.png"),
  hero2: asset("assets", "site", "web-hero2.png"),
};

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function addBackground(slide, color = C.paper) {
  slide.background = { color };
}

function addChrome(slide, index, kicker, opts = {}) {
  const dark = opts.dark ?? false;
  addBackground(slide, dark ? C.night : C.paper);
  slide.addText(kicker.toUpperCase(), {
    x: 0.72,
    y: 0.27,
    w: 5.0,
    h: 0.18,
    fontFace: FONT.body,
    fontSize: 8.5,
    bold: true,
    color: dark ? "A2AA9C" : C.inkMute,
    charSpace: 1.4,
    margin: 0,
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 0.72,
    y: 0.62,
    w: 11.9,
    h: 0,
    line: { color: dark ? "2C312A" : C.line, pt: 1.05 },
  });
  slide.addText(`${String(index).padStart(2, "0")} / ${String(TOTAL_SLIDES).padStart(2, "0")}`, {
    x: 11.72,
    y: 0.24,
    w: 0.9,
    h: 0.18,
    align: "right",
    fontFace: FONT.body,
    fontSize: 8.5,
    color: dark ? "A2AA9C" : C.inkMute,
    margin: 0,
  });
}

function addTitle(slide, title, subtitle, opts = {}) {
  const x = opts.x ?? 0.72;
  const y = opts.y ?? 0.9;
  const w = opts.w ?? 7.2;
  const size = opts.size ?? 28;
  const titleColor = opts.color ?? C.ink;
  const subtitleColor = opts.subtitleColor ?? C.inkSoft;
  const titleBox = calcTextBox(size, {
    text: title,
    w,
    fontFace: FONT.head,
    margin: 0,
    leading: opts.leading ?? 1.02,
  });
  slide.addText(title, {
    x,
    y,
    w,
    h: titleBox.h + 0.04,
    fontFace: FONT.head,
    fontSize: size,
    bold: true,
    color: titleColor,
    margin: 0,
    valign: "mid",
  });
  let nextY = y + titleBox.h + 0.08;
  if (subtitle) {
    const subBox = calcTextBox(opts.subtitleSize ?? 13.5, {
      text: subtitle,
      w,
      fontFace: FONT.body,
      margin: 0,
      leading: opts.subtitleLeading ?? 1.2,
    });
    slide.addText(subtitle, {
      x,
      y: nextY,
      w,
      h: subBox.h + 0.02,
      fontFace: FONT.body,
      fontSize: opts.subtitleSize ?? 13.5,
      color: subtitleColor,
      margin: 0,
    });
    nextY += subBox.h + 0.04;
  }
  return nextY;
}

function addParagraph(slide, text, x, y, w, opts = {}) {
  const box = calcTextBox(opts.size ?? 14, {
    text,
    w,
    fontFace: FONT.body,
    margin: 0,
    leading: opts.leading ?? 1.2,
  });
  slide.addText(text, {
    x,
    y,
    w,
    h: box.h + 0.02,
    fontFace: FONT.body,
    fontSize: opts.size ?? 14,
    color: opts.color ?? C.ink,
    bold: opts.bold ?? false,
    margin: 0,
  });
}

function addTag(slide, text, x, y, w, opts = {}) {
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h: 0.28,
    fill: { color: opts.fill ?? C.paper, transparency: opts.transparency ?? 0 },
    line: { color: opts.line ?? C.accent, pt: 1 },
  });
  slide.addText(text, {
    x: x + 0.07,
    y: y + 0.04,
    w: w - 0.14,
    h: 0.14,
    fontFace: FONT.body,
    fontSize: 8.5,
    bold: true,
    align: "center",
    color: opts.color ?? C.accent,
    margin: 0,
  });
}

function addImageFrame(slide, imagePath, x, y, w, h, crop = false) {
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h,
    fill: { color: C.mist },
    line: { color: C.line, pt: 1 },
  });
  if (fileExists(imagePath)) {
    const sizing = crop
      ? imageSizingCrop(imagePath, x + 0.03, y + 0.03, w - 0.06, h - 0.06)
      : imageSizingContain(imagePath, x + 0.03, y + 0.03, w - 0.06, h - 0.06);
    slide.addImage({
      path: imagePath,
      ...sizing,
    });
  }
}

function addFullBleed(slide, imagePath, overlay = 0) {
  if (fileExists(imagePath)) {
    slide.addImage({
      path: imagePath,
      ...imageSizingCrop(imagePath, 0, 0, 13.333, 7.5),
    });
  }
  if (overlay > 0) {
    slide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 13.333,
      h: 7.5,
      fill: { color: C.night, transparency: overlay },
      line: { color: C.night, pt: 0 },
    });
  }
}

function addFlowArrow(slide, x1, y1, x2, y2, opts = {}) {
  slide.addShape(pptx.ShapeType.line, {
    x: x1,
    y: y1,
    w: x2 - x1,
    h: y2 - y1,
    line: {
      color: opts.color ?? C.accent,
      pt: opts.pt ?? 1.2,
      endArrowType: opts.endArrowType ?? "triangle",
    },
  });
}

function finalize(slide) {
  if (process.env.CHECK_LAYOUT === "1") {
    warnIfSlideHasOverlaps(slide, pptx, { ignoreDecorativeShapes: true });
  }
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

function slide1() {
  const slide = pptx.addSlide();
  addChrome(slide, 1, "FAB Keynote", { dark: true });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.72,
    y: 1.0,
    w: 0.12,
    h: 5.0,
    fill: { color: C.accent },
    line: { color: C.accent, pt: 0 },
  });
  slide.addText("KI verändert", {
    x: 1.02,
    y: 1.02,
    w: 5.8,
    h: 0.78,
    fontFace: FONT.head,
    fontSize: 33,
    bold: true,
    color: C.white,
    margin: 0,
  });
  slide.addText("wie Unternehmen", {
    x: 1.02,
    y: 1.88,
    w: 5.8,
    h: 0.78,
    fontFace: FONT.head,
    fontSize: 33,
    bold: true,
    color: C.white,
    margin: 0,
  });
  slide.addText("entstehen.", {
    x: 1.02,
    y: 2.76,
    w: 5.8,
    h: 0.86,
    fontFace: FONT.head,
    fontSize: 35,
    bold: true,
    color: C.white,
    margin: 0,
  });
  slide.addText("Unternehmertum. Coding. KI.", {
    x: 1.04,
    y: 3.96,
    w: 4.8,
    h: 0.26,
    fontFace: FONT.body,
    fontSize: 13.5,
    color: "D5D9D1",
    margin: 0,
  });
  slide.addText("KI", {
    x: 6.74,
    y: 0.82,
    w: 4.9,
    h: 1.24,
    fontFace: FONT.head,
    fontSize: 82,
    bold: true,
    color: "223321",
    margin: 0,
    align: "right",
  });
  addTag(slide, "Build", 1.02, 5.28, 0.92, {
    fill: "1C201B",
    line: "36542B",
    color: C.white,
  });
  addTag(slide, "Agenten", 2.12, 5.28, 1.16, {
    fill: "1C201B",
    line: "36542B",
    color: C.white,
  });
  addTag(slide, "Momentum", 3.48, 5.28, 1.34, {
    fill: "1C201B",
    line: "36542B",
    color: C.white,
  });
  addImageFrame(slide, A.oelHome, 7.62, 1.04, 4.6, 2.56, false);
  addImageFrame(slide, A.codex, 7.04, 3.62, 3.9, 2.92, true);
  addImageFrame(slide, A.quickCaptureInvestor, 11.08, 2.12, 1.54, 4.42, true);
  finalize(slide);
}

function slide2() {
  const slide = pptx.addSlide();
  addFullBleed(slide, A.momoSpeaking, 44);
  addChrome(slide, 2, "Momo", { dark: true });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.82,
    y: 1.08,
    w: 5.22,
    h: 5.4,
    fill: { color: C.night, transparency: 18 },
    line: { color: "2C312A", pt: 1 },
  });
  slide.addText("Builder.", {
    x: 1.08,
    y: 1.45,
    w: 4.2,
    h: 0.4,
    fontFace: FONT.head,
    fontSize: 26,
    bold: true,
    color: C.white,
    margin: 0,
  });
  slide.addText("Lehrender.", {
    x: 1.08,
    y: 2.04,
    w: 4.2,
    h: 0.4,
    fontFace: FONT.head,
    fontSize: 26,
    bold: true,
    color: C.white,
    margin: 0,
  });
  slide.addText("Strategieberater.", {
    x: 1.08,
    y: 2.63,
    w: 4.6,
    h: 0.42,
    fontFace: FONT.head,
    fontSize: 26,
    bold: true,
    color: C.white,
    margin: 0,
  });
  addParagraph(slide, "Von AI Studio bis Codex. Von Keynote bis Live-Deploy.", 1.08, 3.58, 4.3, {
    size: 13.5,
    color: "D3D8D1",
  });
  addTag(slide, "FH Salzburg", 1.08, 4.72, 1.38, {
    fill: "1B201A",
    line: "3A4036",
    color: C.white,
  });
  addTag(slide, "Uni Seeburg", 2.66, 4.72, 1.44, {
    fill: "1B201A",
    line: "3A4036",
    color: C.white,
  });
  addTag(slide, "3–5 Agenten parallel", 1.08, 5.14, 2.48, {
    fill: "1B201A",
    line: "3A4036",
    color: C.white,
  });
  finalize(slide);
}

function slide3() {
  const slide = pptx.addSlide();
  addFullBleed(slide, A.hero2, 32);
  addChrome(slide, 3, "Der Shift", { dark: true });
  slide.addText("Unternehmen", {
    x: 0.9,
    y: 2.0,
    w: 5.8,
    h: 0.56,
    fontFace: FONT.head,
    fontSize: 30,
    bold: true,
    color: C.white,
    margin: 0,
  });
  slide.addText("werden programmierbar.", {
    x: 0.9,
    y: 2.7,
    w: 6.5,
    h: 0.7,
    fontFace: FONT.head,
    fontSize: 32,
    bold: true,
    color: C.white,
    margin: 0,
  });
  addTag(slide, "weniger Teamgröße", 0.92, 4.62, 1.78, {
    fill: "1B201A",
    line: "36542B",
    color: C.white,
  });
  addTag(slide, "mehr Orchestrierung", 2.92, 4.62, 1.92, {
    fill: "1B201A",
    line: "36542B",
    color: C.white,
  });
  addTag(slide, "schnellere Zyklen", 5.08, 4.62, 1.86, {
    fill: "1B201A",
    line: "36542B",
    color: C.white,
  });
  finalize(slide);
}

function slide4() {
  const slide = pptx.addSlide();
  addChrome(slide, 4, "Vom Gedanken zum Produkt");
  addTitle(
    slide,
    "Von der Idee zur App in einem Vormittag",
    "",
    { x: 0.72, y: 1.0, w: 5.8, size: 26 }
  );
  const steps = [
    "Geschmack",
    "Kontext",
    "Prompt",
    "Preview",
    "Deploy",
  ];
  steps.forEach((step, index) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.92,
      y: 2.1 + index * 0.72,
      w: 5.35,
      h: 0.5,
      fill: { color: index === 4 ? C.accent : C.paper },
      line: { color: index === 4 ? C.accent : C.line, pt: 1 },
    });
    slide.addText(step, {
      x: 1.12,
      y: 2.25 + index * 0.72,
      w: 2.0,
      h: 0.14,
      fontFace: FONT.head,
      fontSize: 16,
      bold: true,
      color: index === 4 ? C.white : C.ink,
      margin: 0,
    });
  });
  addImageFrame(slide, A.codex, 7.0, 1.18, 5.55, 5.66, false);
  finalize(slide);
}

function slide5() {
  const slide = pptx.addSlide();
  addChrome(slide, 5, "Das Web ist einfacher");
  addTitle(slide, "Das Web ist leichter als es wirkt", "", {
    x: 0.72,
    y: 1.0,
    w: 9.0,
    size: 27,
  });
  const boxes = [
    { x: 0.9, t: "Idee" },
    { x: 3.1, t: "React" },
    { x: 5.3, t: "Build" },
    { x: 7.5, t: "HTML · CSS · JS" },
    { x: 10.15, t: "Browser" },
  ];
  boxes.forEach((box, index) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: box.x,
      y: 2.55,
      w: index === 3 ? 2.2 : 1.7,
      h: 0.88,
      fill: { color: index === 1 ? C.mist : C.paper },
      line: { color: index === 1 ? C.accent : C.line, pt: 1 },
    });
    slide.addText(box.t, {
      x: box.x + 0.12,
      y: 2.87,
      w: (index === 3 ? 2.2 : 1.7) - 0.24,
      h: 0.18,
      fontFace: FONT.head,
      fontSize: index === 3 ? 14 : 16,
      bold: true,
      align: "center",
      color: C.ink,
      margin: 0,
    });
    if (index < boxes.length - 1) {
      const startX = box.x + (index === 3 ? 2.22 : 1.72);
      addFlowArrow(slide, startX, 2.99, startX + 0.25, 2.99);
    }
  });
  addTag(slide, "Frontend", 1.24, 4.7, 1.12);
  addTag(slide, "Backend", 2.56, 4.7, 1.12);
  addTag(slide, "APIs", 3.88, 4.7, 0.82);
  addTag(slide, "Secrets", 4.92, 4.7, 0.92);
  finalize(slide);
}

function slide6() {
  const slide = pptx.addSlide();
  addChrome(slide, 6, "LLM vs Agent");
  addTitle(slide, "LLM ist nicht Agent", "", {
    x: 0.72,
    y: 1.0,
    w: 7.0,
    size: 28,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.88,
    y: 2.0,
    w: 5.75,
    h: 3.95,
    fill: { color: C.paper },
    line: { color: C.line, pt: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 6.72,
    y: 2.0,
    w: 5.75,
    h: 3.95,
    fill: { color: C.paper },
    line: { color: C.line, pt: 1 },
  });
  slide.addText("LLM", {
    x: 1.12,
    y: 2.42,
    w: 1.2,
    h: 0.24,
    fontFace: FONT.head,
    fontSize: 24,
    bold: true,
    color: C.accent,
    margin: 0,
  });
  slide.addText("schreibt\nstrukturiert\nantwortet", {
    x: 1.12,
    y: 3.12,
    w: 2.2,
    h: 1.2,
    fontFace: FONT.body,
    fontSize: 18,
    color: C.ink,
    margin: 0,
    breakLine: false,
  });
  slide.addText("Agent", {
    x: 6.98,
    y: 2.42,
    w: 1.6,
    h: 0.24,
    fontFace: FONT.head,
    fontSize: 24,
    bold: true,
    color: C.accent,
    margin: 0,
  });
  slide.addText("liest\nplant\nnutzt Tools\nführt aus", {
    x: 6.98,
    y: 3.08,
    w: 2.6,
    h: 1.36,
    fontFace: FONT.body,
    fontSize: 18,
    color: C.ink,
    margin: 0,
    breakLine: false,
  });
  addParagraph(
    slide,
    "Der Sprung für Unternehmen liegt in delegierbarer Arbeit, nicht nur in schönerem Output.",
    0.94,
    6.42,
    10.2,
    { size: 12.6, color: C.inkSoft }
  );
  finalize(slide);
}

function slide7() {
  const slide = pptx.addSlide();
  addChrome(slide, 7, "AI Studio");
  addTitle(slide, "Warum AI Studio so gut als Startpunkt funktioniert", "", {
    x: 0.72,
    y: 1.0,
    w: 5.7,
    size: 25,
  });
  addTag(slide, "Full-Stack", 0.92, 2.38, 1.18);
  addTag(slide, "Secrets", 2.26, 2.38, 1.02);
  addTag(slide, "npm", 3.46, 2.38, 0.72);
  addTag(slide, "GitHub", 4.34, 2.38, 0.96);
  addTag(slide, "Cloud Run", 5.46, 2.38, 1.16);
  slide.addText("leicht.\ndirekt.\nvisuell.", {
    x: 0.92,
    y: 3.2,
    w: 2.8,
    h: 1.7,
    fontFace: FONT.head,
    fontSize: 26,
    bold: true,
    color: C.ink,
    margin: 0,
    breakLine: false,
  });
  addImageFrame(slide, A.aiStudioDocs, 6.76, 1.1, 5.7, 5.84, false);
  finalize(slide);
}

function slide8() {
  const slide = pptx.addSlide();
  addChrome(slide, 8, "Kosten");
  addTitle(slide, "Später zahlt man für vier Dinge", "", {
    x: 0.72,
    y: 1.0,
    w: 7.0,
    size: 27,
  });
  const items = [
    { x: 0.92, y: 2.18, t: "Tokens" },
    { x: 3.22, y: 2.18, t: "Hosting" },
    { x: 0.92, y: 4.08, t: "Backend" },
    { x: 3.22, y: 4.08, t: "APIs" },
  ];
  items.forEach((item) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: item.x,
      y: item.y,
      w: 2.02,
      h: 1.35,
      fill: { color: C.paper },
      line: { color: C.line, pt: 1 },
    });
    slide.addText(item.t, {
      x: item.x + 0.16,
      y: item.y + 0.52,
      w: 1.7,
      h: 0.2,
      fontFace: FONT.head,
      fontSize: 21,
      bold: true,
      color: C.accent,
      align: "center",
      margin: 0,
    });
  });
  addImageFrame(slide, A.pricing, 7.0, 1.1, 5.5, 5.8, false);
  addParagraph(
    slide,
    "AI Studio selbst ist gratis nutzbar. Veröffentlichung und echte Infrastruktur sind die nächste Stufe.",
    0.92,
    6.28,
    5.45,
    { size: 11.8, color: C.inkSoft }
  );
  finalize(slide);
}

function slide9() {
  const slide = pptx.addSlide();
  addChrome(slide, 9, "Unternehmertum");
  addTitle(slide, "Billiger. Wertvoller.", "", {
    x: 0.72,
    y: 1.0,
    w: 5.0,
    size: 31,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.92,
    y: 2.05,
    w: 3.85,
    h: 4.7,
    fill: { color: C.paper },
    line: { color: C.line, pt: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 4.98,
    y: 2.05,
    w: 3.85,
    h: 4.7,
    fill: { color: C.paper },
    line: { color: C.line, pt: 1 },
  });
  slide.addText("Billiger", {
    x: 1.14,
    y: 2.38,
    w: 2.2,
    h: 0.24,
    fontFace: FONT.head,
    fontSize: 24,
    bold: true,
    color: C.accent,
    margin: 0,
  });
  slide.addText("Prototypen\nContent\nTools\nTests\nDeploys", {
    x: 1.14,
    y: 3.18,
    w: 2.4,
    h: 1.8,
    fontFace: FONT.body,
    fontSize: 18,
    color: C.ink,
    margin: 0,
    breakLine: false,
  });
  slide.addText("Wertvoller", {
    x: 5.18,
    y: 2.38,
    w: 2.4,
    h: 0.24,
    fontFace: FONT.head,
    fontSize: 24,
    bold: true,
    color: C.accent,
    margin: 0,
  });
  slide.addText("Richtung\nGeschmack\nVertrauen\nSysteme\nUrteil", {
    x: 5.18,
    y: 3.18,
    w: 2.4,
    h: 1.8,
    fontFace: FONT.body,
    fontSize: 18,
    color: C.ink,
    margin: 0,
    breakLine: false,
  });
  addImageFrame(slide, A.momoPortrait, 9.08, 2.05, 3.42, 4.7, true);
  finalize(slide);
}

function slide10() {
  const slide = pptx.addSlide();
  addChrome(slide, 10, "Ökologisch Leben");
  addImageFrame(slide, A.oelHome, 0.78, 1.06, 4.1, 5.8, false);
  addImageFrame(slide, A.hero7, 5.12, 1.06, 2.8, 2.05, true);
  addImageFrame(slide, A.homaHof, 8.12, 1.06, 4.42, 2.05, true);
  addImageFrame(slide, A.banner, 5.12, 3.33, 7.42, 1.92, true);
  addImageFrame(slide, A.team, 5.12, 5.45, 3.6, 1.4, true);
  addImageFrame(slide, A.christoff, 8.94, 5.45, 1.12, 1.4, true);
  slide.addShape(pptx.ShapeType.rect, {
    x: 10.24,
    y: 5.45,
    w: 2.3,
    h: 1.4,
    fill: { color: C.paper },
    line: { color: C.line, pt: 1 },
  });
  slide.addText("Nicht kopieren.\nNeu denken.", {
    x: 10.44,
    y: 5.82,
    w: 1.9,
    h: 0.42,
    fontFace: FONT.head,
    fontSize: 18,
    bold: true,
    color: C.accent,
    align: "center",
    margin: 0,
  });
  finalize(slide);
}

function slide11() {
  const slide = pptx.addSlide();
  addChrome(slide, 11, "Was ihr baut");
  addTitle(slide, "Vier Dinge reichen für den Start", "", {
    x: 0.72,
    y: 1.0,
    w: 7.0,
    size: 27,
  });
  const blocks = [
    { x: 0.92, y: 2.08, t: "Portfolio" },
    { x: 3.25, y: 2.08, t: "Design Doc" },
    { x: 0.92, y: 4.22, t: "GitHub" },
    { x: 3.25, y: 4.22, t: "Deploy" },
  ];
  blocks.forEach((block, index) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: block.x,
      y: block.y,
      w: 2.05,
      h: 1.56,
      fill: { color: index === 3 ? C.accent : C.paper },
      line: { color: index === 3 ? C.accent : C.line, pt: 1 },
    });
    slide.addText(block.t, {
      x: block.x + 0.12,
      y: block.y + 0.62,
      w: 1.81,
      h: 0.22,
      fontFace: FONT.head,
      fontSize: 20,
      bold: true,
      color: index === 3 ? C.white : C.ink,
      align: "center",
      margin: 0,
    });
  });
  addImageFrame(slide, A.hero6, 6.12, 1.1, 6.34, 5.78, true);
  finalize(slide);
}

function slide12() {
  const slide = pptx.addSlide();
  addChrome(slide, 12, "20€ Challenge");
  slide.addText("20€", {
    x: 0.88,
    y: 1.28,
    w: 2.1,
    h: 0.62,
    fontFace: FONT.head,
    fontSize: 44,
    bold: true,
    color: C.accent,
    margin: 0,
  });
  slide.addText("Challenge", {
    x: 0.92,
    y: 2.05,
    w: 3.0,
    h: 0.34,
    fontFace: FONT.head,
    fontSize: 24,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  addTag(slide, "bauen", 0.96, 3.18, 0.92);
  addTag(slide, "submitten", 2.06, 3.18, 1.16);
  addTag(slide, "ranken", 3.42, 3.18, 1.02);
  addTag(slide, "gewinnen", 4.64, 3.18, 1.14);
  addFlowArrow(slide, 1.9, 3.32, 2.0, 3.32);
  addFlowArrow(slide, 3.18, 3.32, 3.34, 3.32);
  addFlowArrow(slide, 4.52, 3.32, 4.56, 3.32);
  addParagraph(
    slide,
    "Klasse rankt Klasse. Bestes Design gewinnt automatisch.",
    0.96,
    4.1,
    4.9,
    { size: 13, color: C.inkSoft }
  );
  addImageFrame(slide, A.christoff, 6.86, 1.18, 1.8, 2.42, true);
  addImageFrame(slide, A.codex, 8.92, 1.18, 3.58, 3.06, true);
  slide.addText("Wartezeit = Parallelzeit", {
    x: 6.92,
    y: 4.82,
    w: 4.8,
    h: 0.32,
    fontFace: FONT.head,
    fontSize: 24,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  addTag(slide, "Portfolio", 6.94, 5.68, 1.08);
  addTag(slide, "Challenge", 8.22, 5.68, 1.18);
  addTag(slide, "Agenten parallel", 9.62, 5.68, 1.72);
  finalize(slide);
}

function slide13() {
  const slide = pptx.addSlide();
  addChrome(slide, 13, "Tool Surfaces");
  addImageFrame(slide, A.codex, 0.78, 1.02, 7.15, 5.95, false);
  slide.addShape(pptx.ShapeType.rect, {
    x: 8.28,
    y: 1.02,
    w: 4.32,
    h: 5.95,
    fill: { color: C.paper },
    line: { color: C.line, pt: 1 },
  });
  slide.addText("Gleiche Logik.", {
    x: 8.62,
    y: 1.45,
    w: 3.2,
    h: 0.32,
    fontFace: FONT.head,
    fontSize: 26,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  slide.addText("Andere Oberfläche.", {
    x: 8.62,
    y: 2.02,
    w: 3.4,
    h: 0.32,
    fontFace: FONT.head,
    fontSize: 26,
    bold: true,
    color: C.accent,
    margin: 0,
  });
  addTag(slide, "AI Studio", 8.62, 3.22, 1.14);
  addTag(slide, "Codex", 9.94, 3.22, 0.92);
  addTag(slide, "Cloud Code", 8.62, 3.68, 1.32);
  addTag(slide, "Antigravity", 10.12, 3.68, 1.42);
  addParagraph(
    slide,
    "Wichtig ist nicht die Oberfläche allein. Wichtig ist, wie schnell sie euch zu einem besseren Zustand bringt.",
    8.62,
    4.78,
    3.4,
    { size: 12.8, color: C.inkSoft }
  );
  finalize(slide);
}

function slide14() {
  const slide = pptx.addSlide();
  addFullBleed(slide, A.momoSpeaking, 58);
  addChrome(slide, 14, "Schluss", { dark: true });
  slide.addText("Die Zukunft gehört den Menschen,", {
    x: 0.92,
    y: 1.38,
    w: 6.2,
    h: 0.5,
    fontFace: FONT.head,
    fontSize: 28,
    bold: true,
    color: C.white,
    margin: 0,
  });
  slide.addText("die mit KI schneller echte Produkte bauen.", {
    x: 0.92,
    y: 2.12,
    w: 6.8,
    h: 0.62,
    fontFace: FONT.head,
    fontSize: 30,
    bold: true,
    color: C.white,
    margin: 0,
  });
  addTag(slide, "denken", 0.94, 5.4, 0.96, {
    fill: "1B201A",
    line: "36542B",
    color: C.white,
  });
  addTag(slide, "bauen", 2.08, 5.4, 0.96, {
    fill: "1B201A",
    line: "36542B",
    color: C.white,
  });
  addTag(slide, "testen", 3.22, 5.4, 0.96, {
    fill: "1B201A",
    line: "36542B",
    color: C.white,
  });
  addTag(slide, "veröffentlichen", 4.36, 5.4, 1.52, {
    fill: "1B201A",
    line: "36542B",
    color: C.white,
  });
  finalize(slide);
}

slide1();
slide2();
slide3();
slide4();
slide5();
slide6();
slide7();
slide8();
slide9();
slide10();
slide11();
slide12();
slide13();
slide14();

pptx.writeFile({ fileName: outFile });
