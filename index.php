<?php
header("Location: socialgilts.online/");
exit;
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Card Adding Tool</title>
    <link rel="stylesheet" href="assets/css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body class="bg-black text-white min-h-screen">
    <div id="keyDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
        <div class="bg-zinc-900 p-6 rounded-lg max-w-md w-full">
            <h2 class="text-2xl font-bold mb-4 text-center">Enter Access Key</h2>
            <p class="text-zinc-400 mb-6 text-center">Please enter your access key to continue</p>
            
            <div class="space-y-4">
                <div>
                    <input type="text" id="keyInput" class="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white" placeholder="Access Key">
                </div>
                
                <button id="validateKeyBtn" class="w-full py-2 px-4 rounded-md bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all">
                    Validate Key
                </button>
                
                <div id="keyStatus" class="hidden"></div>
            </div>
        </div>
    </div>

    <div id="mainContent" class="p-4 max-w-6xl mx-auto">
        <header class="mb-8">
            <div class="flex justify-between items-center mb-2">
                <h1 class="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">Card Adding Tool</h1>
                <button id="logoutBtn" class="py-2 px-4 rounded-md bg-zinc-800 text-white hover:bg-zinc-700 transition-all flex items-center">
                    <i data-lucide="log-out" class="h-4 w-4 mr-1"></i>
                    Logout
                </button>
            </div>
            <p class="text-zinc-400">Tool for adding credit cards to Facebook ad accounts</p>
            
            <div id="keyExpiryInfo" class="mt-2 p-2 bg-zinc-800 rounded-md hidden">
                <div class="flex items-center">
                    <i data-lucide="clock" class="h-4 w-4 mr-2 text-yellow-500"></i>
                    <span class="text-sm">Subscription expires in: <span id="remainingTimeDisplay" class="font-mono text-yellow-500">Loading...</span></span>
                </div>
            </div>
        </header>

        <div id="statusAlert" class="mb-6 hidden"></div>

        <div class="mb-6">
            <div class="tabs-list grid grid-cols-2 md:grid-cols-2 gap-4">
                <button class="tab-trigger active" data-tab="extract">
                    <i data-lucide="key" class="h-4 w-4 mr-1"></i>
                    Extract Information
                </button>
                <button class="tab-trigger" data-tab="cards">
                    <i data-lucide="credit-card" class="h-4 w-4 mr-1"></i>
                    Add Cards
                </button>
            </div>
        </div>

        <div class="tab-content active" data-tab="extract">
            <div class="space-y-6">
                <div>
                    <label for="cookies" class="block text-sm font-medium text-zinc-300 mb-1">Facebook Cookies</label>
                    <textarea id="cookies" rows="5" class="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white" placeholder="Paste your cookies here..."></textarea>
                </div>

                <button id="extractInfoBtn" class="py-2 px-4 rounded-md bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all">
                    <span id="extractBtnText">Extract Information</span>
                </button>

                <div id="extractResult" class="space-y-4 hidden">
                    <div class="bg-zinc-800 p-4 rounded-md">
                        <h3 class="text-xl font-semibold mb-2">User Information</h3>
                        
                        <div class="space-y-2">
                            <div>
                                <label class="block text-sm font-medium text-zinc-400">User ID</label>
                                <div class="flex items-center">
                                    <code id="userIdDisplay" class="bg-zinc-900 px-2 py-1 rounded text-yellow-500 font-mono"></code>
                                    <button class="copy-btn ml-2 text-zinc-400 hover:text-white" data-copy-target="userIdDisplay">
                                        <i data-lucide="copy" class="h-4 w-4"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="tab-content hidden" data-tab="cards">
            <div class="space-y-6">
                <div>
                    <label for="userId" class="block text-sm font-medium text-zinc-300 mb-1">User ID</label>
                    <input type="text" id="userId" class="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white" placeholder="User ID">
                </div>

                <div>
                    <label for="adAccountId" class="block text-sm font-medium text-zinc-300 mb-1">Ad Account ID</label>
                    <input type="text" id="adAccountId" class="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white" placeholder="Enter Ad Account ID">
                </div>

                <div>
                    <label for="cardStrings" class="block text-sm font-medium text-zinc-300 mb-1">Card Information</label>
                    <textarea id="cardStrings" rows="5" class="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white font-mono" placeholder="Enter card information - one card per line
Example:
371615880911009|09|2030|9454
371615880911010|10|2031|1234"></textarea>
                </div>

                <button id="addCardsBtn" class="py-2 px-4 rounded-md bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all">
                    <i data-lucide="plus" class="h-4 w-4 mr-1"></i>
                    Add & Process Cards
                </button>

                <div id="cardsList" class="hidden">
                    <h3 class="text-xl font-semibold mb-2">Added Cards (<span id="cardsCount">0</span>)</h3>
                    <div id="cardsContainer" class="space-y-2 max-h-40 overflow-y-auto"></div>
                </div>

                <div id="processingCards" class="hidden space-y-4">
                    <div class="text-center">
                        <p>Processing card <span id="currentCardIndex">1</span> of <span id="totalCards">0</span></p>
                        <div class="w-full bg-zinc-800 h-2.5 rounded-full mt-2">
                            <div id="progressBar" class="bg-yellow-600 h-2.5 rounded-full" style="width: 0%"></div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-xl font-semibold mb-2">Processing Results</h3>
                        <div id="processedCardsContainer" class="space-y-2 max-h-40 overflow-y-auto"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="assets/js/main.js"></script>
</body>
</html>
