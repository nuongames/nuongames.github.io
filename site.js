"use strict";
(() => {
  const config = window.STUDIO_CONFIG || {};
  const name = typeof config.name === "string" && config.name.trim() ? config.name.trim() : "Nuon games";
  document.querySelectorAll("[data-studio]").forEach(el => { el.textContent = name; });
  document.getElementById("year").textContent = new Date().getFullYear();
  const policy = document.getElementById("policy-content");
  const translations = {
    ko: {
      skip: "본문으로 바로가기", home: "홈", navigation: "주 메뉴", language: "언어 선택", studio: "스튜디오", contact: "문의", back: "홈으로",
      heroDescription: "누구나 바로 즐기는, 기분 좋은 한 판.", aboutDescription: "짧은 플레이에 재미를 담는 하이퍼 캐주얼 게임 스튜디오.",
      art: "선명한 블록과 점프 트랙으로 표현한 하이퍼 캐주얼 게임의 세계", contactTitle: "문의하기", email: "이메일 보내기", pending: "연락처 준비 중",
      privacy: "개인정보처리방침", policyBody: "개인정보처리방침 본문", policyPending: "개인정보처리방침 내용을 준비 중입니다.", updated: "최종 수정일: ",
      title: name + " — One tap. Pure fun.", description: config.description || name + ", 하이퍼 캐주얼 게임 스튜디오."
    },
    en: {
      skip: "Skip to content", home: "Home", navigation: "Main navigation", language: "Choose language", studio: "Studio", contact: "Contact", back: "Back to home",
      heroDescription: "A happy little game anyone can jump into.", aboutDescription: "A hyper casual studio packing big fun into short plays.",
      art: "Bright blocks and jump tracks in a hyper casual game world", contactTitle: "Get in touch", email: "Send an email", pending: "Contact details coming soon",
      privacy: "Privacy Policy", policyBody: "Privacy policy content", policyPending: "Our privacy policy is being prepared.", updated: "Last updated: ",
      title: name + " — One tap. Pure fun.", description: config.descriptionEn || name + ". Hyper casual games. One tap. Pure fun."
    }
  };
  let privacyUrl = null;
  try { const url = new URL(config.privacyUrl || "./privacy.html", location.href); if (["https:", "http:"].includes(url.protocol)) privacyUrl = url; } catch { /* 잘못된 외부 주소를 사용하지 않습니다. */ }
  function renderPolicy(language, copy) {
    const content = window.PRIVACY_CONTENT && window.PRIVACY_CONTENT[language];
    const sections = content && Array.isArray(content.sections) ? content.sections.filter(s => s && typeof s.title === "string" && (Array.isArray(s.paragraphs) || Array.isArray(s.blocks))) : [];
    policy.lang = content && content.language ? content.language : language;
    function appendFragments(element, fragments) {
      (fragments || []).forEach(fragment => {
        if (typeof fragment.text !== "string") return;
        if (fragment.href) {
          try {
            const url = new URL(fragment.href);
            if (["https:", "http:", "mailto:"].includes(url.protocol)) {
              const link = document.createElement("a"); link.href = url.href; link.textContent = fragment.text; element.append(link); return;
            }
          } catch { /* 잘못된 링크는 텍스트로 표시합니다. */ }
        }
        element.append(document.createTextNode(fragment.text));
      });
    }
    policy.replaceChildren();
    if (!sections.length) {
      const message = document.createElement("p"); message.className = "policy-empty"; message.textContent = copy.policyPending; policy.append(message);
    } else {
      sections.forEach(section => {
        const container = document.createElement("section");
        if (section.title !== "Privacy Policy") { const heading = document.createElement("h2"); heading.textContent = section.title; container.append(heading); }
        if (Array.isArray(section.blocks)) {
          section.blocks.forEach(block => {
            if (block.type === "paragraph") { const paragraph = document.createElement("p"); appendFragments(paragraph, block.fragments); container.append(paragraph); }
            if (block.type === "list") { const list = document.createElement("ul"); (block.items || []).forEach(item => { const li = document.createElement("li"); appendFragments(li, item); list.append(li); }); container.append(list); }
          });
        } else {
          section.paragraphs.forEach(text => { if (typeof text === "string") { const paragraph = document.createElement("p"); paragraph.textContent = text; container.append(paragraph); } });
        }
        policy.append(container);
      });
    }
    const updated = document.getElementById("policy-updated");
    updated.hidden = !(sections.length && content && content.updated);
    updated.textContent = updated.hidden ? "" : copy.updated + content.updated;
  }
  function setLanguage(language) {
    const copy = translations[language];
    document.documentElement.lang = language;
    document.title = policy ? copy.privacy + " — " + name : copy.title;
    document.querySelector('meta[name="description"]').content = policy ? copy.privacy + " — " + name : copy.description;
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = copy[el.dataset.i18n]; });
    document.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", copy[el.dataset.i18nAria]); });
    document.querySelectorAll("[data-language]").forEach(button => { button.setAttribute("aria-pressed", String(button.dataset.language === language)); });
    const link = document.getElementById("privacy-link");
    if (link && privacyUrl) { const url = new URL(privacyUrl.href); if (url.origin === location.origin) url.searchParams.set("lang", language); link.href = url.href; }
    if (policy) renderPolicy(language, copy);
  }
  document.querySelectorAll("[data-language]").forEach(button => { button.addEventListener("click", () => setLanguage(button.dataset.language)); });
  setLanguage(policy && new URLSearchParams(location.search).get("lang") === "en" ? "en" : "ko");
  const email = typeof config.email === "string" ? config.email.trim() : "";
  const contact = document.getElementById("contact-email");
  if (contact && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(email)) {
    contact.href = "mailto:" + email; contact.hidden = false;
    document.getElementById("contact-pending").hidden = true;
    document.getElementById("email-label").textContent = email;
  }
})();


