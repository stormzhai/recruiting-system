#!/usr/bin/env bash
rm local-inventory
cd ../../
root=$(pwd)
echo -e "[docker_host] \nlocalhost ansible_connection=local project_root=${root}/\n" >> './assembly/ansible/local-inventory'
echo -e "[local_server] \nlocalhost ansible_connection=local project_root=${root}/\n" >> './assembly/ansible/local-inventory'
echo -e "[remote_server] \n54.222.191.27 ansible_ssh_user=ubuntu project_root=/home/ubuntu/works/recruiting-system/
10.22.64.4 ansible_ssh_user=twer project_root=/Users/twer/works/recruiting-system/" >> './assembly/ansible/local-inventory'
