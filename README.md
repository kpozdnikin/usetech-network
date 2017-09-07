UseTech test network

cd fabric-tools
./stopFabric.sh
./teardownFabric.sh

./startFabric.sh
./createComposerProfile.sh


cd ../my-network
cd dist
composer network deploy -a usetech.bna -p hlfv1 -i PeerAdmin -s randomString
// проверка
composer network ping -n usetech -p hlfv1 -i admin -s adminpw

cd usetech

npm start - для разработки, адрес http://192.168.100.73:8080/

ng build –prod - для продакшена, адрес http://192.168.100.73