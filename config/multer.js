const multer = require('multer')

exports.default = {
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, '../uploads')
    },

    filename: (req, file, next) => {
      const ext = file.mimetype.split('/')[1]

      next(null, `${file.fieldname}-${Date.now()}.${ext}`)
    }
  }),

  fileFilter: (req, file, next) => {
    if (!file) return next()

    const image = file.mimetype.startsWith('image/')

    if (image) {
      next(null, true)
    } else {
      return next({ message: 'File not supported.' })
    }
  }
}
