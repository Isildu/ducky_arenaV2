/**
 * Middleware
 *
 * Centraliza errores inesperados enviados con next(error).
 */
const errorHandler = (error, req, res, next) => {
    const status = error.status || 500;
    const response = {
        error: "Error interno del servidor"
    };

    if (process.env.NODE_ENV !== "production" && error.message) {
        response.message = error.message;
    }

    res.status(status).json(response);
};

module.exports = errorHandler;
