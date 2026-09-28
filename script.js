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

    const container = document.getElementById("examCards");

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

            const card = document.createElement("article");

            card.className = "exam-card";

            const isPrelim = index === 0;

            const hasFile =
                isPrelim
                    ? true
                    : Boolean(fileData?.data);

            const fileName =
                isPrelim
                    ? "Prelim.pdf"
                    : hasFile
                        ? fileData.name
                        : "No PDF attached.";


            /* =================================================
               PRELIM IMAGE
               Small preview only
            ================================================= */

            const prelimPreview = isPrelim
                ? `
                    <div class="exam-image-preview">
                        <img
                            src="Prelim.png"
                            alt="Prelim Exam Preview"
                            class="academic-view-image"
                            data-image="Prelim.png"
                        >
                    </div>
                `
                : "";


            card.innerHTML = `

                <div class="exam-top">

                    <span>
                        EXAM 0${index + 1}
                    </span>

                    <div class="exam-icon">
                        <i class="fa-regular fa-file-pdf"></i>
                    </div>

                </div>


                ${prelimPreview}


                <div class="exam-info">

                    <h3>
                        ${names[index]}
                    </h3>


                    <div class="file-name">

                        <i class="fa-regular fa-file-pdf"></i>

                        ${escapeHTML(fileName)}

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
                            isPrelim
                                ? "REPLACE PDF"
                                : hasFile
                                    ? "REPLACE PDF"
                                    : "ATTACH PDF"
                        }

                    </button>

                </div>

            `;


            /* =================================================
               VIEW PDF
            ================================================= */

            card
                .querySelector(".view-btn")
                ?.addEventListener("click", () => {

                    if (isPrelim) {

                        window.open(
                            "Prelim.pdf",
                            "_blank"
                        );

                        return;
                    }

                    if (hasFile) {

                        openStoredFile(fileData);

                    }

                });


            /* =================================================
               REPLACE / ATTACH PDF
            ================================================= */

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


        initAcademicImageViewer();

    }


    render();

}



/* =========================================================
   PERIODS
========================================================= */

const PERIODS = [
    "Prelim",
    "Midterm",
    "Final"
];



/* =========================================================
   DEFAULT QUIZ FILES
========================================================= */

const DEFAULT_QUIZ = [

    {
        name: "quiz 1.png",
        type: "image/png",
        path: "quiz 1.png",
        preview: "quiz 1.png",
        period: "Prelim"
    },

    {
        name: "quiz 2.png",
        type: "image/png",
        path: "quiz 2.png",
        preview: "quiz 2.png",
        period: "Prelim"
    },

    {
        name: "quiz 3.png",
        type: "image/png",
        path: "quiz 3.png",
        preview: "quiz 3.png",
        period: "Prelim"
    },

    {
        name: "long quiz.png",
        type: "image/png",
        path: "long quiz.png",
        preview: "long quiz.png",
        period: "Prelim"
    }

];



/* =========================================================
   DEFAULT LAB FILES
========================================================= */

const DEFAULT_LAB = [

    {
        name: "lab 1.pdf",
        type: "application/pdf",
        path: "lab 1.pdf",
        preview: "pic1lab.png",
        period: "Prelim"
    },

    {
        name: "lab 2.pdf",
        type: "application/pdf",
        path: "lab 2.pdf",
        preview: "pic2lab.png",
        period: "Prelim"
    },

    {
        name: "PEREA - NETLAB.pdf",
        type: "application/pdf",
        path: "PEREA - NETLAB.pdf",
        preview: "lab1.png",
        period: "Midterm"
    }

];



/* =========================================================
   GET PERIOD CONTAINER
========================================================= */

function getPeriodContainer(type, period) {

    const ids = {

        quiz: {
            Prelim: "quizPrelimCards",
            Midterm: "quizMidtermCards",
            Final: "quizFinalCards"
        },

        lab: {
            Prelim: "labPrelimCards",
            Midterm: "labMidtermCards",
            Final: "labFinalCards"
        }

    };

    return document.getElementById(
        ids[type][period]
    );

}



/* =========================================================
   QUIZ / LAB
========================================================= */

