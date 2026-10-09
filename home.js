/* ========================================
PASSWORD PROTECTION
======================================== */

const passwordUnlocked =
sessionStorage.getItem("passwordUnlocked");

if (passwordUnlocked !== "true") {

    window.location.replace("index.html");

} else {

    /*
     * Consume the permission.
     *
     * This means:
     * index → password → home
     *
     * but refreshing home.html
     * requires the password again.
     */

    sessionStorage.removeItem(
        "passwordUnlocked"
    );
}


/* ========================================
PAGE ELEMENTS
======================================== */

const timerWrapper =
document.getElementById("timerWrapper");

const content =
document.querySelector(".content");

const quadrants =
document.querySelectorAll(".quadrant");

const cardWrapper =
document.getElementById("cardWrapper");

const monthsaryIntro =
document.getElementById("monthsaryIntro");

const monthsaryText =
document.getElementById("monthsaryText");


/* ========================================
TIMER
======================================== */

const startDate =
new Date("August 10, 2026 00:00:00");

let timerStarted = false;
let timerInterval = null;


/* Show timer at zero */

function showZero() {

    document.getElementById("days").textContent =
        "0";

    document.getElementById("hours").textContent =
        "00";

    document.getElementById("minutes").textContent =
        "00";

    document.getElementById("seconds").textContent =
        "00";
}


/* Convert seconds */

function getTimeValues(totalSeconds) {

    const days =
        Math.floor(
            totalSeconds / 86400
        );

    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;

    return {
        days,
        hours,
        minutes,
        seconds
    };
}


/* Display timer */

function displayTime(totalSeconds) {

    const time =
        getTimeValues(totalSeconds);

    document.getElementById("days").textContent =
        time.days;

    document.getElementById("hours").textContent =
        String(time.hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(time.minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(time.seconds).padStart(2, "0");
}


/* Update timer */

function updateTimer() {

    const now =
        new Date();

    const difference =
        Math.max(
            0,
            Math.floor(
                (now - startDate) / 1000
            )
        );

    displayTime(difference);
}


/* Animate timer */

function animateTimer() {

    const now =
        new Date();

    const targetSeconds =
        Math.max(
            0,
            Math.floor(
                (now - startDate) / 1000
            )
        );

    if (targetSeconds <= 0) {

        showZero();

        return;
    }


    const duration =
        2000;

    const animationStart =
        performance.now();


    function animate(currentTime) {

        const elapsed =
            currentTime - animationStart;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const currentSeconds =
            Math.floor(
                targetSeconds *
                easedProgress
            );

        displayTime(
            currentSeconds
        );


        if (progress < 1) {

            requestAnimationFrame(
                animate
            );

        } else {

            updateTimer();

            timerInterval =
                setInterval(
                    updateTimer,
                    1000
                );

            /* TRIGGER MONTHSARY POPUP RIGHT WHEN TIMER CATCHES UP */
            checkMonthsary();
        }
    }


    requestAnimationFrame(
        animate
    );
}


/* Start timer */

function startTimer() {

    if (timerStarted) {
        return;
    }

    timerStarted = true;

    showZero();

    animateTimer();
}


/* Timer starts at zero */

showZero();


/* ========================================
MONTHSARY INTRO
======================================== */

if (
    monthsaryIntro &&
    monthsaryText
) {

    monthsaryText.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            if (
                monthsaryIntro.classList.contains(
                    "breaking"
                )
            ) {

                return;
            }


            startTimer();


            monthsaryIntro.classList.add(
                "breaking"
            );


            setTimeout(
                function() {

                    monthsaryIntro.remove();

                },
                1000
            );
        }
    );
}


/* ========================================
MONTHSARY POPUP SYSTEM
======================================== */

const monthsaryMessages = {
    1: { title: "Happy 1st Monthsary! 💖", text: "One month down, forever to go! Thank you for the sweet memories." },
    2: { title: "happy 2nd monthsary, bebe", text: "it's been two months since we became official, i only wish for us two to get stronger as time passes by, together for as long as we live" },
    3: { title: "Happy 3rd Monthsary! 🌸", text: "Three months together! I love you more each and every day." },
    4: { title: "Happy 4th Monthsary! ✨", text: "Four amazing months of love, growth, and happiness." },
    5: { title: "Happy 5th Monthsary! 💌", text: "Five months with my favorite person in the world." },
    6: { title: "Happy Half-Year Monthsary! 🎉", text: "Half a year together! Happy 6th monthsary, my love!" }
};

