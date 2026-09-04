/* =========================================================
   RM PORTFOLIO
   SCRIPT.JS
   FINAL CLEAN VERSION
========================================================= */


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {
        mainNav.classList.toggle("open");
    });

}

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {
        mainNav?.classList.remove("open");
    });

});



/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections = [
    ...document.querySelectorAll("main section[id]")
];

const navLinks = [
    ...document.querySelectorAll(".nav-link")
];

if (sections.length && navLinks.length) {

    const observer = new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    navLinks.forEach(link => {
                        link.classList.remove("active");
                    });

                    const active = document.querySelector(
                        `.nav-link[href="#${entry.target.id}"]`
                    );

                    active?.classList.add("active");

                }

            });

        },

        {
            rootMargin: "-35% 0px -55% 0px"
        }

    );

    sections.forEach(section => {
        observer.observe(section);
    });

}



/* =========================================================
   WORK LIGHTBOX
========================================================= */

const lightbox = document.getElementById("workLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");

document.querySelectorAll(".work-card").forEach(card => {

    card.addEventListener("click", () => {

        if (!lightbox || !lightboxImage) return;

        lightboxImage.src = card.dataset.image || "";
        lightboxImage.alt = card.dataset.title || "Project";

        if (lightboxTitle) {
            lightboxTitle.textContent =
                card.dataset.title || "PROJECT";
        }

        lightbox.classList.add("open");

        document.body.style.overflow = "hidden";

    });

});



/* =========================================================
   CLOSE LIGHTBOX
========================================================= */

document
    .querySelector(".lightbox-close")
    ?.addEventListener("click", closeLightbox);


lightbox?.addEventListener("click", event => {

    if (event.target === lightbox) {
        closeLightbox();
    }

});


document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
        closeLightbox();
    }

});


function closeLightbox() {

    lightbox?.classList.remove("open");

    document.body.style.overflow = "";

}



/* =========================================================
   STORAGE
========================================================= */

/*
   V3 = bagong storage version.

   Ginawa natin itong V3 para hindi gamitin
   ang lumang Lab preview filenames.
*/

const STORAGE = {

    exam: "rm_portfolio_exam_v3",

    quiz: "rm_portfolio_quiz_v3",

    lab: "rm_portfolio_lab_v3"

};


const INITIAL_SLOTS = 3;



/* =========================================================
   LOAD DATA
========================================================= */

function loadData(key) {

    try {

        const saved = JSON.parse(
            localStorage.getItem(key)
        );

        return Array.isArray(saved)
            ? saved
            : [];

    }

    catch {

        return [];

    }

}



/* =========================================================
   SAVE DATA
========================================================= */

function saveData(key, data) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(data)
        );

        return true;

    }

    catch (error) {

        alert(
            "The browser storage is full. " +
            "Try a smaller PDF/image or remove an old file."
        );

        return false;

    }

}



/* =========================================================
   FILE TO DATA URL
========================================================= */

function fileToDataURL(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}



/* =========================================================
   HIDDEN FILE INPUT
========================================================= */

function createHiddenInput(accept, callback) {

    const input = document.createElement("input");

    input.type = "file";
    input.accept = accept;
    input.style.display = "none";

    input.addEventListener("change", async () => {

        const file = input.files?.[0];

        if (file) {
            await callback(file);
        }

        input.remove();

    });

    document.body.appendChild(input);

    input.click();

}



