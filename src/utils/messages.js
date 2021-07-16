const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (url) => {
    return {
        createdAt: new Date().getTime(),
        url
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}