import { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { speechMachine } from "./speechMachine";

export const useSpeechToText = () => {
  const [current, send] = useMachine(speechMachine);

    console.log(current.actions);

  useEffect(() => {
    if (
      current.matches({ supported: "idle" }) &&
      current.actions.map(a => a.type).includes("setupListeners")
    ) {
      const { recognition } = current.context;
      recognition.onstart = function() {
        console.log(
          "Voice recognition activated. Try speaking into the microphone."
        );
      };

      recognition.onspeechend = function() {
        console.log(
          "You were quiet for a while so voice recognition turned itself off."
        );
        send("silence");
      };

      recognition.onerror = function(event) {
        if (event.error === "no-speech") {
          console.log("No speech was detected. Try again.");
        }
        send("recognitionError", event);
      };

      recognition.onresult = function(event) {
        // event is a SpeechRecognitionEvent object.
        // It holds all the lines we have captured so far.
        // We only need the current one.
        var current = event.resultIndex;

        // Get a transcript of what was said.
        var transcript = event.results[current][0].transcript;

        var mobileRepeatBug =
          current === 1 && transcript === event.results[0][0].transcript;

        if (!mobileRepeatBug) {
          send("result", { transcript });
        }
      };
    }
  }, [current, send]);

  return [current, send];
};
