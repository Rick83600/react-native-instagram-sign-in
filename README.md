# React Native Instagram Sign in modal

[![npm version](https://img.shields.io/npm/v/react-native-instagram-login.svg?style=flat)](https://www.npmjs.com/package/react-native-instagram-login)
[![npm downloads](https://img.shields.io/npm/dm/react-native-instagram-login.svg?style=flat-square)](https://www.npmjs.com/package/react-native-instagram-login)

## Install

```js
npm install react-native-instagram-sign-in react-native-webview --save
```

Then link the native iOS package:

```js
cd ios && npx pod-install && cd ..
```

## Usage:

#### For function component:

```javascript
import { useState, useEffect } from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

import { View } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { InstagramModal } from 'react-native-instagram-sign-in';

const APP_ID = '******';
const APP_SECRET = '******';

export default function Index() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = (useState < string) | (null > null);

  useEffect(() => {
    AsyncStorage.getItem('access_token').then(token => {
      setToken(token);
      if (!token) setOpen(true);
    });
  }, []);

  const handleOnLoginSuccess = (token: string) => {
    setToken(token);
    AsyncStorage.setItem('access_token', token).then(() => setOpen(false));
  };

  const handleOnLoginFailure = (err: any) => {
    setOpen(false);
  };

  return (
    <View style={styles.root}>
      <Pressable onPress={() => setOpen(true)}>
        <Text>Login</Text>
        <Text>{token}</Text>
      </Pressable>

      <InstagramModal
        open={open}
        clientId={APP_ID}
        clientSecret={APP_SECRET}
        scopes={['user_profile', 'user_media']}
        responseType="code"
        redirectUrl="your_redirect_url"
        onLoginSuccess={handleOnLoginSuccess}
        onLoginFailure={handleOnLoginFailure}
        onClose={() => setOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Constants.statusBarHeight,
  },
});
```

## Props

| Property       | Type              | Description                                               |
| -------------- | ----------------- | --------------------------------------------------------- |
| clientId       | PropTypes.string  | Instagram client_id                                       |
| clientSecret   | PropTypes.string  | Instagram client_secret                                   |
| responseType   | PropTypes.string  | 'code' or 'token', default 'code'                         |
| scopes         | PropTypes.array   | Login Permissions, default ['user_profile', 'user_media'] |
| redirectUrl    | PropTypes.string  | Your redirectUrl                                          |
| incognito      | PropTypes.boolean | Incognito true/false                                      |
| onLoginSuccess | PropTypes.func    | Function will be call back on success                     |
| onLoginFailure | PropTypes.func    | Function will be call back on error                       |
| onClose        | PropTypes.func    | Function will be call back on close modal                 |
| open           | PropTypes.bool    | true or false                                             |
| containerStyle | PropTypes.object  | Customize container style                                 |
| wrapperStyle   | PropTypes.object  | Customize wrapper style                                   |
| webviewStyle   | PropTypes.object  | Customize close style                                     |
| language       | PropTypes.string  | Override language of modal,alpha-2 eg:"es","tr" etc.      |
| modalProps     | PropTypes.object  | Props for react native modal                              |

## Logout

To logout use clear cookies by using https://github.com/react-native-community/cookies

```js
import CookieManager from '@react-native-community/cookies';

  logout() {
    CookieManager.clearAll(true)
      .then((res) => {
        this.setState({ token: '' })
      });
  }
```

## Pull request

Pull requests are welcome!
