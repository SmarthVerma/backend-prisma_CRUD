const asyncHandler2 = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler2 }

const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.code < 600 || 500).json({
            success: false,
            message: error.message,
            stack: error.stack

        })
    }
}

export { asyncHandler }