/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value = "") {

    return String(value).replace(
        /[&<>"']/g,
        char => ({

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"

        }[char])
    );

}



/* =========================================================
   OPEN STORED FILE
========================================================= */

function openStoredFile(fileData) {

    if (!fileData) return;


    /* =====================================================
       LOCAL STORAGE FILE
    ===================================================== */

    if (fileData.data) {

        const win = window.open();

        if (!win) {

            alert(
                "Please allow pop-ups for this portfolio so files can open."
            );

            return;

        }


        const isPDF =
            fileData.type === "application/pdf" ||
            fileData.name
                ?.toLowerCase()
                .endsWith(".pdf");


        if (isPDF) {

            win.location.href = fileData.data;

            return;

        }


        win.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    ${escapeHTML(fileData.name || "File")}
                </title>

                <style>

                    html,
                    body {

                        margin: 0;
                        width: 100%;
                        height: 100%;
                        background: #111;

                        display: grid;
                        place-items: center;

                    }

                    img {

                        max-width: 96%;
                        max-height: 96%;
                        object-fit: contain;

                    }

                </style>

            </head>

            <body>

                <img
                    src="${fileData.data}"
                    alt=""
                >

            </body>

            </html>

        `);

        win.document.close();

        return;

    }



    /* =====================================================
       NORMAL FILE PATH
       USED FOR PRE-LOADED LAB FILES
    ===================================================== */

    if (fileData.path) {

        window.open(
            fileData.path,
            "_blank"
        );

    }

}



/* =========================================================
   EXAM
   EXACTLY 3 CARDS
========================================================= */

function initExam() {

    const container =
        document.getElementById("examCards");

    if (!container) return;


    let data = loadData(STORAGE.exam);


    while (data.length < 3) {
        data.push(null);
    }


    data = data.slice(0, 3);


    const names = [
        "Prelim",
        "Midterm",
        "Final"
    ];


    function render() {

        container.innerHTML = "";


        data.forEach((fileData, index) => {

            const card =
                document.createElement("article");


            card.className = "exam-card";


            const hasFile =
                Boolean(fileData?.data);


            card.innerHTML = `

                <div class="exam-top">

                    <span>
                        EXAM 0${index + 1}
                    </span>

                    <div class="exam-icon">

                        <i class="fa-regular fa-file-pdf"></i>

                    </div>

                </div>


                <div>

                    <h3>
                        ${names[index]}
                    </h3>

                    <p>
                        One PDF attachment
                        for this examination period.
                    </p>

                    <div class="file-name">

                        ${
                            hasFile
                            ? escapeHTML(fileData.name)
                            : "No PDF attached."
                        }

                    </div>

                </div>


                <div class="card-actions">

                    <button
                        class="file-btn view-btn"
                        ${hasFile ? "" : "disabled"}
                    >

                        <i class="fa-regular fa-eye"></i>

                        VIEW PDF

                    </button>


                    <button
                        class="file-btn replace-btn"
                    >

                        <i class="fa-solid fa-plus"></i>

                        ${
                            hasFile
                            ? "REPLACE PDF"
                            : "ATTACH PDF"
                        }

                    </button>

                </div>

            `;


            /* VIEW */

            card
                .querySelector(".view-btn")
                ?.addEventListener("click", () => {

                    if (hasFile) {
                        openStoredFile(fileData);
                    }

                });


            /* ADD / REPLACE */

            card
                .querySelector(".replace-btn")
                ?.addEventListener("click", () => {

                    createHiddenInput(
                        ".pdf,application/pdf",
                        async file => {

                            const isPDF =
                                file.type === "application/pdf" ||
                                file.name
                                    .toLowerCase()
                                    .endsWith(".pdf");


                            if (!isPDF) {

                                alert(
                                    "Exam files must be PDF."
                                );

                                return;

                            }


                            if (
                                file.size >
                                7 * 1024 * 1024
                            ) {

                                alert(
                                    "This file is over 7 MB."
                                );

                                return;

                            }


                            const dataURL =
                                await fileToDataURL(file);


                            data[index] = {

                                name: file.name,

                                type: file.type,

                                data: dataURL

                            };


                            saveData(
                                STORAGE.exam,
                                data
                            );


                            render();

                        }
                    );

                });


            container.appendChild(card);

        });

    }


    render();

}



/* =========================================================
   QUIZ / LAB
========================================================= */

function initFlexibleFiles(
    type,
    storageKey,
    containerId,
    addButtonId,
    countId
) {

    const container =
        document.getElementById(containerId);

    const addButton =
        document.getElementById(addButtonId);

    const countText =
        document.getElementById(countId);


    if (!container) return;


    let data = loadData(storageKey);



    /* =====================================================
       QUIZ DEFAULT FILE
    ===================================================== */

    if (
        type === "quiz" &&
        data.length === 0
    ) {

        data = [

            {
                name: "quiz 1.png",
                type: "image/png",
                path: "1.png",
                preview: "quiz 1.png"
            },

            null,

            null

        ];


        saveData(
            storageKey,
            data
        );

    }



    /* =====================================================
       LAB DEFAULT FILES
    ===================================================== */

    if (
        type === "lab" &&
        data.length === 0
    ) {

        data = [

            {
                name: "lab 1.pdf",
                type: "application/pdf",
                path: "lab 1.pdf",
                preview: "pic1lab.png"
            },

            {
                name: "lab 2.pdf",
                type: "application/pdf",
                path: "lab 2.pdf",
                preview: "pic2lab.png"
            },
            
        
            null

        ];


        saveData(
            storageKey,
            data
        );

    }



    /* =====================================================
       ENSURE 3 INITIAL SLOTS
    ===================================================== */

    while (
        data.length < INITIAL_SLOTS
    ) {

        data.push(null);

    }



    /* =====================================================
       UPDATE COUNT
    ===================================================== */

    function updateCount() {

        if (!countText) return;


        const attached =
            data.filter(Boolean).length;


        countText.textContent =
            `${data.length} slots • ${attached} attached`;

    }



    /* =====================================================
       RENDER
    ===================================================== */

    function render() {

        container.innerHTML = "";


        data.forEach((fileData, index) => {

            const card =
                renderFileCard({

                    type,
                    index,
                    fileData,

                    onReplace: () => {

                        createHiddenInput(
                            "image/*,.pdf,application/pdf",
                            async file => {

                                const isPDF =
                                    file.type ===
                                    "application/pdf" ||
                                    file.name
                                        .toLowerCase()
                                        .endsWith(".pdf");


                                const isImage =
                                    file.type.startsWith(
                                        "image/"
                                    );


                                if (
                                    !isPDF &&
                                    !isImage
                                ) {

                                    alert(
                                        "Please choose an image or PDF file."
                                    );

                                    return;

                                }


                                if (
                                    file.size >
                                    7 * 1024 * 1024
                                ) {

                                    alert(
                                        "This file is over 7 MB. Please use a smaller file."
                                    );

                                    return;

                                }


                                const dataURL =
                                    await fileToDataURL(file);


                                data[index] = {

                                    name: file.name,

                                    type: file.type,

                                    data: dataURL,

                                    /*
                                      Kapag image,
                                      gamitin mismo ang image
                                      bilang preview.
                                    */

                                    preview:
                                        isImage
                                        ? dataURL
                                        : null

                                };


                                saveData(
                                    storageKey,
                                    data
                                );


                                render();

                            }
                        );

                    },


                    onView: openStoredFile

                });


            container.appendChild(card);

        });


        updateCount();

    }



    /* =====================================================
       ADD NEW SLOT
    ===================================================== */

    addButton?.addEventListener(
        "click",
        () => {

            data.push(null);


            saveData(
                storageKey,
                data
            );


            render();

        }
    );


    render();

}



/* =========================================================
   CREATE FILE CARD
========================================================= */

function renderFileCard({

    type,
    index,
    fileData,
    onReplace,
    onView

}) {

    const card =
        document.createElement("article");


    card.className =
        "file-card";


    const hasFile =
        Boolean(
            fileData?.data ||
            fileData?.path
        );



    /* =====================================================
       TITLE
    ===================================================== */

    const title =
        type === "quiz"
        ? `Quiz ${index + 1}`
        : type === "lab"
        ? `Lab ${index + 1}`
        : "File";



    /* =====================================================
       PREVIEW
    ===================================================== */

    let preview = "";


    if (fileData?.preview) {

        preview = `

            <div
                class="${
                    type === "lab"
                    ? "lab-preview"
                    : "quiz-preview"
                }"
            >

                <img
                    src="${escapeHTML(fileData.preview)}"
                    alt="${escapeHTML(title)} preview"
                >

                <div class="preview-overlay">

                    <i
                        class="${
                            type === "lab"
                            ? "fa-regular fa-file-pdf"
                            : "fa-regular fa-image"
                        }"
                    ></i>

                    <span>
                        ${escapeHTML(title)}
                    </span>

                </div>

            </div>

        `;

    }



    /* =====================================================
       CARD HTML
    ===================================================== */

    card.innerHTML = `

        ${preview}


        <div class="file-card-head">

            <span class="file-index">

                ${type.toUpperCase()}

                ${String(index + 1).padStart(2, "0")}

            </span>


            <span class="doc-icon">

                <i
                    class="${
                        fileData?.type === "image/png" ||
                        fileData?.type?.startsWith("image/")
                        ? "fa-regular fa-image"
                        : "fa-regular fa-file-pdf"
                    }"
                ></i>

            </span>

        </div>


        <h3>
            ${escapeHTML(title)}
        </h3>


        <p class="file-status">

            ${
                hasFile
                ? escapeHTML(
                    fileData.name ||
                    `${title}.pdf`
                )
                : "No file attached yet."
            }

        </p>


        <div class="card-actions">

            <button
                class="file-btn view-btn"
                ${hasFile ? "" : "disabled"}
            >

                <i class="fa-regular fa-eye"></i>

                VIEW

            </button>


            <button
                class="file-btn replace-btn"
            >

                <i class="fa-solid fa-plus"></i>

                ${
                    hasFile
                    ? "REPLACE"
                    : "ADD"
                }

            </button>

        </div>

    `;



    /* =====================================================
       VIEW
    ===================================================== */

    card
        .querySelector(".view-btn")
        ?.addEventListener(
            "click",
            () => {

                if (hasFile) {
                    onView(fileData);
                }

            }
        );



    /* =====================================================
       ADD / REPLACE
    ===================================================== */

    card
        .querySelector(".replace-btn")
        ?.addEventListener(
            "click",
            onReplace
        );


    return card;

}



/* =========================================================
   START EVERYTHING
========================================================= */

initExam();


initFlexibleFiles(
    "quiz",
    STORAGE.quiz,
    "quizCards",
    "addQuiz",
    "quizCount"
);


initFlexibleFiles(
    "lab",
    STORAGE.lab,
    "labCards",
    "addLab",
    "labCount"
);



function openStoredFile(file) {
    if (!file) return;

    // IMAGE VIEWER
    if (file.type && file.type.startsWith("image/")) {
        const viewer = document.createElement("div");
        viewer.className = "image-viewer";

        viewer.innerHTML = `
            <div class="image-viewer-content">
                <button class="image-viewer-close" aria-label="Close">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <img src="${file.data || file.path}" alt="${escapeHTML(file.name || "Quiz Image")}">
            </div>
        `;

        document.body.appendChild(viewer);

        const closeViewer = () => {
            viewer.remove();
        };

        viewer.querySelector(".image-viewer-close")
            .addEventListener("click", closeViewer);

        viewer.addEventListener("click", (e) => {
            if (e.target === viewer) {
                closeViewer();
            }
        });

        document.addEventListener("keydown", function escHandler(e) {
            if (e.key === "Escape") {
                closeViewer();
                document.removeEventListener("keydown", escHandler);
            }
        });

        return;
    }

    // PDF
    if (file.type === "application/pdf") {
        const source = file.data || file.path;
        window.open(source, "_blank");
        return;
    }
}