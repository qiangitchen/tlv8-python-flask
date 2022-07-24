#!/bin/sh
export FLASK_PATH=/app/flask/tlv8-python-flask
export FLASK_PID=$FLASK_PATH/flask.pid
#export FLASK_PROJECT=$FLASK_PATH/tlv8-python-flask
echo $FLASK_PATH
if [ "$1" = "start" ]; then

  if [ ! -z "$FLASK_PID" ]; then
    if [ -f "$FLASK_PID" ]; then
      if [ -s "$FLASK_PID" ]; then
        echo "Existing PID file found during start."
        if [ -r "$FLASK_PID" ]; then
          PID=$(cat "$FLASK_PID")
          ps -p $PID >/dev/null 2>&1
          if [ $? -eq 0 ]; then
            echo "Flask appears to still be running with PID $PID. Start aborted."
            echo "If the following process is not a Flask process, remove the PID file and try again:"
            ps -f -p $PID
            exit 1
          else
            echo "Removing/clearing stale PID file."
            rm -f "$FLASK_PID" >/dev/null 2>&1
            if [ $? != 0 ]; then
              if [ -w "$FLASK_PID" ]; then
                cat /dev/null >"$FLASK_PID"
              else
                echo "Unable to remove or clear stale PID file. Start aborted."
                exit 1
              fi
            fi
          fi
        else
          echo "Unable to read PID file. Start aborted."
          exit 1
        fi
      else
        rm -f "$FLASK_PID" >/dev/null 2>&1
        if [ $? != 0 ]; then
          if [ ! -w "$FLASK_PID" ]; then
            echo "Unable to remove or write to empty PID file. Start aborted."
            exit 1
          fi
        fi
      fi
    fi
  fi

  echo "To Start Flask"
  if [ -z "$FLASK_PROJECT" ]; then
    echo "Message: \$FLASK_PROJECT not set"
  else
    cd $FLASK_PROJECT
    pwd
  fi
  source venv/bin/activate
  echo "Load flask venv"
  mkdir -p $FLASK_PATH/logs >/dev/null 2>&1
  echo "Log folder maked"
  nohup python server.py >$FLASK_PATH/logs/flask.log 2>&1 &
  echo "start in nohup"
  echo $! >$FLASK_PID
  echo "PID:$(cat $FLASK_PID)"
  echo "Falsk started."

elif [ "$1" = "stop" ]; then

  if [ ! -z "$FLASK_PID" ]; then
    if [ -f "$FLASK_PID" ]; then
      if [ -s "$FLASK_PID" ]; then
        kill -0 $(cat "$FLASK_PID") >/dev/null 2>&1
        if [ $? -gt 0 ]; then
          echo "PID file found but either no matching process was found or the current user does not have permission to stop the process. Stop aborted."
          exit 1
        fi
      else
        echo "PID file is empty and has been ignored."
      fi
    else
      echo "\$FLASK_PID was set but the specified file does not exist. Is Flask running? Stop aborted."
      exit 1
    fi
  fi

  echo "To Stop Flask"
  kill -9 $(cat $FLASK_PID) >/dev/null 2>&1
  echo "Falsk stopped."
  rm -f $FLASK_PID >/dev/null 2>&1
  echo "PID File cleared."

else

  echo "Action Type No Support."
  exit 1

fi
