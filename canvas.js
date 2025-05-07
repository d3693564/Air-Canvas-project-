let hands;
let canvas;
let ctx;
let video;
let isDrawing = false;
let lastPoint = null;

async function setupHandTracking() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    const status = document.getElementById('status');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 64; // Account for toolbar
    
    // Configure canvas context
    ctx = canvas.getContext('2d');
    ctx.strokeStyle = document.getElementById('colorPicker').value;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: 640,
                height: 480,
                frameRate: 60
            } 
        });
        video.srcObject = stream;
        await video.play();
        
        hands = new Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });
        
        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7
        });
        
        hands.onResults((results) => {
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                const landmarks = results.multiHandLandmarks[0];
                const indexFinger = landmarks[8];
                
                // Check if only index finger is raised
                const indexFingerRaised = landmarks[8].y < landmarks[7].y;
                const otherFingersDown = 
                    landmarks[12].y > landmarks[11].y && // Middle finger down
                    landmarks[16].y > landmarks[15].y && // Ring finger down
                    landmarks[20].y > landmarks[19].y;   // Pinky down
                
                const x = indexFinger.x * canvas.width;
                const y = indexFinger.y * canvas.height;
                
                const shouldDraw = indexFingerRaised && otherFingersDown;
                isDrawing = shouldDraw;
                status.textContent = `Status: ${isDrawing ? 'Drawing' : 'Ready'}`;
                
                if (shouldDraw) {
                    if (!lastPoint) {
                        ctx.beginPath();
                        ctx.moveTo(x, y);
                        lastPoint = { x, y };
                    } else {
                        ctx.beginPath();
                        ctx.moveTo(lastPoint.x, lastPoint.y);
                        ctx.lineTo(x, y);
                        ctx.stroke();
                        lastPoint = { x, y };
                    }
                } else {
                    lastPoint = null;
                }
            }
        });
        
        await hands.initialize();
        
        const processFrame = async () => {
            if (!video || !hands) return;
            await hands.send({ image: video });
            requestAnimationFrame(processFrame);
        };
        
        processFrame();
        
    } catch (error) {
        console.error('Error accessing webcam:', error);
        status.textContent = 'Error: Could not access webcam';
    }
}

// Event Listeners
document.getElementById('colorPicker').addEventListener('input', (e) => {
    ctx.strokeStyle = e.target.value;
});

document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.getElementById('saveBtn').addEventListener('click', async () => {
    const imageData = canvas.toDataURL();
    try {
        const response = await fetch('/save-drawing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageData })
        });
        if (response.ok) {
            loadGallery();
        }
    } catch (error) {
        console.error('Error saving drawing:', error);
    }
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await fetch('/logout');
        window.location.href = '/';
    } catch (error) {
        console.error('Error logging out:', error);
    }
});

// Gallery functionality
const galleryBtn = document.getElementById('galleryBtn');
const gallery = document.getElementById('gallery');
const closeGallery = document.getElementById('closeGallery');
const galleryContent = document.querySelector('.gallery-content');

galleryBtn.addEventListener('click', () => {
    gallery.classList.toggle('hidden');
    if (!gallery.classList.contains('hidden')) {
        loadGallery();
    }
});

closeGallery.addEventListener('click', () => {
    gallery.classList.add('hidden');
});

async function loadGallery() {
    try {
        const response = await fetch('/get-drawings');
        if (response.ok) {
            const drawings = await response.json();
            galleryContent.innerHTML = drawings.length === 0 
                ? '<p>No saved drawings yet</p>'
                : drawings.map(drawing => `
                    <div class="drawing-card">
                        <img src="${drawing.imageData}" alt="Drawing">
                        <div class="timestamp">${new Date(drawing.created_at).toLocaleString()}</div>
                    </div>
                `).join('');
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 64;
});

// Initialize
setupHandTracking();
