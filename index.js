const trainingData = [
    "leonhard mondsturm",
    "adalbert brecht-cabana",
    "sarah tausendstern",
    "otto plapper",
    "ludwig hammerstein",
    "hektor cabana",
    "kalle",
    "flavio faltdach",
    "monty münzfach",
    "flitz",
    "bruno plapper",
    "jakob moorstelz",
    "korrin küstenseher",
    "udohr",
    "wilhelm sturmwind",
    "helena sternenfels",
    "gustav nebelkrone",
    "mathilda regenbogen",
    "ethengub aririm",
    "oogana",
    "konrad wolkenschiff",
    "siegfried bergmann",
    "emma silbertau",
    "klaus donnerhall",
    "frieda morgenstern",
    "robert windläufer",
    "gregor felsenstein",
    "hilda waldecho",
    "viktor sturmsänger",
    "berta mondlicht",
    "heinrich seefahrer",
    "else winterwind",
    "karl steinherz",
    "martha regentanz",
    "rolf",
    "theodor blitzfänger",
    "anna sternenstaub",
    "felix wellentanz",
    "clara nebelfänger",
    "walter bergsturm",
    "lotte himmelspfad",
    "siegfried stanzhüter",
    "kerrim rammer",
    "abkort ronstein",
    "ikeb gartentor",
    "richard moorgrim",
    "ibana wehchor",
    "eod antyber",
    "olin wiegendau",
    "yboo marlitz",
    "antenhard weinherz",
    "eugena faube",
    "kena vierwelt",
    "enzian seelapper",
    "orfind ronstein",
    "sebastian silhelm",
    "innse inntanz",
    "kelkena immerwind",
    "frita megenturm",
    "anhantus monnerhalle",
    "rier züsenstein"
]
document.querySelector('#trainingData').value = trainingData.join('\n')

const net = new brain.recurrent.LSTM()

function train() {
    console.log('training 1500 epochs')
    const startTime = performance.now()
    
    let feedback = net.train(document.querySelector('#trainingData').value.split('\n'), {
        iterations: 1500,
        errorThresh: 0.011
    })
    
    const endTime = performance.now()
    const trainingTime = (endTime - startTime) / 1000  // Convert to seconds
    console.log(`Training finished! Took ${trainingTime.toFixed(2)} seconds`)
    console.log(feedback)
}
    
document.querySelector('#create').addEventListener('click', createNames)
document.querySelector('#train').addEventListener('click', train)
document.querySelector('#load').addEventListener('click', loadModel)
document.querySelector('#save').addEventListener('click', saveModel)

function loadModel() {
    // Create file input element
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = '.json'
    
    // Handle file selection
    fileInput.addEventListener('change', async (e) => {
        try {
            const file = e.target.files[0]
            if (!file) return
            
            // Read file contents
            const text = await file.text()
            const jsonData = JSON.parse(text)
            
            // Load model
            net.fromJSON(jsonData)
            console.log('Model loaded successfully!')
            
        } catch (error) {
            console.error('Error loading model:', error)
            alert('Error loading model file. Please make sure it is a valid JSON file.')
        }
    })
    
    // Trigger file dialog
    fileInput.click()
}

function saveModel() {
    try {
        // Convert model to JSON
        const modelData = net.toJSON()
        const jsonString = JSON.stringify(modelData)
        
        // Create blob and download link
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        
        // Create and trigger download
        const downloadLink = document.createElement('a')
        downloadLink.href = url
        downloadLink.download = 'name-generator-model.json'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        
        // Cleanup
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(url)
        
        console.log('Model saved successfully!')
        
    } catch (error) {
        console.error('Error saving model:', error)
        alert('Error saving model file.')
    }
}

function createNames() {
    const newNames = []
    const characters = [...new Set(trainingData.join(''))].join('').replace(' ', '').replace('-', '')
    
    for(let i = 0; i < 10; i++) {
        // Random seed length between 6 and 10
        const length = Math.floor(Math.random() * 4) + 3
        
        // Create random seed
        let seed = ''
        for(let j = 0; j < length; j++) {
            seed += characters[Math.floor(Math.random() * characters.length)]
        }
        
        let newName = net.run(seed)
        if(newName.replace(' ', '').length > 0)
            newNames.push(newName)
    }

    document.querySelector('#names').innerHTML = newNames.join('<br>')
}