function initFlexibleFiles(
    type,
    storageKey,
    addButtonId,
    countId
) {

    const addButton =
        document.getElementById(addButtonId);

    const countText =
        document.getElementById(countId);

    const containers = {

        Prelim:
            getPeriodContainer(type, "Prelim"),

        Midterm:
            getPeriodContainer(type, "Midterm"),

        Final:
            getPeriodContainer(type, "Final")

    };


    /* CURRENT FILE PER PERIOD */

    const currentSlide = {
        Prelim: 0,
        Midterm: 0,
        Final: 0
    };


    /* LOAD SAVED DATA */

    let data = loadData(storageKey);

    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        data =
            type === "quiz"
                ? structuredClone(DEFAULT_QUIZ)
                : structuredClone(DEFAULT_LAB);

    }


    /* MAKE SURE DEFAULT QUIZ FILES EXIST */

    if (type === "quiz") {

        DEFAULT_QUIZ.forEach(requiredFile => {

            const exists = data.some(
                item =>
                    item &&
                    item.name === requiredFile.name
            );

            if (!exists) {
                data.push(
                    structuredClone(requiredFile)
                );
            }

        });

        data = data.map(fileData => {

            if (!fileData) return fileData;

            const required =
                DEFAULT_QUIZ.find(
                    item =>
                        item.name === fileData.name
                );

            if (required) {

                fileData.period = "Prelim";

                if (!fileData.preview) {
                    fileData.preview =
                        required.preview;
                }

            }

            return fileData;

        });

    }


    /* MAKE SURE DEFAULT LAB FILES EXIST */

    if (type === "lab") {

        DEFAULT_LAB.forEach(requiredFile => {

            const exists = data.some(
                item =>
                    item &&
                    item.name === requiredFile.name
            );

            if (!exists) {
                data.push(
                    structuredClone(requiredFile)
                );
            }

        });

        data = data.map(fileData => {

            if (!fileData) return fileData;

            const required =
                DEFAULT_LAB.find(
                    item =>
                        item.name === fileData.name
                );

            if (required) {

                fileData.period =
                    required.period;

                if (!fileData.preview) {
                    fileData.preview =
                        required.preview;
                }

            }

            return fileData;

        });

    }


    /* FIX OLD DATA */

    data = data.map(
        (fileData, index) => {

            if (!fileData) return null;

            if (!fileData.period) {

                fileData.period =
                    PERIODS[index] ||
                    "Prelim";

            }

            return fileData;

        }
    );


    saveData(
        storageKey,
        data
    );


    /* COUNT */

    function updateCount() {

        if (!countText) return;

        const attached =
            data.filter(Boolean).length;

        countText.textContent =
            `${attached} attached`;

    }


    /* =====================================================
       RENDER
    ===================================================== */

    function render() {

        PERIODS.forEach(period => {

            const container =
                containers[period];

            if (!container) return;

            container.innerHTML = "";


            const periodFiles =
                data.filter(
                    fileData =>
                        fileData &&
                        fileData.period === period
                );


            /* NO FILE */

            if (periodFiles.length === 0) {

                container.appendChild(
                    renderFileCard({

                        type,

                        fileData: null,

                        period,

                        onReplace: () => {
                            addFileToPeriod(period);
                        }

                    })
                );

                return;

            }


            /* KEEP SLIDE VALID */

            if (
                currentSlide[period] >=
                periodFiles.length
            ) {

                currentSlide[period] =
                    periodFiles.length - 1;

            }

            if (
                currentSlide[period] < 0
            ) {

                currentSlide[period] = 0;

            }


            const index =
                currentSlide[period];

            const fileData =
                periodFiles[index];


            /* FILE WRAPPER */

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "single-file-slider";


            /* FILE CARD */

            wrapper.appendChild(
                renderFileCard({

                    type,

                    fileData,

                    period,

                    onReplace: () => {
                        replaceFile(fileData);
                    }

                })
            );


            /* =================================================
               SIMPLE ARROW NAVIGATION
               <  1 / 4  >
            ================================================= */

            if (periodFiles.length > 1) {

                const navigation =
                    document.createElement("div");

                navigation.className =
                    "file-navigation";

                navigation.innerHTML = `

                    <button
                        type="button"
                        class="file-nav-btn prev-btn"
                        ${index === 0 ? "disabled" : ""}
                        aria-label="Previous"
                    >
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>

                    <span class="file-counter">
                        ${index + 1} / ${periodFiles.length}
                    </span>

                    <button
                        type="button"
                        class="file-nav-btn next-btn"
                        ${
                            index ===
                            periodFiles.length - 1
                                ? "disabled"
                                : ""
                        }
                        aria-label="Next"
                    >
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>

                `;


                /* PREVIOUS */

                navigation
                    .querySelector(".prev-btn")
                    ?.addEventListener(
                        "click",
                        () => {

                            if (
                                currentSlide[period] > 0
                            ) {

                                currentSlide[period]--;

                                render();

                            }

                        }
                    );


                /* NEXT */

                navigation
                    .querySelector(".next-btn")
                    ?.addEventListener(
                        "click",
                        () => {

                            if (
                                currentSlide[period] <
                                periodFiles.length - 1
                            ) {

                                currentSlide[period]++;

                                render();

                            }

                        }
                    );


                wrapper.appendChild(
                    navigation
                );

            }


            container.appendChild(
                wrapper
            );

        });


        updateCount();

        initAcademicImageViewer();

    }


    /* =====================================================
       ADD FILE
    ===================================================== */

    function addFileToPeriod(period) {

        createHiddenInput(
            "image/*,.pdf,application/pdf",
            async file => {

                await processFile(
                    file,
                    period,
                    null
                );

            }
        );

    }


    /* =====================================================
       REPLACE FILE
    ===================================================== */

    function replaceFile(fileData) {

        const period =
            fileData.period || "Prelim";

        createHiddenInput(
            "image/*,.pdf,application/pdf",
            async file => {

                await processFile(
                    file,
                    period,
                    fileData
                );

            }
        );

    }


    /* =====================================================
       PROCESS FILE
    ===================================================== */

    async function processFile(
        file,
        period,
        oldFile
    ) {

        const isPDF =
            file.type === "application/pdf" ||
            file.name
                .toLowerCase()
                .endsWith(".pdf");

        const isImage =
            file.type.startsWith("image/");


        if (!isPDF && !isImage) {

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


        try {

            const dataURL =
                await fileToDataURL(file);


            const newFile = {

                name: file.name,

                type: file.type,

                data: dataURL,

                /* Keep old lab preview when replacing PDF */

                preview:
                    isImage
                        ? dataURL
                        : oldFile?.preview || null,

                period

            };


            /* REPLACE */

            if (oldFile) {

                const index =
                    data.indexOf(oldFile);

                if (index !== -1) {
                    data[index] =
                        newFile;
                }

            }


            /* ADD */

            else {

                data.push(
                    newFile
                );

            }


            saveData(
                storageKey,
                data
            );


            /* SHOW NEW FILE */

            const periodFiles =
                data.filter(
                    item =>
                        item &&
                        item.period === period
                );

            const newIndex =
                periodFiles.findIndex(
                    item =>
                        item.name === newFile.name &&
                        item.data === newFile.data
                );

            currentSlide[period] =
                newIndex >= 0
                    ? newIndex
                    : 0;


            render();

        }

        catch (error) {

            console.error(error);

            alert(
                "Unable to read this file."
            );

        }

    }


    /* =====================================================
       ADD BUTTON
    ===================================================== */

    addButton?.addEventListener(
        "click",
        () => {

            const choice =
                prompt(
                    "Where do you want to add this file?\n\n" +
                    "1 = Prelim\n" +
                    "2 = Midterm\n" +
                    "3 = Final"
                );


            const periodMap = {

                "1": "Prelim",
                "2": "Midterm",
                "3": "Final"

            };


            const period =
                periodMap[choice];


            if (!period) {

                alert(
                    "Please choose 1, 2, or 3."
                );

                return;

            }


            addFileToPeriod(period);

        }
    );


    render();

}