function checkMonthsary() {
    const now = new Date();

    // Checks if today's date matches the day of the month
    if (now.getDate() === startDate.getDate()) {
        
        let monthsElapsed = 
            (now.getFullYear() - startDate.getFullYear()) * 12 + 
            (now.getMonth() - startDate.getMonth());

        if (monthsElapsed > 0) {
            const messageObj = monthsaryMessages[monthsElapsed] || {
                title: `Happy ${monthsElapsed}th Monthsary! 💖`,
                text: "Every single month with you is a blessing. Here's to us!"
            };

            showMonthsaryModal(messageObj.title, messageObj.text);
        }
    }
}

function showMonthsaryModal(title, text) {
    const modal = document.getElementById("monthsaryModal");
    const modalTitle = document.getElementById("monthsaryModalTitle");
    const modalText = document.getElementById("monthsaryModalText");

    if (modal && modalTitle && modalText) {
        modalTitle.textContent = title;
        modalText.textContent = text;
        modal.classList.add("show");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const closeModal = document.getElementById("closeMonthsaryModal");
    const modal = document.getElementById("monthsaryModal");

    if (closeModal && modal) {
        closeModal.addEventListener("click", function () {
            modal.classList.remove("show");
        });

        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.classList.remove("show");
            }
        });
    }
});


/* ========================================
SCROLL EFFECT
======================================== */

window.addEventListener(
    "scroll",
    function() {

        const scrolled =
            window.scrollY > 20;


        if (timerWrapper) {

            timerWrapper.classList.toggle(
                "scrolled",
                scrolled
            );
        }


        if (content) {

            const fade =
                Math.min(
                    window.scrollY / 250,
                    1
                );

            const move =
                Math.min(
                    (window.scrollY / 250) * 35,
                    35
                );

            content.style.opacity =
                1 - fade;

            content.style.transform =
                `translateY(-${move}px)`;
        }
    }
);


/* ========================================
QUADRANT EXPANSION
======================================== */

quadrants.forEach(
    function(quadrant) {

        quadrant.addEventListener(
            "click",
            function(event) {

                /*
                 * Don't expand the quadrant when
                 * interacting with the drawing.
                 */

                if (
                    event.target.closest(".drawing-area") ||
                    event.target.closest(".drawing-tools") ||
                    event.target.closest(".save-drawing")
                ) {

                    return;
                }


                /*
                 * Anything inside fullscreen content
                 * gets its own behavior.
                 */

                if (
                    event.target.closest(
                        ".fullscreen-content"
                    )
                ) {

                    return;
                }


                /*
                 * Close other quadrants.
                 */

                quadrants.forEach(
                    function(other) {

                        if (
                            other !== quadrant
                        ) {

                            other.classList.remove(
                                "expanded"
                            );
                        }
                    }
                );


                /*
                 * Expand clicked quadrant.
                 */

                quadrant.classList.add(
                    "expanded"
                );

                document.body.classList.add(
                    "section-open"
                );
            }
        );
    }
);


/* ========================================
CLOSE QUADRANT BUTTONS
======================================== */

document
.querySelectorAll(".close-section")
.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();


                const quadrant =
                    button.closest(
                        ".quadrant"
                    );


                if (quadrant) {

                    quadrant.classList.remove(
                        "expanded"
                    );
                }


                document.body.classList.remove(
                    "section-open"
                );
            }
        );
    }
);


/* ========================================
LETTER CARDS (DYNAMIC MULTI-CARD FLIP)
======================================== */

document.querySelectorAll(".card-wrapper").forEach(
    function(wrapper) {

        wrapper.addEventListener(
            "click",
            function(event) {

                event.stopPropagation();

                wrapper.classList.toggle("open");
            }
        );
    }
);


/* ========================================
FLOATING THOUGHT BUBBLES
======================================== */

const thoughtContainer =
document.getElementById(
    "thoughtBubbles"
);

