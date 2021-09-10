# fast-admin-vue

> A minimal vue admin template with Element UI & axios & iconfont & permission control & lint


**The current version is `v4.0+` build on `vue-cli`.**

## Build Setup

```bash
# clone the project
git clone https://github.com/Seeeeck/fast-admin-vue.git

# enter the project directory
cd fast-admin-vue

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```

Refer to [Documentation](https://panjiachen.github.io/vue-element-admin-site/guide/essentials/deploy.html) for more information

## Demo
### Overview
![overview](https://github.com/Seeeeck/fast-admin-vue/blob/master/demo-img/overview.gif)
### Login
![login](https://github.com/Seeeeck/fast-admin-vue/blob/master/demo-img/login.gif)
### Details
Using **Role-Based Access Control** to manage the system.
![user](https://github.com/Seeeeck/fast-admin-vue/blob/master/demo-img/user.gif)
![role](https://github.com/Seeeeck/fast-admin-vue/blob/master/demo-img/role.gif)
![menu](https://github.com/Seeeeck/fast-admin-vue/blob/master/demo-img/menu.gif)
![profile](https://github.com/Seeeeck/fast-admin-vue/blob/master/demo-img/profile.gif)
## Dynamic routing
Dynamically display menus through roles.
![admin1](https://github.com/Seeeeck/fast-admin-vue/blob/master/demo-img/admin1.png)
![admin11](https://github.com/Seeeeck/fast-admin-vue/blob/master/demo-img/admin11.png)
## Browsers support

Modern browsers and Internet Explorer 10+.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions
