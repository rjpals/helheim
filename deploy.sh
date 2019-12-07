#!/usr/bin/env bash
echo Beginning deployment

BUCKET=potree-movie

GITHUBPAGESFOLDER=~/hobu/helheim.lidar.io/

FILES=( movie/dist/bundle.js movie/dist/main.css movie/index.html index.html favicon* glacier.png )
LIBS=( movie/libs movie/build )

(cd movie && npx webpack) || exit 1

for FILE in ${FILES[@]}; do
    aws s3 cp ./$FILE s3://$BUCKET/$FILE || exit 1 
    cp ./$FILE $GITHUBPAGESFOLDER/$FILE
    (cd $GITHUBPAGESFOLDER && git add $FILE)
done

for LIB in ${LIBS[@]}; do
    cp -r ./$LIB $GITHUBPAGESFOLDER/movie
    list=$(aws s3 ls s3://$BUCKET/$LIB/)
    if [ -z "$list" ]
    then
        aws s3 cp --recursive ./$LIB s3://$BUCKET/$LIB/ || exit 1
    else
        echo Library $LIB already exists, skipping...
    fi
done

#STAGED=$(git diff)
#UNSTAGED=$(git diff --cached)

#echo $STAGED
#echo $UNSTAGED

#if [ -n "$STAGED" ]; then
#    if [ -n "$UNSTAGED" ]; then
#        echo Clean diff - commiting to build repo
#    fi
#fi

if [[ `git status --porcelain --untracked-files=no` ]]; then
    echo "Uncommited changes, not sending to build repo"
else
    echo "All changes committed, creating commit in build repo... (you must still push)"
    HEADSHA=$(git rev-parse HEAD)
    (cd $GITHUBPAGESFOLDER && git commit -m "Git build $HEADSHA")
fi

echo Deployment complete
