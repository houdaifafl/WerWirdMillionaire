class API_Error extends Error {
    /**
     * Creates a safely handled error object
     * @param {string} message the error message
     * @param {number} status the http status code
     * @param {string} id the error id
     */
    constructor(message, status, id) {
        super(message);
        this.status = status;
        this.id = id;
    }
};

module.exports = API_Error;