if (thoughtContainer) {

    const thoughts = [

        "i love you ;)",
        "hehe",
        "miss u",
        "you're my favorite",
        "pretty girl ♡",
        "you're always on my mind",
        "♡",
        "i'm lucky to have you",
        "always you",
        "love u",
        "you make me smile",
        "my favorite person",
        "still thinking about you",
        "hehe ♡",
        "♡♡♡"

    ];

    let activeThoughts = [];


    function getBlockedElements() {

        return [

            document.querySelector(
                ".content h1"
            ),

            document.querySelector(
                ".content p"
            ),

            document.querySelector(
                ".scroll-hint"
            ),

            document.getElementById(
                "timerWrapper"
            )

        ].filter(Boolean);
    }


    function rectanglesOverlap(
        a,
        b,
        padding
    ) {

        return !(
            a.right + padding < b.left ||
            a.left - padding > b.right ||
            a.bottom + padding < b.top ||
            a.top - padding > b.bottom
        );
    }


    function isSafePosition(
        x,
        y,
        width,
        height
    ) {

        const bubbleRect = {

            left: x,

            right:
                x + width,

            top: y,

            bottom:
                y + height
        };


        const blockedElements =
            getBlockedElements();


        for (
            const element of blockedElements
        ) {

            const rect =
                element.getBoundingClientRect();


            const pageRect = {

                left:
                    rect.left +
                    window.scrollX,

                right:
                    rect.right +
                    window.scrollX,

                top:
                    rect.top +
                    window.scrollY,

                bottom:
                    rect.bottom +
                    window.scrollY
            };


            if (
                rectanglesOverlap(
                    bubbleRect,
                    pageRect,
                    45
                )
            ) {

                return false;
            }
        }


        for (
            const other of activeThoughts
        ) {

            const rect =
                other.getBoundingClientRect();


            const otherRect = {

                left:
                    rect.left +
                    window.scrollX,

                right:
                    rect.right +
                    window.scrollX,

                top:
                    rect.top +
                    window.scrollY,

                bottom:
                    rect.bottom +
                    window.scrollY
            };


            if (
                rectanglesOverlap(
                    bubbleRect,
                    otherRect,
                    80
                )
            ) {

                return false;
            }
        }


        return true;
    }


    function findSafePosition(
        width,
        height
    ) {

        const pageWidth =
            window.innerWidth;

        const pageHeight =
            window.innerHeight;

        const margin =
            25;


        for (
            let attempt = 0;
            attempt < 200;
            attempt++
        ) {

            const x =
                margin +
                Math.random() *
                Math.max(
                    1,
                    pageWidth -
                    width -
                    margin * 2
                );


            const y =
                margin +
                Math.random() *
                Math.max(
                    1,
                    pageHeight -
                    height -
                    margin * 2
                );


            if (
                isSafePosition(
                    x,
                    y,
                    width,
                    height
                )
            ) {

                return {
                    x,
                    y
                };
            }
        }


        return null;
    }


    function createThought() {

        if (
            activeThoughts.length >= 4
        ) {

            return;
        }


        const bubble =
            document.createElement(
                "div"
            );


        bubble.className =
            "thought-bubble";


        bubble.textContent =
            thoughts[
                Math.floor(
                    Math.random() *
                    thoughts.length
                )
            ];


        bubble.style.visibility =
            "hidden";


        bubble.style.animation =
            "none";


        thoughtContainer.appendChild(
            bubble
        );


        const rect =
            bubble.getBoundingClientRect();


        const width =
            rect.width;

        const height =
            rect.height;


        const position =
            findSafePosition(
                width,
                height
            );


        if (!position) {

            bubble.remove();

            return;
        }


        bubble.style.left =
            position.x + "px";

        bubble.style.top =
            position.y + "px";


        const rotation =
            Math.random() * 6 - 3;

        const drift =
            Math.random() * 16 - 8;

        const duration =
            6500 +
            Math.random() * 3500;


        bubble.style.setProperty(
            "--thought-rotation",
            rotation + "deg"
        );

        bubble.style.setProperty(
            "--thought-drift",
            drift + "px"
        );

        bubble.style.setProperty(
            "--thought-duration",
            duration + "ms"
        );


        bubble.style.visibility =
            "visible";


        activeThoughts.push(
            bubble
        );


        requestAnimationFrame(
            function() {

                bubble.style.animation =
                    `thoughtFloat
                     ${duration}ms
                     ease-in-out
                     forwards`;
            }
        );


        setTimeout(
            function() {

                const index =
                    activeThoughts.indexOf(
                        bubble
                    );


                if (index !== -1) {

                    activeThoughts.splice(
                        index,
                        1
                    );
                }


                bubble.remove();


                setTimeout(
                    createThought,
                    700 +
                    Math.random() * 1400
                );

            },
            duration
        );
    }


    function startThoughts() {

        const amount =
            2 +
            Math.floor(
                Math.random() * 3
            );


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            setTimeout(
                createThought,
                i * 800
            );
        }
    }


    startThoughts();
}


