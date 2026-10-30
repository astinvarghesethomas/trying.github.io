
// OPEN AND CLOSE EDITOR

function openEditor() {
    document.getElementById("editor").style.display = "flex";
}

function closeEditor() {
    document.getElementById("editor").style.display = "none";
}

// SAVE PERSONAL DETAILS

function saveDetails() {
    const name = document.getElementById("inputName").value;
    const role = document.getElementById("inputRole").value;
    const bio = document.getElementById("inputBio").value;
    const about = document.getElementById("inputAbout").value;
    const education = document.getElementById("inputEducation").value;
    const skills = document.getElementById("inputSkills").value;
    const email = document.getElementById("inputEmail").value;

    if (name) {
        document.getElementById("name").textContent = name;
    }

    document.getElementById("role").textContent = role;
    document.getElementById("bio").textContent = bio;
    document.getElementById("aboutText").textContent = about;
    document.getElementById("education").textContent = education;
    document.getElementById("emailDisplay").textContent = email;

    const skillsList = document.getElementById("skillsList");
    skillsList.innerHTML = "";

    skills.split(",").filter(s => s.trim()).forEach(skill => {
        const span = document.createElement("span");
        span.textContent = skill.trim();
        skillsList.appendChild(span);
    });

    // ADD PROJECT
    const title = document.getElementById("projectTitle").value;
    const description = document.getElementById("projectDescription").value;

    if (title) {
        const project = document.createElement("div");
        project.className = "project";

        const heading = document.createElement("h3");
        heading.textContent = title;

        const paragraph = document.createElement("p");
        paragraph.textContent = description;

        project.append(heading, paragraph);

        document.getElementById("projectList").appendChild(project);
    }

    // PROFILE IMAGE
    const file = document.getElementById("inputPhoto").files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById("profileImage").src = e.target.result;
            saveToStorage();
        };

        reader.readAsDataURL(file);
    }

    saveToStorage();
    closeEditor();

    alert("Portfolio updated successfully!");
}

// SAVE DETAILS IN BROWSER

function saveToStorage() {
    const data = {
        name: document.getElementById("name").textContent,
        role: document.getElementById("role").textContent,
        bio: document.getElementById("bio").textContent,
        about: document.getElementById("aboutText").textContent,
        education: document.getElementById("education").textContent,
        email: document.getElementById("emailDisplay").textContent,
        skills: Array.from(
            document.querySelectorAll("#skillsList span")
        ).map(s => s.textContent),
        projects: Array.from(
            document.querySelectorAll("#projectList .project")
        ).map(p => ({
            title: p.querySelector("h3")?.textContent || "",
            description: p.querySelector("p")?.textContent || ""
        })),
        photo: document.getElementById("profileImage").src
    };

    localStorage.setItem("myPortfolio", JSON.stringify(data));
}

// LOAD SAVED DETAILS

window.addEventListener("DOMContentLoaded", function() {
    const saved = localStorage.getItem("myPortfolio");

    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        document.getElementById("name").textContent = data.name;
        document.getElementById("role").textContent = data.role;
        document.getElementById("bio").textContent = data.bio;
        document.getElementById("aboutText").textContent = data.about;
        document.getElementById("education").textContent = data.education;
        document.getElementById("emailDisplay").textContent = data.email;

        document.getElementById("skillsList").innerHTML = "";
        (data.skills || []).forEach(skill => {
            const span = document.createElement("span");
            span.textContent = skill;
            document.getElementById("skillsList").appendChild(span);
        });

        document.getElementById("projectList").innerHTML = "";

        (data.projects || []).forEach(p => {
            const card = document.createElement("div");
            card.className = "project";

            const heading = document.createElement("h3");
            heading.textContent = p.title;

            const paragraph = document.createElement("p");
            paragraph.textContent = p.description;

            card.append(heading, paragraph);
            document.getElementById("projectList").appendChild(card);
        });

        if (data.photo) {
            document.getElementById("profileImage").src = data.photo;
        }
    } catch (error) {
        console.error("Could not load saved portfolio:", error);
    }
});

// CUSTOM SETTINGS

function openSettings() {
    document.getElementById("settings").style.display = "flex";
}

function closeSettings() {
    document.getElementById("settings").style.display = "none";
}

function changeTheme() {
    document.body.style.background =
        document.getElementById("bgColor").value;

    document.body.style.color =
        document.getElementById("textColor").value;

    document.querySelectorAll(".project, .modal-content").forEach(el => {
        el.style.background =
            document.getElementById("panelColor").value;
    });

    const theme = {
        bg: document.getElementById("bgColor").value,
        text: document.getElementById("textColor").value,
        panel: document.getElementById("panelColor").value
    };

    localStorage.setItem("portfolioTheme", JSON.stringify(theme));

    closeSettings();
}

function loadTheme() {
    const saved = localStorage.getItem("portfolioTheme");

    if (saved) {
        const theme = JSON.parse(saved);

        document.getElementById("bgColor").value = theme.bg;
        document.getElementById("textColor").value = theme.text;
        document.getElementById("panelColor").value = theme.panel;

        document.body.style.background = theme.bg;
        document.body.style.color = theme.text;

        document.querySelectorAll(".project, .modal-content").forEach(el => {
            el.style.background = theme.panel;
        });
    }
}

loadTheme();

// DOWNLOAD PORTFOLIO INFORMATION

function downloadData() {
    const data = localStorage.getItem("myPortfolio");

    if (!data) {
        alert("Save your portfolio details first.");
        return;
    }

    const blob = new Blob([data], {
        type: "application/json"
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "my-portfolio.json";
    link.click();

    URL.revokeObjectURL(link.href);
}

// GMAIL CONNECTION

function sendGmail() {
    const recipient =
        document.getElementById("recipient").value;

    const subject =
        document.getElementById("mailSubject").value;

    const body =
        document.getElementById("mailBody").value;

    if (!recipient || !recipient.includes("@")) {
        alert("Please enter a valid recipient email.");
        return;
    }

    const gmailURL =
        "https://mail.google.com/mail/?view=cm&fs=1" +
        "&to=" + encodeURIComponent(recipient) +
        "&su=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

    window.open(gmailURL, "_blank", "noopener");
}

// GEMINI AI

function openGemini() {
    document.getElementById("gemini").style.display = "flex";
}

function closeGemini() {
    document.getElementById("gemini").style.display = "none";
}

async function askGemini() {
    const key = document.getElementById("apiKey").value.trim();
    const prompt = document.getElementById("aiPrompt").value.trim();
    const responseBox = document.getElementById("aiResponse");

    if (!key || !prompt) {
        alert("Enter your Gemini API key and prompt.");
        return;
    }

    responseBox.textContent = "Gemini is thinking...";

    try {
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
            encodeURIComponent(key),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Request failed");
        }

        responseBox.textContent =
            data.candidates?.[0]?.content?.parts
                ?.map(part => part.text || "")
                .join("\n") || "No response received.";

    } catch (error) {
        responseBox.textContent =
            "Error: " + error.message;
    }
}
