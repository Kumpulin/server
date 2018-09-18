const multer = require('multer')
const path = require('path')

module.exports = multer.diskStorage({
  destination: (req, file, next) => {
    next(null, path.join(__dirname, '..', 'public/images/uploads'))
  },

  filename: (req, file, next) => {
    const ext = file.mimetype.split('/')[1]

    next(null, `${file.fieldname}-${Date.now()}.${ext}`)
  }
})