/* ========================================
HEART BURST EFFECT
======================================== */

function createHeartBurst(
    x,
    y,
    count = 8
) {

    const burst =
        document.createElement(
            "div"
        );


    burst.className =
        "heart-burst";


    burst.style.left =
        `${x}px`;

    burst.style.top =
        `${y}px`;


    document.body.appendChild(
        burst
    );


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const heart =
            document.createElement(
                "span"
            );


        heart.textContent =
            Math.random() > 0.3
                ? "♡"
                : "♥";


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            25 +
            Math.random() * 45;


        const xMove =
            Math.cos(angle) *
            distance;


        const yMove =
            Math.sin(angle) *
            distance;


        heart.style.setProperty(
            "--heart-x",
            `${xMove}px`
        );


        heart.style.setProperty(
            "--heart-y",
            `${yMove}px`
        );


        heart.style.setProperty(
            "--heart-size",
            `${22 + Math.random() * 14}px`
        );


        heart.style.setProperty(
            "--heart-delay",
            `${Math.random() * 80}ms`
        );


        heart.style.setProperty(
            "--heart-rotate",
            `${-25 + Math.random() * 50}deg`
        );


        burst.appendChild(
            heart
        );
    }


    setTimeout(
        function() {

            burst.remove();

        },
        1100
    );
}


/* ========================================
HEART BURSTS ON CLICKS
======================================== */

document.addEventListener(
    "click",
    function(event) {

        createHeartBurst(
            event.clientX,
            event.clientY,
            6
        );
    }
);


/* ========================================
HIDDEN SECRET HEART
======================================== */

const secretHeart =
document.getElementById(
    "secretHeart"
);

const secretMessage =
document.getElementById(
    "secretMessage"
);

const closeSecret =
document.getElementById(
    "closeSecret"
);


if (
    secretHeart &&
    secretMessage
) {

    secretHeart.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            createHeartBurst(
                event.clientX,
                event.clientY,
                18
            );


            setTimeout(
                function() {

                    secretMessage.classList.add(
                        "show"
                    );

                    document.body.classList.add(
                        "secret-open"
                    );

                },
                180
            );
        }
    );
}


/* ========================================
CLOSE SECRET
======================================== */

if (closeSecret) {

    closeSecret.addEventListener(
        "click",
        function() {

            secretMessage.classList.remove(
                "show"
            );

            document.body.classList.remove(
                "secret-open"
            );
        }
    );
}


/* ========================================
CLICK OUTSIDE SECRET CARD
======================================== */

if (secretMessage) {

    secretMessage.addEventListener(
        "click",
        function(event) {

            if (
                event.target === secretMessage
            ) {

                secretMessage.classList.remove(
                    "show"
                );

                document.body.classList.remove(
                    "secret-open"
                );
            }
        }
    );
}


/* ========================================
ESCAPE KEY — SECRET
======================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            secretMessage
        ) {

            secretMessage.classList.remove(
                "show"
            );

            document.body.classList.remove(
                "secret-open"
            );
        }
    }
);


/* ========================================
RANDOM SECRET HEART LOCATION
======================================== */

function placeSecretHeart() {

    const heart =
        document.getElementById(
            "secretHeart"
        );


    if (!heart) {
        return;
    }


    const padding =
        35;

    const heartSize =
        40;


    const blockedElements = [

        document.querySelector(
            ".content h1"
        ),

        document.querySelector(
            ".content p"
        ),

        document.querySelector(
            ".scroll-hint"
        ),

        document.getElementById(
            "timerWrapper"
        )

    ].filter(Boolean);


    const positions = [];


    for (
        let i = 0;
        i < 100;
        i++
    ) {

        const x =
            padding +
            Math.random() *
            (
                window.innerWidth -
                padding * 2 -
                heartSize
            );


        const y =
            padding +
            Math.random() *
            (
                window.innerHeight -
                padding * 2 -
                heartSize
            );


        const heartRect = {

            left:
                x,

            right:
                x + heartSize,

            top:
                y,

            bottom:
                y + heartSize
        };


        let blocked =
            false;


        for (
            const element of blockedElements
        ) {

            const rect =
                element.getBoundingClientRect();


            const expandedRect = {

                left:
                    rect.left - 35,

                right:
                    rect.right + 35,

                top:
                    rect.top - 35,

                bottom:
                    rect.bottom + 35
            };


            const overlaps =
                heartRect.left <
                    expandedRect.right &&

                heartRect.right >
                    expandedRect.left &&

                heartRect.top <
                    expandedRect.bottom &&

                heartRect.bottom >
                    expandedRect.top;


            if (overlaps) {

                blocked =
                    true;

                break;
            }
        }


        if (!blocked) {

            positions.push({
                x,
                y
            });
        }
    }


    if (
        positions.length === 0
    ) {

        return;
    }


    const position =
        positions[
            Math.floor(
                Math.random() *
                positions.length
            )
        ];


    heart.style.left =
        `${position.x}px`;

    heart.style.top =
        `${position.y}px`;
}


