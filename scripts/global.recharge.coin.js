class RechargeCoin {
  constructor({ triggerSelector, modalSelector }) {
    this.triggerSelector = document.querySelector(triggerSelector);
    this.modalSelector = document.querySelector(modalSelector);

    this.init();
  }

  init() {
    this.bindEvents();

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    const addCoinSelectionAmount = document.getElementById("addCoinSelectionAmount");
    const addCoinPayment = document.getElementById("addCoinPayment");
    const addCoinPaymentDetails = document.getElementById("addCoinPaymentDetails");
    const stepLine1 = document.querySelector(".add-coin-modal-linear-progress span:nth-child(1)");
    const stepLine2 = document.querySelector(".add-coin-modal-linear-progress span:nth-child(2)");
    const stepLine3 = document.querySelector(".add-coin-modal-linear-progress span:nth-child(3)");

    // cancel coin option payment
    const cancelCoinOptionPayment = document.getElementById("cancelCoinOptionPayment");
    cancelCoinOptionPayment?.addEventListener("click", () => {
      addCoinModalContainer.classList.add(HIDDEN);
      addCoinPayment.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);
      addCoinSelectionAmount.classList.remove(HIDDEN);
    });

    // back to coin option payment
    const backToCoinOptionPayment = document.getElementById("backToCoinOptionPayment");
    backToCoinOptionPayment?.addEventListener("click", () => {
      addCoinModalContainer.classList.remove(HIDDEN);
      addCoinSelectionAmount.classList.remove(HIDDEN);

      stepLine1.setAttribute("data-active", "");
      stepLine2.removeAttribute("data-active");
      stepLine3.removeAttribute("data-active");
      addCoinPayment.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);
    });

    const backToCoinPayment = document.getElementById("backToCoinPayment");
    backToCoinPayment?.addEventListener("click", () => {
      addCoinModalContainer.classList.remove(HIDDEN);
      addCoinSelectionAmount.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);

      stepLine1.setAttribute("data-active", "");
      stepLine2.setAttribute("data-active", "");
      stepLine3.removeAttribute("data-active");
      addCoinPayment.classList.remove(HIDDEN);
    });

    // next to coin option payment
    const nextToCoinOptionPayment = document.getElementById("nextToCoinOptionPayment");
    nextToCoinOptionPayment?.addEventListener("click", () => {
      addCoinSelectionAmount.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);

      stepLine1.setAttribute("data-active", "");
      stepLine2.setAttribute("data-active", "");
      stepLine3.removeAttribute("data-active");
      addCoinPayment.classList.remove(HIDDEN);
      addCoinModalContainer.classList.remove(HIDDEN);
    });

    const nextToCoinPayment = document.getElementById("nextToCoinPayment");
    nextToCoinPayment?.addEventListener("click", () => {
      addCoinSelectionAmount.classList.add(HIDDEN);
      addCoinPayment.classList.add(HIDDEN);

      stepLine1.setAttribute("data-active", "");
      stepLine2.setAttribute("data-active", "");
      stepLine3.setAttribute("data-active", "");
      addCoinPaymentDetails.classList.remove(HIDDEN);
      addCoinModalContainer.classList.remove(HIDDEN);
    });

    // pay final coin payment
    const payFinalCoinPayment = document.getElementById("payFinalCoinPayment");
    payFinalCoinPayment?.addEventListener("click", () => {
      addCoinModalContainer.classList.add(HIDDEN);
      addCoinPayment.classList.add(HIDDEN);
      addCoinPaymentDetails.classList.add(HIDDEN);

      stepLine1.setAttribute("data-active", "");
      stepLine2.removeAttribute("data-active");
      stepLine3.removeAttribute("data-active");
      addCoinSelectionAmount.classList.remove(HIDDEN);
    });

    const paymentOpts = document.querySelectorAll("button.payment_opt__select");
    paymentOpts.forEach((button) => {
      button.addEventListener("click", function () {
        if (!this.classList.contains("selected")) {
          paymentOpts.forEach((btn) => btn.classList.remove("selected"));
          button.classList.add("selected");
        }
      });
    });
  }

  bindEvents() {
    this.triggerSelector.addEventListener("click", () => {
      this.modalSelector.classList.remove(HIDDEN);
    });
  }
}

new RechargeCoin({
  triggerSelector: "#showRechargeCoinModal",
  modalSelector: "#addCoinModalContainer",
});
