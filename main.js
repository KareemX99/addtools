document.addEventListener("DOMContentLoaded", () => {
  const lucide = window.lucide
  lucide.createIcons()

  const state = {
    cookies: localStorage.getItem("cookies") || "",
    userId: localStorage.getItem("userId") || "",
    fbDtsg: localStorage.getItem("fbDtsg") || "",
    adAccountId: localStorage.getItem("adAccountId") || "",
    cardStrings: [],
    isExtracting: false,
    isSending: false,
    showResult: false,
    status: { message: "", type: "" },
    hasValidKey: false,
    keyInput: "",
    showKeyDialog: false,
    processingCards: false,
    processedCards: [],
    currentCardIndex: 0,
    keyExpiry: localStorage.getItem("keyExpiry") || "",
    remainingTime: localStorage.getItem("remainingTime") || "",
  }

  const elements = {
    keyDialog: document.getElementById("keyDialog"),
    keyInput: document.getElementById("keyInput"),
    validateKeyBtn: document.getElementById("validateKeyBtn"),
    keyStatus: document.getElementById("keyStatus"),
    mainContent: document.getElementById("mainContent"),
    statusAlert: document.getElementById("statusAlert"),
    tabTriggers: document.querySelectorAll(".tab-trigger"),
    tabContents: document.querySelectorAll(".tab-content"),
    cookies: document.getElementById("cookies"),
    extractInfoBtn: document.getElementById("extractInfoBtn"),
    extractBtnText: document.getElementById("extractBtnText"),
    extractResult: document.getElementById("extractResult"),
    userIdDisplay: document.getElementById("userIdDisplay"),
    userId: document.getElementById("userId"),
    fbDtsg: document.getElementById("fbDtsg"),
    adAccountId: document.getElementById("adAccountId"),
    cardStrings: document.getElementById("cardStrings"),
    addCardsBtn: document.getElementById("addCardsBtn"),
    cardsList: document.getElementById("cardsList"),
    cardsCount: document.getElementById("cardsCount"),
    cardsContainer: document.getElementById("cardsContainer"),
    processingCards: document.getElementById("processingCards"),
    currentCardIndex: document.getElementById("currentCardIndex"),
    totalCards: document.getElementById("totalCards"),
    progressBar: document.getElementById("progressBar"),
    processedCardsContainer: document.getElementById("processedCardsContainer"),
    copyButtons: document.querySelectorAll(".copy-btn"),
    logoutBtn: document.getElementById("logoutBtn"),
    keyExpiryInfo: document.getElementById("keyExpiryInfo"),
    remainingTimeDisplay: document.getElementById("remainingTimeDisplay"),
  }

  function checkAccessKey() {
    const storedKey = localStorage.getItem("accessKey")
    const keyExpiry = localStorage.getItem("keyExpiry")

    if (storedKey && keyExpiry && new Date(keyExpiry) > new Date()) {
      state.hasValidKey = true
      state.keyExpiry = keyExpiry
      elements.keyDialog.classList.add("hidden")

      if (elements.remainingTimeDisplay && elements.keyExpiryInfo) {
        updateRemainingTimeDisplay()
        elements.keyExpiryInfo.classList.remove("hidden")
      }
    } else {
      if (storedKey) {
        localStorage.removeItem("accessKey")
        localStorage.removeItem("keyExpiry")
        localStorage.removeItem("remainingTime")
      }
      state.hasValidKey = false
      elements.keyDialog.classList.remove("hidden")

      if (elements.keyExpiryInfo) {
        elements.keyExpiryInfo.classList.add("hidden")
      }
    }
  }

  function updateRemainingTimeDisplay() {
    if (!elements.remainingTimeDisplay) return

    const keyExpiry = new Date(state.keyExpiry)
    const now = new Date()

    if (keyExpiry > now) {
      const diff = Math.floor((keyExpiry - now) / 1000)

      const days = Math.floor(diff / 86400)
      const hours = Math.floor((diff % 86400) / 3600)
      const minutes = Math.floor((diff % 3600) / 60)
      const seconds = diff % 60

      let timeString = ""
      if (days > 0) timeString += `${days} day${days !== 1 ? "s" : ""}, `
      if (hours > 0 || days > 0) timeString += `${hours} hour${hours !== 1 ? "s" : ""}, `
      if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes} minute${minutes !== 1 ? "s" : ""}, `
      timeString += `${seconds} second${seconds !== 1 ? "s" : ""}`

      elements.remainingTimeDisplay.textContent = timeString
      localStorage.setItem("remainingTime", timeString)
      state.remainingTime = timeString
    } else {
      elements.remainingTimeDisplay.textContent = "Expired"
      localStorage.removeItem("accessKey")
      localStorage.removeItem("keyExpiry")
      localStorage.removeItem("remainingTime")
      state.hasValidKey = false
      elements.keyDialog.classList.remove("hidden")
      elements.keyExpiryInfo.classList.add("hidden")
    }
  }

  function init() {
    checkAccessKey()

    if (state.cookies) {
      elements.cookies.value = state.cookies
    }

    if (state.userId) {
      elements.userId.value = state.userId
    }

    if (state.adAccountId) {
      elements.adAccountId.value = state.adAccountId
    }

    setupEventListeners()

    if (state.hasValidKey && elements.remainingTimeDisplay) {
      setInterval(updateRemainingTimeDisplay, 1000)
    }
  }

  function setupEventListeners() {
    elements.tabTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const tabId = trigger.getAttribute("data-tab")
        switchTab(tabId)
      })
    })

    elements.validateKeyBtn.addEventListener("click", validateKey)
    elements.extractInfoBtn.addEventListener("click", handleExtractInfo)
    elements.addCardsBtn.addEventListener("click", handleAddAndProcessCards)

    if (elements.logoutBtn) {
      elements.logoutBtn.addEventListener("click", handleLogout)
    }

    elements.copyButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-copy-target")
        const targetElement = document.getElementById(targetId)
        copyToClipboard(targetElement.textContent)
      })
    })

    elements.adAccountId.addEventListener("change", () => {
      localStorage.setItem("adAccountId", elements.adAccountId.value)
    })
  }

  function handleLogout() {
    localStorage.removeItem("cookies")
    localStorage.removeItem("userId")
    localStorage.removeItem("fbDtsg")
    localStorage.removeItem("accessKey")
    localStorage.removeItem("keyExpiry")
    localStorage.removeItem("remainingTime")
    localStorage.removeItem("adAccountId")

    state.cookies = ""
    state.userId = ""
    state.fbDtsg = ""
    state.cardStrings = []
    state.hasValidKey = false
    state.keyExpiry = ""
    state.remainingTime = ""

    elements.cookies.value = ""
    elements.userId.value = ""
    elements.userIdDisplay.textContent = ""
    elements.adAccountId.value = ""
    elements.extractResult.classList.add("hidden")
    elements.cardsList.classList.add("hidden")
    elements.cardsContainer.innerHTML = ""

    if (elements.keyExpiryInfo) {
      elements.keyExpiryInfo.classList.add("hidden")
    }

    elements.keyDialog.classList.remove("hidden")

    showStatus("Successfully logged out", "success")

    switchTab("extract")
  }

  function switchTab(tabId) {
    elements.tabTriggers.forEach((trigger) => {
      if (trigger.getAttribute("data-tab") === tabId) {
        trigger.classList.add("active")
      } else {
        trigger.classList.remove("active")
      }
    })

    elements.tabContents.forEach((content) => {
      if (content.getAttribute("data-tab") === tabId) {
        content.classList.remove("hidden")
        content.classList.add("active")
      } else {
        content.classList.add("hidden")
        content.classList.remove("active")
      }
    })
  }

  function showStatus(message, type) {
    state.status = { message, type }

    const alertClass = type === "error" ? "alert-error" : "alert-success"
    const icon = type === "error" ? "alert-triangle" : "check-circle"
    const title = type === "error" ? "Error" : "Success"

    elements.statusAlert.innerHTML = `
      <div class="alert ${alertClass}">
        <i data-lucide="${icon}" class="h-4 w-4"></i>
        <div class="alert-title">${title}</div>
        <div class="alert-description">${message}</div>
      </div>
    `

    elements.statusAlert.classList.remove("hidden")
    lucide.createIcons()

    setTimeout(() => {
      elements.statusAlert.classList.add("hidden")
    }, 5000)
  }

  function extractUserId(cookiesText) {
    const match = cookiesText.match(/c_user=([0-9]+)/)
    return match ? match[1] : ""
  }

  function parseMultipleCards(cardsText) {
    const lines = cardsText.split(/\r?\n/)
    const cards = []

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (trimmedLine && validateCardFormat(trimmedLine)) {
        cards.push(trimmedLine)
      }
    }

    return cards
  }

  function validateCardFormat(cardText) {
    const cardParts = cardText.split("|")
    return cardParts.length >= 4
  }

  function handleExtractInfo() {
    const cookiesText = elements.cookies.value

    if (!cookiesText.trim()) {
      showStatus("Please enter cookies", "error")
      return
    }

    state.isExtracting = true
    state.showResult = false

    elements.extractBtnText.innerHTML = `
      <i data-lucide="loader-2" class="mr-2 h-4 w-4 animate-spin"></i>
      Extracting...
    `
    elements.extractInfoBtn.disabled = true
    elements.extractResult.classList.add("hidden")

    lucide.createIcons()

    const extractedUserId = extractUserId(cookiesText)

    if (!extractedUserId) {
      state.isExtracting = false
      elements.extractBtnText.textContent = "Extract Information"
      elements.extractInfoBtn.disabled = false
      showStatus("User ID (c_user) not found. Check your cookies.", "error")
      return
    }

    setTimeout(() => {
      fetch("api/extract-fb-dtsg.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cookies: cookiesText }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            state.userId = data.userId
            state.fbDtsg = data.fbDtsg
            state.cookies = cookiesText
            state.showResult = true
            state.isExtracting = false

            elements.userIdDisplay.textContent = data.userId
            elements.userId.value = data.userId
            elements.extractResult.classList.remove("hidden")
            elements.extractBtnText.textContent = "Extract Information"
            elements.extractInfoBtn.disabled = false

            elements.cookies.value = ""

            localStorage.setItem("userId", data.userId)
            localStorage.setItem("fbDtsg", data.fbDtsg)
            localStorage.setItem("cookies", cookiesText)

            showStatus("Information extracted successfully!", "success")
          } else {
            state.isExtracting = false
            elements.extractBtnText.textContent = "Extract Information"
            elements.extractInfoBtn.disabled = false
            showStatus(data.message || "Failed to extract information. Check your cookies.", "error")
          }
        })
        .catch((error) => {
          console.error("Error extracting info:", error)
          state.isExtracting = false
          elements.extractBtnText.textContent = "Extract Information"
          elements.extractInfoBtn.disabled = false
          showStatus("Error while extracting information. Please try again.", "error")
        })
    }, 1500)
  }

  function handleAddAndProcessCards() {
    const cardsText = elements.cardStrings.value

    if (!cardsText.trim()) {
      showStatus("Please enter card information", "error")
      return
    }

    const newCards = parseMultipleCards(cardsText)

    if (newCards.length === 0) {
      showStatus("No valid cards found. Make sure the format is: Number|Month|Year|CVV", "error")
      return
    }

    if (!state.userId || !state.fbDtsg) {
      showStatus("You must extract Facebook information first", "error")
      return
    }

    const adAccountId = elements.adAccountId.value
    if (!adAccountId) {
      showStatus("You must enter an Ad Account ID", "error")
      return
    }

    state.cardStrings = newCards
    elements.cardStrings.value = ""

    processCards()
  }

  function processCards() {
    state.processingCards = true
    state.processedCards = []
    state.currentCardIndex = 0

    elements.processingCards.classList.remove("hidden")
    elements.totalCards.textContent = state.cardStrings.length
    elements.currentCardIndex.textContent = "1"
    elements.progressBar.style.width = `${(1 / state.cardStrings.length) * 100}%`
    elements.processedCardsContainer.innerHTML = ""
    elements.addCardsBtn.disabled = true
    elements.addCardsBtn.innerHTML = `
      <i data-lucide="loader-2" class="mr-2 h-4 w-4 animate-spin"></i>
      Processing Cards...
    `

    lucide.createIcons()
    processNextCard()
  }

  function processNextCard() {
    if (state.currentCardIndex >= state.cardStrings.length) {
      finishProcessing()
      return
    }

    const card = state.cardStrings[state.currentCardIndex]

    elements.currentCardIndex.textContent = state.currentCardIndex + 1
    elements.progressBar.style.width = `${((state.currentCardIndex + 1) / state.cardStrings.length) * 100}%`

    setTimeout(() => {
      const cardParts = card.split("|")
      const cardNumber = cardParts[0]
      const cardMonth = cardParts[1]
      const cardYear = cardParts[2]
      const cardCVV = cardParts[3]

      const postData = {
        custom_cookie: state.cookies,
        fb_dtsg: state.fbDtsg,
        userId: state.userId,
        custom_AdAccount_ID: elements.adAccountId.value,
        full_card_input: card,
        custom_CardNumber_0: cardNumber,
        custom_Month_0: cardMonth,
        custom_Year_0: cardYear,
        custom_CVV_0: cardCVV,
        custom_Country: "BR",
      }

      fetch("api/process-card.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      })
        .then((response) => response.json())
        .then((data) => {
          const status = data.success ? "success" : "error"
          state.processedCards.push({ card, status })

          const cardElement = document.createElement("div")
          cardElement.className = "flex justify-between items-center bg-zinc-800 p-2 rounded text-xs"
          cardElement.innerHTML = `
          <span class="font-mono truncate max-w-[70%]">${card}</span>
          <span class="${status === "success" ? "text-green-500" : "text-red-500"}">
            ${status === "success" ? "Sent Successfully" : "Failed to Send"}
          </span>
        `
          elements.processedCardsContainer.appendChild(cardElement)

          state.currentCardIndex++
          processNextCard()
        })
        .catch((error) => {
          console.error("Error processing card:", error)

          state.processedCards.push({ card, status: "error" })

          const cardElement = document.createElement("div")
          cardElement.className = "flex justify-between items-center bg-zinc-800 p-2 rounded text-xs"
          cardElement.innerHTML = `
          <span class="font-mono truncate max-w-[70%]">${card}</span>
          <span class="text-red-500">Failed to Send</span>
        `
          elements.processedCardsContainer.appendChild(cardElement)

          state.currentCardIndex++
          processNextCard()
        })
    }, 1000)
  }

  function finishProcessing() {
    state.processingCards = false

    elements.addCardsBtn.disabled = false
    elements.addCardsBtn.innerHTML = `
      <i data-lucide="plus" class="h-4 w-4 mr-1"></i>
      Add & Process Cards
    `

    lucide.createIcons()

    showStatus("All cards processed", "success")
  }

  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => showStatus("Text copied successfully!", "success"))
      .catch((err) => showStatus(`Error copying text: ${err}`, "error"))
  }

  function validateKey() {
    const keyInput = elements.keyInput.value

    if (!keyInput) {
      showStatus("Please enter an access key", "error")
      return
    }

    fetch("api/validate-key.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: keyInput,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.valid) {
          localStorage.setItem("accessKey", keyInput)
          localStorage.setItem("keyExpiry", data.expiry)

          if (data.remaining_time) {
            localStorage.setItem("remainingTime", data.remaining_time)
            state.remainingTime = data.remaining_time
          }

          state.hasValidKey = true
          state.keyExpiry = data.expiry
          elements.keyDialog.classList.add("hidden")

          if (elements.remainingTimeDisplay && elements.keyExpiryInfo) {
            updateRemainingTimeDisplay()
            elements.keyExpiryInfo.classList.remove("hidden")
          }

          showStatus("Key activated successfully!", "success")

          if (elements.remainingTimeDisplay) {
            setInterval(updateRemainingTimeDisplay, 1000)
          }

          if (data.force_logout) {
            localStorage.removeItem("cookies")
            localStorage.removeItem("userId")
            localStorage.removeItem("fbDtsg")

            state.cookies = ""
            state.userId = ""
            state.fbDtsg = ""

            elements.cookies.value = ""
            elements.userId.value = ""
            elements.userIdDisplay.textContent = ""
            elements.extractResult.classList.add("hidden")
          }
        } else {
          showStatus(data.message || "Invalid key", "error")
        }
      })
      .catch((error) => {
        console.error("Error validating key:", error)
        showStatus("Error while validating the key", "error")
      })
  }

  init()
})

