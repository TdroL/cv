#!/bin/bash

COFFEE_LOG=./.logs/coffee.log
COMPASS_LOG=./.logs/compass.log

COFFEE_PID=./.logs/coffee.pid
COMPASS_PID=./.logs/compass.pid
touch $COFFEE_PID $COMPASS_PID

function start_coffee {
	local PID=`cat $COFFEE_PID`
	ps -ef | grep $PID | grep /bin/sh$ > /dev/null || {
		echo "Starting coffeescrit watcher"
		(coffee -o assets/js/ -cbw assets/cs/ &> $COFFEE_LOG) &
		echo $! > $COFFEE_PID
	}
}

function start_compass {
	local PID=`cat $COMPASS_PID`
	ps -ef | grep $PID | grep /bin/ruby$ > /dev/null || {
		echo "Starting compass watcher"
		(compass watch &> $COMPASS_LOG) &
		echo $! > $COMPASS_PID
	}
}

function stop_coffee {
	local PID=`cat $COFFEE_PID`
	ps -ef | grep $PID | grep /bin/sh$ &> /dev/null && {
		echo "Stopping coffeescript watcher"
		kill $PID > /dev/null
	}
}

function stop_compass {
	local PID=`cat $COMPASS_PID`
	ps -ef | grep $PID | grep /bin/ruby$ &> /dev/null && {
		echo "Stopping compass watcher"
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