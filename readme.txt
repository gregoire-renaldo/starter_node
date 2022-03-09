starter with models : user & auth, boat(==thing), protected routes, restricted routes

1/ create .env with :

NODE_ENV=development
PORT=3000

# Mongodb
DATABASE=mongodb+srv:etc....

# jswtoken
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN=

# cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

#email mail-trap
USER_EMAIL=
PASSWORD_EMAIL=
EMAIL_HOST=
EMAIL_PORT=2525


#create git.ignore
node_modules/
.env