/* Place heart */

placeSecretHeart();


/* ========================================
BACKGROUND MUSIC
======================================== */

const backgroundMusic =
document.getElementById(
    "backgroundMusic"
);

const startMusic =
sessionStorage.getItem(
    "startMusic"
);


if (
    backgroundMusic &&
    startMusic === "true"
) {

    backgroundMusic.volume =
        0;


    backgroundMusic.play().catch(
        function() {}
    );


    sessionStorage.removeItem(
        "startMusic"
    );


    /* Fade in */

    let fadeIn =
        setInterval(
            function() {

                if (
                    backgroundMusic.volume <
                    0.18
                ) {

                    backgroundMusic.volume =
                        Math.min(
                            backgroundMusic.volume +
                            0.01,
                            0.18
                        );

                } else {

                    clearInterval(
                        fadeIn
                    );
                }

            },
            100
        );
}


/* Smooth fade out → replay → fade in */

if (backgroundMusic) {

    backgroundMusic.addEventListener(
        "timeupdate",
        function() {

            const fadeDuration =
                4;


            const remaining =
                backgroundMusic.duration -
                backgroundMusic.currentTime;


            if (
                remaining <= fadeDuration &&
                !backgroundMusic.dataset.fading
            ) {

                backgroundMusic.dataset.fading =
                    "true";


                const fadeOut =
                    setInterval(
                        function() {

                            if (
                                backgroundMusic.volume >
                                0.01
                            ) {

                                backgroundMusic.volume =
                                    Math.max(
                                        backgroundMusic.volume -
                                        0.01,
                                        0
                                    );

                            } else {

                                clearInterval(
                                    fadeOut
                                );


                                backgroundMusic.currentTime =
                                    0;


                                const fadeIn =
                                    setInterval(
                                        function() {

                                            if (
                                                backgroundMusic.volume <
                                                0.18
                                            ) {

                                                backgroundMusic.volume =
                                                    Math.min(
                                                        backgroundMusic.volume +
                                                        0.01,
                                                        0.18
                                                    );

                                            } else {

                                                clearInterval(
                                                    fadeIn
                                                );

                                                backgroundMusic.dataset.fading =
                                                    "";
                                            }

                                        },
                                        100
                                    );
                            }

                        },
                        100
                    );
            }
        }
    );
}


/* ========================================
DRAWING CANVAS
======================================== */

const drawingCanvas =
document.getElementById(
    "drawingCanvas"
);

const drawingArea =
document.querySelector(
    ".drawing-area"
);

const drawingColor =
document.getElementById(
    "drawingColor"
);

const brushSize =
document.getElementById(
    "brushSize"
);

const eraserBtn =
document.getElementById(
    "eraserBtn"
);

const undoBtn =
document.getElementById(
    "undoBtn"
);

const clearCanvas =
document.getElementById(
    "clearCanvas"
);

const saveDrawing =
document.getElementById(
    "saveDrawing"
);


