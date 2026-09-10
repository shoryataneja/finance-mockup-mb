import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './screens/LoginScreen';
import OTPScreen from './screens/OTPScreen';
import HomeScreen from './screens/HomeScreen';
import NewEnquiryScreen from './screens/NewEnquiryScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import EnquiryStep1Screen from './screens/EnquiryStep1Screen';
import EnquiryStep2Screen from './screens/EnquiryStep2Screen';
import EnquiryStep3Screen from './screens/EnquiryStep3Screen';
import RecommendBanksScreen from './screens/RecommendBanksScreen';
import SubmissionConfirmScreen from './screens/SubmissionConfirmScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1a3a6b',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e8e8e8',
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home-outline',
            'New Enquiry': 'add-circle-outline',
            History: 'time-outline',
            Profile: 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size - 2} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="New Enquiry" component={NewEnquiryScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="EnquiryStep1"
          component={EnquiryStep1Screen}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="EnquiryStep2"
          component={EnquiryStep2Screen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="EnquiryStep3"
          component={EnquiryStep3Screen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="RecommendBanks"
          component={RecommendBanksScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="SubmissionConfirm"
          component={SubmissionConfirmScreen}
          options={{ animation: 'fade' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
