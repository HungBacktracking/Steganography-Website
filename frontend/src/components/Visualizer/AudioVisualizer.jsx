import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const formWaveSurferOptions = ref => ({
  container: ref,
  waveColor: "#eee",
  progressColor: "OrangeRed",
  cursorColor: "OrangeRed",
  barWidth: 4,
  barRadius: 6,
  responsive: true,
  height: 200,
  // width: 400,
  normalize: true,
  partialRender: true
});

export default function AudioVisualizer({ blob }) {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [playing, setPlay] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    setPlay(false);

    const options = formWaveSurferOptions(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);

    wavesurfer.current.loadBlob(blob);

    wavesurfer.current.on("ready", function() {
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume);
        setVolume(volume);
      }
    });

    return () => wavesurfer.current.destroy();
  }, [blob]);

  const handlePlayPause = () => {
    setPlay(!playing);
    wavesurfer.current.playPause();
  };

  const onVolumeChange = e => {
    const { target } = e;
    const newVolume = +target.value;

    if (newVolume) {
      setVolume(newVolume);
      wavesurfer.current.setVolume(newVolume || 1);
    }
  };

  return (
    <div className="w-full">
      <div id="waveform" ref={waveformRef} className="bg-gray-800 p-4 rounded-lg" />

      <div className="controls flex items-center justify-around mt-4">
        <button
          className="bg-orange-500 text-white rounded-full p-2 w-16 h-16 flex items-center justify-center mr-4"
          onClick={handlePlayPause}
        >
          {!playing ? "Play" : "Pause"}
        </button>
        <div className="flex items-center">
          <input
            type="range"
            id="volume"
            name="volume"
            min="0.01"
            max="1"
            step=".025"
            onChange={onVolumeChange}
            defaultValue={volume}
            className="w-80 mr-2"
          />
          {/* <label htmlFor="volume" className="text-black">Volume</label> */}
        </div>
          <label htmlFor="volume" className="text-white ml-2 bg-gray-700 px-2 py-1 rounded">Volume</label>
      </div>
    </div>
  );
}
