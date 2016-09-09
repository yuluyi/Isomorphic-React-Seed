#!/bin/bash -e

check() {
    for (( i = 1; i < $# + 1; i++ )); do
        # http://stackoverflow.com/questions/592620/check-if-a-program-exists-from-a-bash-script
        if hash ${!i} 2>/dev/null; then
            echo "\033[32m ${!i} has installed \033[0m"
        else
            echo "\033[31m ${!i} is not install, please run $ (sudo) npm install ${!i} -g to install the dependence \033[0m"
            exit
        fi
    done
}

clean() {
    for (( i = 1; i < $# + 1; i++ )); do
        if [ -e ${!i} ]; then
            rm -r ${!i}
            echo -e "\033[32m ${!i} has removed \033[0m"
        fi
    done
}