if (
    drawingCanvas &&
    drawingArea
) {

    const ctx =
        drawingCanvas.getContext(
            "2d"
        );


    let drawing =
        false;

    let erasing =
        false;

    let history =
        [];

    const maxHistory =
        20;


    function resizeCanvas() {

        const rect =
            drawingArea.getBoundingClientRect();


        if (
            rect.width === 0 ||
            rect.height === 0
        ) {

            return;
        }


        const ratio =
            window.devicePixelRatio ||
            1;


        drawingCanvas.width =
            rect.width * ratio;

        drawingCanvas.height =
            rect.height * ratio;


        drawingCanvas.style.width =
            rect.width + "px";

        drawingCanvas.style.height =
            rect.height + "px";


        ctx.setTransform(
            ratio,
            0,
            0,
            ratio,
            0,
            0
        );


        ctx.lineCap =
            "round";

        ctx.lineJoin =
            "round";


        ctx.globalCompositeOperation =
            "source-over";


        ctx.fillStyle =
            "#fffafc";


        ctx.fillRect(
            0,
            0,
            rect.width,
            rect.height
        );
    }


    function getPosition(event) {

        const rect =
            drawingCanvas.getBoundingClientRect();


        return {

            x:
                event.clientX -
                rect.left,

            y:
                event.clientY -
                rect.top
        };
    }


    function saveState() {

        if (
            history.length >=
            maxHistory
        ) {

            history.shift();
        }


        history.push(
            ctx.getImageData(
                0,
                0,
                drawingCanvas.width,
                drawingCanvas.height
            )
        );
    }


    function startDrawing(event) {

        event.preventDefault();

        drawing =
            true;


        saveState();


        const position =
            getPosition(
                event
            );


        ctx.beginPath();


        ctx.moveTo(
            position.x,
            position.y
        );
    }


    function draw(event) {

        if (!drawing) {
            return;
        }


        event.preventDefault();


        const position =
            getPosition(
                event
            );


        ctx.lineWidth =
            Number(
                brushSize.value
            );


        if (erasing) {

            ctx.globalCompositeOperation =
                "destination-out";

        } else {

            ctx.globalCompositeOperation =
                "source-over";

            ctx.strokeStyle =
                drawingColor.value;
        }


        ctx.lineTo(
            position.x,
            position.y
        );


        ctx.stroke();


        ctx.beginPath();


        ctx.moveTo(
            position.x,
            position.y
        );
    }


    function stopDrawing() {

        if (!drawing) {
            return;
        }


        drawing =
            false;


        ctx.closePath();
    }


    drawingCanvas.addEventListener(
        "pointerdown",
        startDrawing
    );

    drawingCanvas.addEventListener(
        "pointermove",
        draw
    );

    drawingCanvas.addEventListener(
        "pointerup",
        stopDrawing
    );

    drawingCanvas.addEventListener(
        "pointercancel",
        stopDrawing
    );

    drawingCanvas.addEventListener(
        "pointerleave",
        stopDrawing
    );


    /* ERASER */

    eraserBtn.addEventListener(
        "click",
        function() {

            erasing =
                !erasing;


            eraserBtn.classList.toggle(
                "active",
                erasing
            );


            eraserBtn.textContent =
                erasing
                    ? "eraser on"
                    : "eraser";
        }
    );


    /* UNDO */

    undoBtn.addEventListener(
        "click",
        function() {

            if (
                history.length === 0
            ) {

                return;
            }


            const previousState =
                history.pop();


            ctx.putImageData(
                previousState,
                0,
                0
            );
        }
    );


    /* CLEAR */

    clearCanvas.addEventListener(
        "click",
        function() {

            saveState();


            const rect =
                drawingArea.getBoundingClientRect();


            ctx.globalCompositeOperation =
                "source-over";


            ctx.fillStyle =
                "#fffafc";


            ctx.fillRect(
                0,
                0,
                rect.width,
                rect.height
            );
        }
    );


    /* SAVE */

    saveDrawing.addEventListener(
        "click",
        function() {

            const link =
                document.createElement(
                    "a"
                );


            link.download =
                "your-little-drawing.png";


            link.href =
                drawingCanvas.toDataURL(
                    "image/png"
                );


            link.click();
        }
    );


    /* INITIAL CANVAS */

    window.addEventListener(
        "resize",
        function() {

            if (
                drawingCanvas.offsetParent !== null
            ) {

                resizeCanvas();
            }
        }
    );


    /* Resize canvas when Quadrant 4 opens */

    const littleThings =
        document.querySelector(
            ".little-things"
        );


    if (littleThings) {

        const observer =
            new MutationObserver(
                function() {

                    if (
                        littleThings.classList.contains(
                            "expanded"
                        )
                    ) {

                        setTimeout(
                            function() {

                                resizeCanvas();

                            },
                            100
                        );
                    }
                }
            );


        observer.observe(
            littleThings,
            {
                attributes:
                    true,

                attributeFilter:
                    ["class"]
            }
        );
    }
}