/* =========================================================
   CREATE FILE CARD
========================================================= */

function renderFileCard({
    type,
    fileData,
    period,
    onReplace
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


    const title =
        fileData?.name ||
        (
            type === "quiz"
                ? `Quiz ${period}`
                : `Lab ${period}`
        );


    /* IMAGE PREVIEW */

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
                    src="${escapeHTML(
                        fileData.preview
                    )}"
                    alt="${escapeHTML(
                        title
                    )} preview"
                    class="academic-view-image"
                    data-image="${escapeHTML(
                        fileData.preview
                    )}"
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
                        ${escapeHTML(period)}
                    </span>

                </div>

            </div>

        `;

    }


    /* CARD */

    card.innerHTML = `

        ${preview}

        <div class="file-card-head">

            <span class="file-index">
                ${type.toUpperCase()}
                ${escapeHTML(
                    period.toUpperCase()
                )}
            </span>

            <span class="doc-icon">

                <i
                    class="${
                        fileData?.type?.startsWith("image/")
                            ? "fa-regular fa-image"
                            : "fa-regular fa-file-pdf"
                    }"
                ></i>

            </span>

        </div>


        <h3>
            ${
                hasFile
                    ? escapeHTML(fileData.name)
                    : `No ${type} file yet`
            }
        </h3>


        <p class="file-status">

            ${
                hasFile
                    ? escapeHTML(fileData.name)
                    : `Add your ${period} ${type} file.`
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


    /* VIEW */

    card
        .querySelector(".view-btn")
        ?.addEventListener(
            "click",
            () => {

                if (!hasFile) return;

                openFileForAcademic(
                    fileData
                );

            }
        );


    /* REPLACE / ADD */

    card
        .querySelector(".replace-btn")
        ?.addEventListener(
            "click",
            onReplace
        );


    return card;

}



