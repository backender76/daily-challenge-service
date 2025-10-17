# Score Service

## Полезые ссылки

Ссылка для подключения в Compass: `mongodb://demo:demo@localhost:27019/push`

## Зависимости

1) Docker
2) Ansible

## After git clone

1) Создать файл `.env` по образу и подобию `default.env`. Он испрользуется в шаблоне `services.j2` для генерации конфига linux-сервиса.

2) Создать файл `.vault-pass` содержащий пароль для кошелька Ansible.

3) Создать инвентари (inventory.ini) для Ansible. Пример:

```ini
[production]
production-1 ansible_connection=ssh ansible_host=100.200.400.400 ansible_user=username

[all:vars]
ansible_python_interpreter=/usr/bin/python3.9
```

4) Выполнить `npm ci`.

## Сборка и Деплой

```bash
export ANSIBLE_VAULT_PASSWORD_FILE="./.vault-pass"

ansible-playbook -i inventory.ini build.yml --ask-become-pass

ansible-playbook -i inventory.ini deploy.yml

sudo journalctl -u score-service.service -f
```

### Секреты

`ansible-vault view host_vars/production-1/vault.yml`
