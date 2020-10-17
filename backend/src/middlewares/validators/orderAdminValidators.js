const { celebrate, Segments, Joi } = require('celebrate');

module.exports = {

    list: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required()
        })
        .unknown(),
    }),

    update: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required()
        })
        .unknown(),

        [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
        }),

        [Segments.BODY]: Joi.object().keys({
            status: Joi.string()
        }).min(1)
    }),

    destroy: celebrate({
        [Segments.HEADERS]: Joi.object().keys({
            authorization: Joi.string().required()
        })
        .unknown(),

        [Segments.PARAMS]: Joi.object().keys({
            id: Joi.number().required()
        }),
    }),
}
