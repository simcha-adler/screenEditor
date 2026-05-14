//@ts-check

/**
 * שליחת הודעה 
 * @param {string} type
 * @param {Object} details 
 */
function post(type, details = {}) {
    window.parent.postMessage({ type, details }, '*')
}

function initListeners() {
    window.when('message', ( /**@type {MessageEvent}*/ message) => {
        if (messageDict[message.data.type])
            messageDict[message.data.type](message.data.details);
    })
}

const messageDict = {
    newPage: (data) => { editor.innerHTML = data.html; styles.innerHTML = data.css; },
}



export const Message = {
    post,
    initListeners
}

// initListeners();

//@ts-ignore
window.Message = Message;