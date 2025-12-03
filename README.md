# FEȚE DE ÎMPRUMUT (BORROWED FACES)

## 🌐 Online Access

The installation can be accessed online at: [artmaxstudio.ro/fetedeimprumut](http://artmaxstudio.ro/fetedeimprumut)

## 💡 What Is This Project?

This is a web-based **interactive video art installation**.

It is presented as a fictional digital archive where an AI, tasked with indexing memories, begins to **hallucinate**. When a voice in the archive lacks a face, the AI offers the user a "borrowed face," exploring themes of identity and compromised memory.

***
**Technology Note:** The visual content for the "borrowed faces" was created using **[LivePortrait](https://github.com/KlingTeam/LivePortrait)**.
***

## 🚀 How to Run It

This project is built with HTML, CSS, and Vanilla JavaScript and requires local media files.

1.  **Clone the Repository:**
    ```bash
    git clone <your-repo-url>
    cd borrowedfaces
    ```

2.  **Add Media Files:**
    You must populate the required media directories with your video and audio assets for the installation to function:
    * **`audio/`**: Contains the ambient background audio (e.g., `ambient.mp4`).
    * **`previews/`**: Contains the small looping video previews for the main grid tiles.
    * **`videos/`**: Contains the full-length videos for the main playback screen.

3.  **Run a Local Server (Crucial Step):**
    You must run `index.html` using a **local web server** (such as VS Code's Live Server extension, XAMPP, or MAMP). Running the file directly from your disk will prevent the videos and audio from loading correctly.

4.  **Open in Browser:**
    Navigate to the local server address (e.g., `http://localhost:8080/index.html`) to view the interactive installation.