sudo apk add npm git
npm i
git clone https://github.com/jonshaw199/crypt.git
read -p "Decrypt .env files? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1
read -p "Enter encryption key: " key
read -p "Enter initialization vector: " iv
node crypt/index.js -d .. .env.encrypted "$key" "$iv"
echo "postCreate.sh complete"