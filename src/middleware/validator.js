const Joi = require("joi");

module.exports = (schema, headerSchema = null, params = "body") => async (req, res, next) => {
    try {
        const check = await schema.validate(req[params]);
        let checkHeader = null;
        if (headerSchema) {
            checkHeader = await headerSchema.validate(req.headers);
        }
        if (check.error) {
            res.status(200).json({
                status: false,
                message: check.error.details[0].message,
                data: {}
            })
        } else {
            if (checkHeader && checkHeader.error) {
                res.status(200).json({
                    status: false,
                    message: check.error.details[0].message,
                    data: {}
                });
            }
            else {
                next();
            }
        }

    } catch (error) {
        console.log("--validator==error===>", error)
    }
}