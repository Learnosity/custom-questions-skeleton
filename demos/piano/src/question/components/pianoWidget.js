export default class PianoWidget {
    constructor(el, range, { question, response }) {
        this.el = el;
        this.range = range;
        this.question = question;
        this.response = response;
        // two octaves hard coded - want to implement custom range later
        this.notes = [
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
            "A",
            "A#",
            "B",
            "C",
            "C#",
            "D",
            "D#",
            "E",
            "F",
            "F#",
            "G",
            "G#",
            "A",
            "A#",
            "B",
        ];
    }

    render() {
        const keyboard = document.createElement("div");

        keyboard.classList.add("keyboard");
        this.el.appendChild(keyboard);
        for (let note of this.notes) {
            const key = document.createElement("div");
            
            key.classList.add("key");
            if (note.includes("#")) {
                key.classList.add("blackKey");
            } else {
                key.classList.add("whiteKey");
            }

            if (note === "C" || note === "F") {
                key.classList.add("no-offset");
            }

            keyboard.appendChild(key);
        }
    }
}
