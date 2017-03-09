#!/usr/bin/env bash
cd ../../
root=$(pwd)
echo -e "[docker_host] \nlocalhost ansible_connection=local project_root=${root}/" > './assembly/ansible/local-inventory'
