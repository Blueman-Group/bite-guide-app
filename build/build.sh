cd /home/dodo/biteguide/frontend/programmentwurf-gruppe-5

echo "Checkout to release branch"
git checkout release/1.0.0
echo "Pull latest"
git pull

echo "Build app"
ionic build --prod

echo "Check if web server is running"

if screen -ls | grep -q "biteguide"; then
        echo "Kill screens"
        pkill screen
else
        echo "No screens are open"
fi

echo "Start web server"
screen -dmS biteguide lite-server -c /home/dodo/biteguide/frontend/programmentwurf-gruppe-5/build/bs-config.json

