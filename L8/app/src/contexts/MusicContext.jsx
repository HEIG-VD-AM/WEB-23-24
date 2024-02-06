import React, {createContext, useReducer} from 'react';
export const MusicContext = createContext();

function reducer(state, action) {
    switch(action.type) {
        case 'play-track':
            if (state.current !== undefined) {
                return {
                    ...state,
                    status: 'playing'
                };
            }

            // consume last song in queue
            if (state.queue.length === 0 && state.current === undefined) {
                return {
                    ...state,
                    status: 'paused'
                };
            }

            return {
                ...state,
                status: 'playing',
                current: state.queue[0],
            };
        case 'pause-track':
            return {
                ...state,
                status: 'paused'
            };
        case 'resume-track':
            return {
                ...state,
                status: 'playing'
            };
        case 'next-track':
            if (state.queue.length === 0) {
                return {
                    ...state,
                    status: 'paused',
                    current: undefined
                };
            }
            let next = state.position === state.queue.length - 1 ? 0 : state.position + 1;
            return {
                ...state,
                position: next,
                current: state.queue[next],
            };
        case 'previous-track':
            let prev =  state.position === 0 ? state.queue.length - 1 : state.position - 1;
            return {
                ...state,
                position: prev,
                current: state.queue[prev],
            }
        case 'enqueue-track':

            // check if track is already in queue
            let index = state.queue.findIndex((track) => track.id === action.track.id);
            if (index !== -1) {
                return state;
            }

            return {
                ...state,
                queue: [...state.queue, action.track]
            };
        default:
            return state;
    }
}

export const MusicContextProvider = ({ children }) => {
    const [music, dispatch] = useReducer(reducer, {
        status: "paused",
        current: undefined,
        position: 0,
        queue: []
    });

    return (
        <MusicContext.Provider value={{ music, dispatch }}>
            {children}
        </MusicContext.Provider>
    );
};

export default MusicContextProvider;