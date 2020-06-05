import React,{Component} from 'react';
import Menu from './MenuComponent';
import DishDetail from './DishdetailComponent';
import {View,Platform} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

class Main extends Component{

    render(){
        return(
            <View style={{flex:1, paddingTop: Platform.OS==='ios'? 0 : Expo.Constants.statusBarHeight}}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Menu" 
                    screenOptions={{
                        headerStyle:{
                            backgroundColor:'#512DAB'
                        },
                        headerTintColor:'#fff',
                        headerTitleStyle:{
                            color:'#fff'
                        }
                    }}>
                        <Stack.Screen name="Menu" component={Menu}  options={{ title: 'Menu' }}/>
                        <Stack.Screen name="Dishdetail" component={DishDetail} options={{ title: 'Dish Details' }}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
            
        );
    }
}

export default Main;

