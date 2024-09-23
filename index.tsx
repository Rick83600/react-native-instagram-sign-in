import React from 'react';

import { Modal, ModalProps, StyleSheet, View } from 'react-native';
import WebView, { WebViewProps, WebViewNavigation } from 'react-native-webview';

import axios from 'axios';

const headers = {
  'Content-Type': 'multipart/form-data',
};

export type InstagramModalProps = {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  responseType: string;
  scopes: string[];
  open: boolean;
  startInLoadingState?: boolean;
  modalProps?: ModalProps;
  language?: string;
  containerStyle?: { [k: string]: string };
  wrapperStyle?: { [k: string]: string };
  webviewStyle?: { [k: string]: string };
  onLoginSuccess: (token: string, obj?: any) => void;
  onLoginFailure: (obj?: any) => void;
  onClose?: () => void;
} & WebViewProps;

export const InstagramModal = (props: InstagramModalProps) => {
  const {
    clientId,
    clientSecret,
    redirectUrl,
    responseType,
    scopes,
    open,
    startInLoadingState = true,
    language = 'en',
    modalProps = {
      animationType: 'slide',
      transparent: true,
    },
    containerStyle,
    wrapperStyle,
    webviewStyle,
    onLoginSuccess,
    onLoginFailure,
    onClose,
  } = props;

  const uri = `${
    process.env.EXPO_PUBLIC_API_BASE
  }/oauth/authorize/?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=${responseType}&scope=${scopes.join(
    ','
  )}`;

  const onNavigationStateChange = async (webViewState: WebViewNavigation) => {
    const { url, loading } = webViewState;

    if (!url || !url.startsWith(redirectUrl) || loading) return;

    const uri = new URL(url);

    const access_token = uri.searchParams.get('access_token');

    const code = uri.searchParams.get('code');

    if (access_token) return onLoginSuccess(access_token);

    if (!code) return onLoginFailure(new Error('REQUEST ERROR'));

    const codeSplitted = code.split('#_').join('');

    const http = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_BASE,
      headers,
      withCredentials: false,
    });

    const form = new FormData();

    form.append('client_id', clientId);
    form.append('client_secret', clientSecret);
    form.append('grant_type', 'authorization_code');
    form.append('redirect_uri', redirectUrl);
    form.append('code', codeSplitted);

    try {
      const res = await http.post('/oauth/access_token', form);

      return res?.data?.access_token
        ? onLoginSuccess(res.data.access_token)
        : onLoginFailure(new Error('REQUEST ERROR'));
    } catch (err) {
      onLoginFailure(err);
    }
  };

  return (
    <Modal {...modalProps} visible={open} onRequestClose={onClose}>
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.wrapper, wrapperStyle]}>
          <WebView
            {...props}
            style={[styles.webView, webviewStyle]}
            startInLoadingState={startInLoadingState}
            source={{
              uri,
              headers: {
                'Accept-Language': language,
              },
            }}
            onNavigationStateChange={onNavigationStateChange}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 40,
    paddingHorizontal: 10,
  },
  wrapper: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  webView: {
    flex: 1,
  },
});
