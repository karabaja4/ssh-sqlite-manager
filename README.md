# SSH SQLite Manager

This tool allows you to manage your SQLite databases remotly using SSH. The only dependency is the `sqlite3` binary installed on the server you wish to query.

# How to use

Enter:
* Hostname (in a format host:port)
* Database path (on the server)
* SSH user
* Private key path ([RSA private key](https://wiki.archlinux.org/index.php/SSH_keys#Generating_an_SSH_key_pair) without a password) or a Password

Use `Load (Ctrl+T)` to list all the database tables. Double click the table to list top 1000 rows in the table. This mode allows editing of the individual cells inside the table (by double clicking the cell, see screenshots below).

Use `Execute (Ctrl+E)` to execute a query in the main editor. Select a line (or lines) in the editor to execute only those lines. Use `Ctrl-E` as a shortcut to the Execute button.

# Download

Download prebuilt Electron archive:

[ssh-sqlite-manager-linux-x64.zip](https://karabaja4.blob.core.windows.net/stuff/ssh-sqlite-manager-linux-x64.zip)

# Screenshots

![screenshot1](https://user-images.githubusercontent.com/1043015/118727776-9d7d2780-b833-11eb-856a-6bb8865cb37c.png)

![screenshot2](https://user-images.githubusercontent.com/1043015/118727798-a79f2600-b833-11eb-9ceb-b73c14580928.png)
