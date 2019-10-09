#!/usr/bin/env bash
echo Beginning deployment

BUCKET=potree-movie

aws s3 cp ./index.html s3://$BUCKET
aws s3 cp ./movie.js s3://$BUCKET
aws s3 cp ./movieResources.js s3://$BUCKET

aws s3 cp --recursive ./libs s3://$BUCKET/libs/
aws s3 cp --recursive ./build s3://$BUCKET/build/
aws s3 cp --recursive ./dist s3://$BUCKET/dist/
