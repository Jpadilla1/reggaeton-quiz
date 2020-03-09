import { Machine, assign } from "xstate";

export const speechMachine = Machine(
  {
    initial: "initializing",
    context: {
      recognition: null,
      transcript: null
    },
    states: {
      initializing: {
        invoke: {
          src: () => callback => {
            try {
              const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
              const recognition = new SpeechRecognition();
              recognition.lang = "es-PR";
              callback({ type: "success", recognition });
            } catch (e) {
              console.error(e);
              callback("failure");
            }
          }
        },
        on: {
          success: {
            target: "supported",
            actions: ["saveInstance", "setupListeners"]
          },
          failure: "notSupported"
        }
      },
      notSupported: {
        type: "final"
      },
      supported: {
        initial: "idle",
        states: {
          idle: {
            on: {
              start: "listening"
            }
          },
          listening: {
            entry: "startListening",
            on: {
              silence: "speechEnd",
              result: {
                target: "result",
                actions: "saveTranscript"
              }
            }
          },
          speechEnd: {
            after: {
              2000: "idle"
            }
          },
          result: {
            after: {
              3000: "idle"
            }
          },
          failure: {
            after: {
              2000: "idle"
            }
          }
        },
        on: {
          recognitionError: {
            target: "supported.failure",
            actions: "logFailure"
          }
        }
      }
    }
  },
  {
    actions: {
      saveInstance: assign((_, { recognition }) => ({ recognition })),
      logFailure: (_, event) => {
        console.log(event);
      },
      startListening: ({ recognition }) => {
        recognition.start();
      },
      saveTranscript: assign((_, { transcript }) => ({ transcript }))
    }
  }
);
