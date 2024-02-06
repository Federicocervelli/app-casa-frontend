import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Button, Icon } from "@rneui/themed";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../hooks/warmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId && setActive) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    } finally {
      // wait for 3 sec
      setTimeout(() => setIsLoading(false), 5000);
    }
  }, []);

  return <Button onPress={onPress} loading={isLoading}>
    Sign in with Google
    <Icon name="google" type="font-awesome" color={"white"} style={{marginLeft: 10}} />
  </Button>;
};
export default SignInWithOAuth;