/* =========================================================
   OPEN QUIZ / LAB FILE
========================================================= */

function openFileForAcademic(fileData) {

    if (!fileData) return;


    const isPDF =
        fileData.type === "application/pdf" ||
        /\.pdf$/i.test(
            fileData.name || ""
        );


    /* PDF */

    if (isPDF) {

        if (fileData.data) {

            openStoredFile(
                fileData
            );

            return;

        }

        if (fileData.path) {

            window.open(
                fileData.path,
                "_blank"
            );

            return;

        }

    }


    /* IMAGE */

    if (fileData.preview) {

        openAcademicImage(
            fileData.preview,
            fileData.name
        );

        return;

    }


    if (fileData.data) {

        openStoredFile(
            fileData
        );

        return;

    }


    if (fileData.path) {

        window.open(
            fileData.path,
            "_blank"
        );

    }

}



/* =========================================================
   IMAGE VIEWER
========================================================= */

function openAcademicImage(
    imageSrc,
    title = "Preview"
) {

    initAcademicImageViewer();


    const viewer =
        document.getElementById(
            "academicImageViewer"
        );

    const viewerImage =
        document.getElementById(
            "academicViewerImage"
        );


    if (
        !viewer ||
        !viewerImage
    ) {
        return;
    }


    viewerImage.src =
        imageSrc;

    viewerImage.alt =
        title;


    viewer.style.display =
        "flex";

    viewer.classList.add(
        "active"
    );

}



/* =========================================================
   CREATE IMAGE VIEWER
========================================================= */

function initAcademicImageViewer() {

    let viewer =
        document.getElementById(
            "academicImageViewer"
        );


    /* CREATE ONCE */

    if (!viewer) {

        viewer =
            document.createElement("div");

        viewer.id =
            "academicImageViewer";

        viewer.className =
            "academic-image-viewer";


        viewer.innerHTML = `

            <button
                type="button"
                class="academic-image-viewer-close"
                aria-label="Close"
            >

                <i class="fa-solid fa-xmark"></i>

            </button>


            <img
                id="academicViewerImage"
                src=""
                alt=""
            >

        `;


        document.body.appendChild(
            viewer
        );


        viewer.style.display =
            "none";


        /* CLOSE X */

        viewer
            .querySelector(
                ".academic-image-viewer-close"
            )
            .addEventListener(
                "click",
                closeAcademicImageViewer
            );


        /* CLICK OUTSIDE */

        viewer.addEventListener(
            "click",
            event => {

                if (
                    event.target === viewer
                ) {

                    closeAcademicImageViewer();

                }

            }
        );


        /* ESC */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape"
                ) {

                    closeAcademicImageViewer();

                }

            }
        );

    }


    /* CONNECT IMAGE PREVIEWS */

    document
        .querySelectorAll(
            ".academic-view-image"
        )
        .forEach(image => {

            if (
                image.dataset.viewerReady
            ) {
                return;
            }


            image.dataset.viewerReady =
                "true";


            image.addEventListener(
                "click",
                () => {

                    openAcademicImage(
                        image.dataset.image ||
                        image.src,

                        image.alt ||
                        "Preview"
                    );

                }
            );

        });

}



/* =========================================================
   CLOSE IMAGE VIEWER
========================================================= */

function closeAcademicImageViewer() {

    const viewer =
        document.getElementById(
            "academicImageViewer"
        );

    const image =
        document.getElementById(
            "academicViewerImage"
        );


    if (!viewer) return;


    viewer.classList.remove(
        "active"
    );

    viewer.style.display =
        "none";


    if (image) {
        image.src = "";
    }

}



/* =========================================================
   START
========================================================= */

initExam();

initFlexibleFiles(
    "quiz",
    STORAGE.quiz,
    "addQuiz",
    "quizCount"
);

initFlexibleFiles(
    "lab",
    STORAGE.lab,
    "addLab",
    "labCount"
);
