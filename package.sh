#!/bin/bash
echo "-- Resetting environment"
rm -rf node_modules
rm -f package-lock.json *.tgz

echo "-- Install dependencies and create package-lock"
# If you have npm production dependencies, uncomment the following line
npm install --production --package-lock

echo "-- Generate SHA256 checksums"
shasum --algorithm 256 package.json package-lock.json LICENSE README.md > SHA256SUMS
rm -rf node_modules/.bin

# If you have npm production dependencies, uncomment the following line
find lib/bluenet-nodejs-lib \( -type f -o -type l \) -exec shasum --algorithm 256 {} \; >> SHA256SUMS
find crownstone \( -type f -o -type l \) -exec shasum --algorithm 256 {} \; >> SHA256SUMS
find node_modules \( -type f -o -type l \) -exec shasum --algorithm 256 {} \; >> SHA256SUMS

echo "-- Pack to tar archive"
TARFILE=`npm pack`

echo "-- Add dependent node_modules to archive"
# If you have npm production dependencies, uncomment the following 3 lines
tar --extract --ungzip --file=${TARFILE}
cp -r node_modules ./package
tar --create --gzip --file=${TARFILE} ./package

echo "-- Show SHA265 checksum of package"
shasum --algorithm 256 ${TARFILE} > ${TARFILE}.sha256sum
cat SHA256SUMS

rm -rf SHA256SUMS package