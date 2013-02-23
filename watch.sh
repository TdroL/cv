#!/usr/bin/env bash

COFFEE_LOG=.logs/coffee.log
COMPASS_LOG=.logs/compass.log

COFFEE_PID=.logs/coffee.pid
COMPASS_PID=.logs/compass.pid
touch $COFFEE_PID $COMPASS_PID

function start_coffee {
	local PID=`cat $COFFEE_PID`
	ps -ef | grep $PID | grep /bin/sh$ > /dev/null || {
		echo -n "Starting CoffeeScript watcher... "
		(coffee -o assets/js/ -cbw assets/coffee/ &> $COFFEE_LOG) &
		if [ $? == 0 ];
		then
			echo $! > $COFFEE_PID
			echo "done"
		else
			echo "fail"
		fi;
	}
}

function start_compass {
	local PID=`cat $COMPASS_PID`
	ps -ef | grep $PID | grep /bin/ruby$ > /dev/null || {
		echo -n "Starting Compass watcher... "
		(compass watch &> $COMPASS_LOG) &
		if [ $? == 0 ];
		then
			echo $! > $COMPASS_PID
			echo "done"
		else
			echo "fail"
		fi;
	}
}

function stop_coffee {
	local PID=`cat $COFFEE_PID`
	if [ -z $PID ]; then return; fi;

	ps -ef | grep $PID | grep -v grep > /dev/null && {
		echo "Stopping CoffeeScript watcher"
		kill $PID > /dev/null
		return;
	}

	PID=`ps -ef | grep $PID | grep -v grep | grep node | sed "s/\s*[^ ]*\s*\([0-9]*\).*/\1/"`
	if [ -z $PID ]; then return; fi;
	ps -ef | grep $PID | grep node$ > /dev/null && {
		echo "Stopping CoffeeScript watcher"
		kill -9 $PID > /dev/null
	}
}

function stop_compass {
	local PID=`cat $COMPASS_PID`
	if [ -z $PID ]; then return; fi;

	ps -ef | grep $PID | grep -v grep > /dev/null && {
		echo "Stopping Compass watcher"
		kill $PID > /dev/null
	}
}

function start_watchers {
	case "$1" in
		coffee)
			start_coffee
			;;
		compass)
			start_compass
			;;
		*)
			start_coffee
			start_compass
			;;
	esac
}

function stop_watchers {
	case "$1" in
		coffee)
			stop_coffee
			;;
		compass)
			stop_compass
			;;
		*)
			stop_coffee
			stop_compass
			;;
	esac
}

function restart_watchers {
	case "$1" in
		coffee)
			stop_coffee
			start_coffee
			;;
		compass)
			stop_compass
			start_compass
			;;
		*)
			stop_coffee
			start_coffee
			stop_compass
			start_compass
			;;
	esac
}

function log_watchers {
	case "$1" in
		coffee)
			tail -f $COFFEE_LOG
			;;
		compass)
			tail -f $COMPASS_LOG
			;;
		*)
			tail -f $COFFEE_LOG $COMPASS_LOG
			;;
	esac
}

case "$1" in
	restart)
		restart_watchers $2
		;;
	log)
		log_watchers $2
		;;
	stop)
		stop_watchers $2
		;;
	*)
		start_watchers $2
		;;
esac