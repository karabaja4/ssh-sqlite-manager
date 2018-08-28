# SSH SQLite Manager

This tool allows you to manage your SQLite databases remotly using SSH. The only dependency is the `sqlite3` binary installed on the server you wish to query.

# How to use

Enter:
* Hostname
* Database path (on the server)
* SSH user
* Private key path ([RSA private key](https://wiki.archlinux.org/index.php/SSH_keys#Generating_an_SSH_key_pair))

Use `Load Tables` to list all the database tables. Double click the table to list top 1000 rows in the table. This mode allows editing of the individual cells inside the table (by double clicking the cell, see screenshots below).

Use `Execute Query` to execute a query in the main editor. Select a line (or lines) in the editor to execute only those lines. Use Crtl-E as a shortcut to the Execute button.

# Download

Download prebuilt Electron archives for your platform:

[ssh-sqlite-manager-linux-ia32.zip](https://karabaja4.blob.core.windows.net/stuff/ssh-sqlite-manager-linux-ia32.zip)\
[ssh-sqlite-manager-linux-x64.zip](https://karabaja4.blob.core.windows.net/stuff/ssh-sqlite-manager-linux-x64.zip)\
[ssh-sqlite-manager-win32-ia32.zip](https://karabaja4.blob.core.windows.net/stuff/ssh-sqlite-manager-win32-ia32.zip)\
[ssh-sqlite-manager-win32-x64.zip](https://karabaja4.blob.core.windows.net/stuff/ssh-sqlite-manager-win32-x64.zip)\
[ssh-sqlite-manager-darwin-x64.zip](https://karabaja4.blob.core.windows.net/stuff/ssh-sqlite-manager-darwin-x64.zip)

# Troubleshooting

You may come across "path too long" error when extracting prebuilt archives on Windows. This is common error when copying Node.js node_modules folder on Windows machine because of large number of sub-directories and long file/folder names. You can fix this error by choosing a short path to extract in, for example `C:\a`. Otherwise, you can disable the 260-character MAX_PATH limit in Windows. Check this [MSDN](https://msdn.microsoft.com/en-us/library/aa365247(v=vs.85).aspx#maxpath) article.

# Screenshots

![alt text](https://karabaja4.blob.core.windows.net/stuff/ssm2.png)

![alt text](https://karabaja4.blob.core.windows.net/stuff/ssm_edit2.png)
