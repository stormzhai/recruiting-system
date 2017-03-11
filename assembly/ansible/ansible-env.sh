#!/usr/bin/env bash
rm local-inventory
cd ../../
root=$(pwd)
echo -e "[docker_host] \nlocalhost ansible_connection=local project_root=${root}/\n" >> './assembly/ansible/local-inventory'
echo -e "[local_server] \nlocalhost ansible_connection=local project_root=${root}/\n" >> './assembly/ansible/local-inventory'
echo -e "[REMOTE_server] \n54.222.191.27 ansible_ssh_user=ubuntu project_root=${root}/\n" >> './assembly/ansible/local-inventory'
