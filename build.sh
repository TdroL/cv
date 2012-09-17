#!/bin/bash

echo "Remove CSS files"
for FILE in `find assets/scss/ -name *.scss -type f`; do
	FILE=${FILE//scss/css}
	if [[ -f $FILE ]]; then
		LOG=`rm $FILE 2>&1`

		if [[ $? != 0 ]]; then
			echo "  $FILE Failed"
			echo $LOG
		else
			echo "  $FILE OK"
		fi
	fi
done

echo -n "Recompiling SCSS files: "
LOG=`compass compile -c config.rb 2>&1`
if [[ $? != 0 ]]; then
	echo "Failed"
	echo $LOG
else
	echo "OK"
fi

echo -n "Recompiling CoffeeScript files: "
LOG=`coffee -o assets/js/ -cb assets/coffee/ 2>&1`
if [[ $? != 0 ]]; then
	echo "Failed"
	echo $LOG

	exit 1
else
	echo "OK"
fi

echo "Compress JavaScript files"
for FILE in `find assets/js/ -name *.js -type f -maxdepth 1`; do
	LOG=`uglifyjs -o $FILE $FILE`

	if [[ $? != 0 ]]; then
		echo "  $FILE Failed"
		echo $LOG
	else
		echo "  $FILE OK"
	fi
done