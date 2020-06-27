import React, {Component} from 'react';
import {Text,View,ScrollView,StyleSheet,Picker,Switch,Button, Modal,Alert} from 'react-native';
import {Card} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';
import * as Calendar from 'expo-calendar';

class Reservation extends Component{

    constructor(props){
        super(props);

        this.state={
            guest:1,
            smoking:false,
            date:'',
            showModal:false
        }
    }

    static navigationOptions = {
        title:'Reserve Table'
    }

    toggleModal(){
        this.setState({showModal:!this.state.showModal});
    }

    async obtainCalendarPermission() {
        try {
            console.log("Getting permissions for calendar");
            let calendarPermission = await Permissions.getAsync(Permissions.CALENDAR);
            if (calendarPermission.status !== 'granted') {
                calendarPermission = await Permissions.askAsync(Permissions.CALENDAR);
                if (calendarPermission.status !== 'granted') {
                    Alert.alert('Permission not granted to access calendars');
                }
            }
            console.log("Calendar permission:" + calendarPermission);
            return calendarPermission;
        } catch (err) {
            console.warn(err);
        }
    }

    //invoked from handleReservation
    async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();

        const calendars = await Calendar.getCalendarsAsync();

        const defaultCalendar = calendars[0];
        console.log("Calendar[0]: ");
        console.log({defaultCalendar});
        console.log("Default calendar id:" + defaultCalendar.id);
        const startDate = new Date(Date.parse(date));
        const endDate = new Date(Date.parse(date) + 2*60*60*1000);
        
        console.log("start date: " + startDate);
        console.log("end date: " + endDate);

        const eventDetail = {
            "title": "Con Fusion Table Reservation",
            "startDate": startDate,
            "endDate": endDate,
            "timeZone": 'Asia/Hong_Kong',
            "location": '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        }

        const eventId = await Calendar.createEventAsync(defaultCalendar.id, eventDetail);

        console.log("event id: " + eventId);
    }

    handleReservation(){
        console.log(JSON.stringify(this.state));
        //this.toggleModal();
        Alert.alert(
            'Your Reservation OK?',
            'Number of Guests: '+this.state.guest+'\nSmoking? '+this.state.smoking+'\nDate and Time: '+this.state.date,
            [
                {
                    text:'Cancel',
                    onPress:()=>this.resetForm(),
                    style:'cancel'
                },
                {
                    text:'OK',
                    onPress:()=>{
                        this.presentLocalNotification(this.state.date);
                        this.addReservationToCalendar(this.state.date);
                        this.resetForm();
                    }
                }
            ],
            {cancelable:false}
            );
        

    }

    resetForm(){
        this.setState({
            guest:1,
            smoking:false,
            date:''
        });
    }

    async obtainNotificationPermission(){
        let permission= await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if(permission.status!=='granted'){
            permission= await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if(permission.status!=='granted')
                Alert.alert('Permission not granted to show notifications');
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    render(){
        return(
            <ScrollView>
                <Animatable.View animation="zoomIn" duration={2000} >
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker style={styles.formItem}
                                selectedValue={this.state.guest}
                                onValueChange={(itemValue,itemIndex)=> this.setState({guest:itemValue})}
                                >
                            <Picker.Item label='1' value='1'/>
                            <Picker.Item label='2' value='2'/>
                            <Picker.Item label='3' value='3'/>
                            <Picker.Item label='4' value='4'/>
                            <Picker.Item label='5' value='5'/>
                            <Picker.Item label='6' value='6'/>
                        </Picker>            
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.smoking}
                            onTintColor='#512DAB'
                            onValueChange={(value)=>this.setState({smoking:value})}
                            >                            
                        </Switch>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>
                        <DatePicker 
                            style={{flex:2 , marginRight:20}}
                            date={this.state.date}
                            format=''
                            mode='datetime'
                            placeholder='Select date and time'
                            minDate='2017-01-01'
                            confirmBtnTest='Confirm'
                            cancelBtnText='Cancel'
                            customStyles={{
                                dateIcon:{
                                    position:'absolute',
                                    left:0,
                                    top:4,
                                    marginLeft:0
                                },
                                dateInput:{
                                    marginLeft:36
                                }
                            }}
                            onDateChange={(date)=>this.setState({date:date})}
                            />
                    </View>
                    <View style={styles.formRow}>
                        <Button
                            title='Reserve'
                            color='#512DAB'
                            onPress={()=>this.handleReservation()}
                            accessibilityLabel='Learn more about this purple button'
                            />
                    </View>
                    {/* <Modal
                        animationType={'slide'}
                        transparent={false}
                        visible={this.state.showModal}
                        onDismiss={()=>{this.toggleModal(); this.resetForm();}}
                        onRequestClose={()=>{this.toggleModal(); this.resetForm();}}
                        >
                        <View style={styles.modal}>
                            <Text style={styles.modalTitle}>Your Reservation</Text>
                            <Text style={styles.modalText}>Number of Guests: {this.state.guest}</Text>
                            <Text style={styles.modalText}>Smoking/Non-Smoking?: {this.state.smoking ? 'Yes':'No'}</Text>
                            <Text style={styles.modalText}>Date and Time: {this.state.date}</Text>
                            <Button onPress={()=>{this.toggleModal(); this.resetForm();}}
                                    color='#512DAB'
                                    title='Close'/>
                        </View>
                    </Modal> */}
                </Animatable.View>
            </ScrollView>
        );
    }
}

const styles=StyleSheet.create({
    formRow:{
        alignItems:'center',
        justifyContent:'center',
        flex:1,
        flexDirection:'row',
        margin:20
    },
    formLabel:{
        fontSize:18,
        flex:2
    },
    formItem:{
        flex:1
    },
    modal:{
        justifyContent:'center',
        margin:20
    },
    modalTitle:{
        fontSize:24,
        fontWeight:'bold',
        backgroundColor:'#512DAB',
        textAlign:'center',
        color:'white',
        marginBottom:20
    },
    modalText:{
        fontSize:18,
        margin:10
    }

})

export default Reservation;