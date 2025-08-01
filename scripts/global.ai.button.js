class AIModal {
  constructor(triggerSelector, modalSelector) {
    this.trigger = document.querySelector(triggerSelector);
    this.modal = document.querySelector(modalSelector);
    this.popper = null;

    this.wavyTalkToWavyContainer = document.getElementById("wavyTalkToWavyContainer");

    this.initialWavyModal = document.getElementById("initialWavyModal");
    this.recentWavyModal = document.getElementById("recentWavyModal");
    this.wavyDefaultLinkContainer = document.getElementById("wavyDefaultLinkContainer");
    this.defaultListOptions = document.getElementById("defaultListOptions");
    this.wavyHomeContainer = document.getElementById("wavyHomeContainer");
    this.closeWavyDefaultOpenContainer = document.getElementById("closeWavyDefaultOpenContainer");
    this.sendCompletedSpeakingTyping = document.getElementById("sendCompletedSpeakingTyping");

    this.changeWavyRequestType = document.getElementById("changeWavyRequestType");
    this.speakingModeContainer = document.getElementById("speakingModeContainer");
    this.typingModeContainer = document.getElementById("typingModeContainer");
    this.toggleColloquialTone = document.getElementById("toggleColloquialTone");

    this.#bindEvents();
    this.#bindViewAllEvents();
    this.#bindTalkToWavyEvents();
    this.#bindTalkToWavyTypingEvents();

    this.init();
  }

  init() {
    // change request type
    this.changeWavyRequestType.addEventListener("click", (e) => {
      e.stopPropagation();

      const { mode } = this.wavyTalkToWavyContainer.dataset;

      if (mode === "voice") {
        this.wavyTalkToWavyContainer.dataset.mode = "typing";
      } else {
        this.wavyTalkToWavyContainer.dataset.mode = "voice";
      }
    });

    // toggle colloquial tone
    this.toggleColloquialTone.addEventListener("change", (e) => {
      e.stopPropagation();

      if (e.target.checked) {
        this.wavyTalkToWavyContainer.setAttribute("data-colloquial-tone", "true");
      } else {
        this.wavyTalkToWavyContainer.setAttribute("data-colloquial-tone", "false");
      }
    });
  }

  #bindEvents() {
    // toggle on trigger click
    this.trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      this.isOpen() ? this.hide() : this.show();
    });

    this.defaultListOptions.addEventListener("click", (e) => {
      e.stopPropagation();

      if (e.target.closest("li")) {
        this.wavyHomeContainer.classList.add(HIDDEN);
        this.wavyDefaultLinkContainer.classList.remove(HIDDEN);
      }
    });

    this.closeWavyDefaultOpenContainer.addEventListener("click", (e) => {
      e.stopPropagation();
      this.wavyDefaultLinkContainer.classList.add(HIDDEN);
      this.wavyHomeContainer.classList.remove(HIDDEN);
    });

    // click away closes
    document.addEventListener("click", (e) => {
      if (this.isOpen() && !this.modal.contains(e.target)) {
        this.hide();
      }
    });
  }

  #bindViewAllEvents() {
    const viewAllBtn = document.getElementById("viewAllRecentChats");
    const closeRecentWavyModal = document.getElementById("closeRecentWavyModal");

    viewAllBtn.addEventListener("click", () => {
      this.initialWavyModal.classList.add(HIDDEN);
      this.recentWavyModal.classList.remove(HIDDEN);
    });

    closeRecentWavyModal.addEventListener("click", () => {
      this.initialWavyModal.classList.remove(HIDDEN);
      this.recentWavyModal.classList.add(HIDDEN);
    });
  }

  #bindTalkToWavyEvents() {
    const talkToWavyMode = document.getElementById("talkToWavyMode");
    const closeWavyTalkToWavyContainer = document.getElementById("closeWavyTalkToWavyContainer");

    closeWavyTalkToWavyContainer.addEventListener("click", () => {
      this.wavyTalkToWavyContainer.classList.add(HIDDEN);
      this.wavyHomeContainer.classList.remove(HIDDEN);
    });

    talkToWavyMode.addEventListener("click", () => {
      this.wavyHomeContainer.classList.add(HIDDEN);
      this.wavyTalkToWavyContainer.classList.remove(HIDDEN);
    });
  }

  #bindTalkToWavyTypingEvents() {
    const askWavyTextarea = document.getElementById("askWavyTextarea");
    const sendButton = this.sendCompletedSpeakingTyping;

    const autoResize = (e) => {
      const textarea = e.target;
      textarea.style.height = "auto"; // reset height
      textarea.style.height = textarea.scrollHeight + "px"; // expand to fit text

      sendButton.disabled = !e.target.value;
    };

    askWavyTextarea.addEventListener("input", autoResize);
  }

  isOpen() {
    return this.modal.style.display === "block";
  }

  show() {
    this.modal.style.display = "block";
    this.#createPopper();
  }

  hide() {
    this.modal.style.display = "none";
    if (this.popper) {
      this.popper.destroy();
      this.popper = null;
    }
  }

  #createPopper() {
    // destroy old one if re-opening
    if (this.popper) this.popper.destroy();

    // window.Popper for CDN, or createPopper if imported
    this.popper = (window.Popper ?? Popper).createPopper(this.trigger, this.modal, {
      //       placement: "bottom-start",
      placement: "bottom", // <-- center under the button
      modifiers: [
        {
          name: "offset",
          options: { offset: [0, 8] }, // 8px gap
        },
        {
          name: "preventOverflow",
          options: { boundary: "viewport" },
        },
      ],
    });
  }
}

// initialize once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new AIModal("#showAIModal", "#wavyModalContainer");
});