/* ========================================
CLICKABLE MEMORIES
======================================== */

const memoryPhotos =
document.querySelectorAll(
    ".memories .photo"
);

const memoryFullscreen =
document.querySelector(
    ".memories .fullscreen-content"
);

let memoryViewer =
    null;


/* ========================================
CREATE MEMORY VIEWER
======================================== */

function createMemoryViewer() {

    if (
        memoryViewer ||
        !memoryFullscreen
    ) {

        return;
    }


    memoryViewer =
        document.createElement(
            "div"
        );


    memoryViewer.className =
        "memory-viewer";


    memoryViewer.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
     * The viewer has its OWN close button.
     *
     * Clicking anywhere else does NOT close it.
     */

    memoryViewer.innerHTML = `

        <button
            class="memory-viewer-close"
            type="button"
            aria-label="close memory">
            ×
        </button>

        <div class="memory-viewer-card">

            <div class="memory-viewer-media">
            </div>

            <div class="memory-viewer-note">

                <h3
                    class="memory-viewer-title">
                </h3>

                <p
                    class="memory-viewer-text">
                </p>

            </div>

        </div>
    `;


    memoryFullscreen.appendChild(
        memoryViewer
    );


    /*
     * CLOSE BUTTON
     */

    const closeButton =
        memoryViewer.querySelector(
            ".memory-viewer-close"
        );


    closeButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            closeMemoryViewer();
        }
    );
}


/* ========================================
OPEN MEMORY
======================================== */

function openMemory(photo) {

    createMemoryViewer();


    if (!memoryViewer) {
        return;
    }


    const mediaContainer =
        memoryViewer.querySelector(
            ".memory-viewer-media"
        );


    const title =
        memoryViewer.querySelector(
            ".memory-viewer-title"
        );


    const note =
        memoryViewer.querySelector(
            ".memory-viewer-text"
        );


    const originalMedia =
        photo.querySelector(
            "img, video"
        );


    if (!originalMedia) {
        return;
    }


    /*
     * Clone the original picture/video.
     */

    const media =
        originalMedia.cloneNode(
            true
        );


    /*
     * Video settings.
     */

    if (
        media.tagName === "VIDEO"
    ) {

        media.controls =
            true;

        media.autoplay =
            true;

        media.muted =
            true;

        media.loop =
            true;

        media.playsInline =
            true;
    }


    /*
     * Put media inside viewer.
     */

    mediaContainer.replaceChildren(
        media
    );


    /*
     * Get note from HTML.
     */

    title.textContent =
        photo.dataset.title ||
        "a little memory ♡";


    note.textContent =
        photo.dataset.note ||
        "a little memory i want to keep forever.";


    /*
     * Show viewer.
     */

    memoryViewer.classList.add(
        "show"
    );


    memoryViewer.setAttribute(
        "aria-hidden",
        "false"
    );


    /*
     * Highlight selected memory.
     */

    memoryPhotos.forEach(
        function(other) {

            other.classList.toggle(
                "memory-active",
                other === photo
            );
        }
    );


    /*
     * Play video.
     */

    if (
        media.tagName === "VIDEO"
    ) {

        media.play().catch(
            function() {}
        );
    }
}


/* ========================================
CLOSE MEMORY VIEWER
======================================== */

function closeMemoryViewer() {

    if (!memoryViewer) {
        return;
    }


    memoryViewer.classList.remove(
        "show"
    );


    memoryViewer.setAttribute(
        "aria-hidden",
        "true"
    );


    /*
     * Stop video.
     */

    const video =
        memoryViewer.querySelector(
            ".memory-viewer-media video"
        );


    if (video) {

        video.pause();

        video.currentTime =
            0;
    }


    /*
     * Remove active state.
     */

    memoryPhotos.forEach(
        function(photo) {

            photo.classList.remove(
                "memory-active"
            );
        }
    );
}


/* ========================================
MAKE EVERY MEMORY CLICKABLE
======================================== */

memoryPhotos.forEach(
    function(photo) {

        photo.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();


                openMemory(
                    photo
                );
            }
        );
    }
);


/* ========================================
ESCAPE TO CLOSE MEMORY
======================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape" &&
            memoryViewer &&
            memoryViewer.classList.contains(
                "show"
            )
        ) {

            closeMemoryViewer();
        }
    }
);
