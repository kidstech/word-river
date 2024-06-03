# Setting up the 3601 development environment on Windows

This guide assumes you are running 64-bit Windows 10.

The simple list of what you need is:
- [Chrome](https://www.google.com/chrome/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- [GitKraken](https://www.gitkraken.com/git-client)
- [OpenJDK](https://adoptopenjdk.net/)
- [MongoDB Community Server](https://www.mongodb.com/)
- [NodeJS](https://nodejs.org/)
- [Angular CLI](https://cli.angular.io/)

Some of these have gotchas you will want to look out for so we have provided a more detailed guide below.

## Install Chrome

Download and run the installer from [google.com/chrome](https://www.google.com/chrome/) if you don't already have it.

## Install Visual Studio Code

Download and run the installer from [code.visualstudio.com](https://code.visualstudio.com/Download)

We recommend enabling the two "Add "Open with Code" action to Windows Explorer..." options:

![image](https://i.vgy.me/ivqONx.png)

## Install Git

Download and run the installer from [git-scm.com](https://git-scm.com/download/win)

Install it with the default options, except for the two screens described below. 

You may want to turn off the "Windows Explorer integration" shown below:

![vgy.me](https://i.vgy.me/8ouuB4.png)

You may want to have it use VS Code as the default editor:

![vgy.me](https://i.vgy.me/qmw8cK.png)

## Install GitKraken

Download and run the installer from [gitkraken.com](https://www.gitkraken.com/download/windows64)

When GitKraken starts after installing, click "Sign in with GitHub" and sign into your GitHub account. Then it will bring you to a "Set Up Your Profile" screen. Enter your name and the email address you used for your GitHub account here so your commits will show up as yours.

## Install the JDK

You need at least JDK version 11. We recommend OpenJDK 11 (LTS) from AdoptOpenJDK.

If you already have a Java version less than 11 installed, please uninstall it before proceeding. You can check if you have Java installed and what version it is by running `java --version` in PowerShell.

Download and install it from [adoptopenjdk.net](https://adoptopenjdk.net/?variant=openjdk11&jvmVariant=hotspot)

It is recommended that you enable the "Set JAVA_HOME variable" option in the installer:

![vgy.me](https://i.vgy.me/nitvbc.png)

## Install MongoDB

Download and run the MongoDB Community Server installer from [mongodb.com](https://www.mongodb.com/try/download/community).

The "Complete" installation is recommended. Leave the defaults for everything. It may open MongoDB Compass after installation, you can just close it.

### Adding the MongoDB tools to the PATH

Search for "environment" and open "Edit the system environment variables"

![vgy.me](https://i.vgy.me/DiOWum.png)

Click "Environment Variables..."

![vgy.me](https://i.vgy.me/h4g9za.png)

Select "Path" in the bottom "System variables" pane and click "Edit..."

![vgy.me](https://i.vgy.me/KAY0A7.png)

Make sure nothing is selected, click "Browse..."

![vgy.me](https://i.vgy.me/bV4Mei.png)

Select `C:\Program Files\MongoDB\Server\[version]\bin`, where `[version]` is replaced by the version of Mongo you installed (in my example it is version 4.4), then click "OK"

![image](https://user-images.githubusercontent.com/1300395/104500523-28a79180-55a4-11eb-9959-aa7730d7f289.png)


### Test your MongoDB install

After adding the tools to your path, open a new PowerShell window and run `mongo --version`. It should work without errors as and look similar to the screenshot below.

![mongo --version](https://user-images.githubusercontent.com/1300395/104500249-c8b0eb00-55a3-11eb-8967-9576f4d5591c.png)

## Install NodeJS

Download and run the LTS Windows installer from [nodejs.org](https://nodejs.org/en/download/)

The "Tools for Native Modules" option is optional. It is not necessary for what we are doing but you may want it for future projects that need it.

![vgy.me](https://i.vgy.me/WA5jxL.png)


## Install the Angular CLI

Open PowerShell and run
```powershell
npm install -g @angular/cli
```

Now try running `ng`. You will probably get this error:

![vgy.me](https://i.vgy.me/TOvNic.png)

To fix this run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Now if you run `ng` again you should get something like this:

![vgy.me](https://i.vgy.me/UHJyFS.png)

## Additional Setup

We recommend you disable "Hide extensions for known file types" in "Files Explorer Options" so you can see the extensions of your files in Explorer.

You can just search for "File Explorer Options" and find the option in the "View" tab:

![vgy.me](https://i.vgy.me/jPuXlk.png)
