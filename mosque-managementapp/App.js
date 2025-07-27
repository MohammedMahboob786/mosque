// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SelectUserType from './screens/SelectUserType';
import RegisterMosque from './screens/RegisterMosque';
import RegistrationSuccess from './screens/RegistrationSuccess';
import MosqueLogin from './screens/MosqueLogin';
import UpdateTimings from './screens/UpdateTimings';
import SubscriberView from './screens/SubscriberView';
import SubscriberMosqueList from './screens/SubscriberMosqueList';
import SelectPreferredMosque from './screens/SelectPreferredMosque';
import PreferredMosqueSelector from './screens/PreferredMosqueSelector';
import NotFoundScreen from './screens/NotFoundScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SelectUserType" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SelectUserType" component={SelectUserType} options={{ headerShown: false }} />
        <Stack.Screen name="MosqueLogin" component={MosqueLogin} />
        <Stack.Screen name="RegisterMosque" component={RegisterMosque} />
        <Stack.Screen name="RegistrationSuccess" component={RegistrationSuccess} />
        <Stack.Screen name="UpdateTimings" component={UpdateTimings} />
        <Stack.Screen name="SubscriberView" component={SubscriberView} />
        <Stack.Screen name="SubscriberMosqueList" component={SubscriberMosqueList} />
        <Stack.Screen name="SelectPreferredMosque" component={SelectPreferredMosque} />
        <Stack.Screen name="PreferredMosqueSelector" component={PreferredMosqueSelector} />
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
