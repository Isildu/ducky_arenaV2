/**
 * Middleware
 *
 * Valida parametros id usados por rutas publicas.
 */
const validateId = (req, res, next) => {
    const { id } = req.params;
    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
        return res.status(400).json({
            message: "El parametro id debe ser un numero entero positivo"
        });
    }

    next();
};

module.exports = validateId;
