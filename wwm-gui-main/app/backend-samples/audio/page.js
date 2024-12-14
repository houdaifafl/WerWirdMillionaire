"use client";
import { useGlobalAudioPlayer } from 'react-use-audio-player';

export default function () {
    const { play, pause, paused } = useGlobalAudioPlayer();

    function toggleAudio() {
        if (paused) {
            play();
        } else {
            pause();
        }
    }

    return <div>
        Audio is {paused ? "paused" : "playing"}!
        <button onClick={toggleAudio}>Toggle audio</button>
    </div>
}