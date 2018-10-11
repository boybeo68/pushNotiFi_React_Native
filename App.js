import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Dimensions, StatusBar} from 'react-native';
import {Permissions, Notifications} from 'expo';

const {width,height}=Dimensions.get('window');
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            title: '',
            body: '',
            notifi: null,
        };
    }

    componentDidMount() {
        this.registerForPushNotifications();
        this.sendNotifiSchedule();
    }


    async registerForPushNotifications() {
        const {status} = await Permissions.getAsync(Permissions.NOTIFICATIONS);

        if (status !== 'granted') {
            const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            if (status !== 'granted') {
                return;
            }
        }

        const token = await Notifications.getExpoPushTokenAsync();
        console.log(token);

        this.subscription = Notifications.addListener(this.handleNotification);

        this.setState({
            token,
        });
    };
    handleNotification = notifi => {
        console.log(notifi);
        this.setState({
            notifi
        });
    };

    senNotifi = (token = this.state.token, title = this.state.title, body = this.state.body) => {
        return fetch('https://exp.host/--/api/v2/push/send',{
            body: JSON.stringify({
                to:token,
                title:title,
                body:body,
                data: {name : "Tùng béo đã gửi thành công"}
            }),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method :'POST'
        })
    };
    sendNotiLocal = () =>{
        Expo.Notifications.presentLocalNotificationAsync({
            title:'dữ liệu local title',
            body:'dữ liệu local body',
            data: {name : "Tùng béo đã gửi thành công từ local"}
        })
    };
    sendNotifiSchedule = () => {
        Notifications.scheduleLocalNotificationAsync({
            title:'Thông báo ăn cơm',
            body:'Đến giờ ăn cơm trưa rồi anh ơi',
            data: {name : "Tùng béo đã gửi thành công từ local"}
        },{time:(new Date()).getTime() + (1000*60*37), repeat:'day' }).then(data=>{
            console.log(data)
        })
    };

    render() {
        return (
            <KeyboardAvoidingView behavior="position" style={styles.container}>
                <StatusBar barStyle='dark-content'/>
                <TextInput style={styles.textInput} placeholder='input title' value={this.state.title} onChangeText={title => {
                    this.setState({title})
                }}/>
                <TextInput style={styles.textInput} placeholder='input body' value={this.state.body} onChangeText={body => {
                    this.setState({body})
                }}/>
                <TouchableOpacity onPress={() => {
                    this.sendNotiLocal()
                }}>
                    <View style={styles.buttonStyle}>
                        <Text style={{color:'#fff'}}>Send Notif</Text>
                    </View>
                </TouchableOpacity>
                { this.state.notifi ? (
                    <View>
                        <Text style={{padding:10, fontSize:17}}>Last Notification:</Text>
                        <Text>{this.state.notifi.data.name}</Text>
                        <Text>{this.state.notifi.body}</Text>
                        <Text>{this.state.notifi.title}</Text>
                    </View>
                ): null}
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop:100,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems:'center',
    },
    textInput:{
        padding:10,
        margin: 10,
        width:width-80,

    },
    buttonStyle:{
        margin:10,
        padding:10,
        borderRadius:20,
        backgroundColor: '#ff8295',
        alignItems: 'center'

    }
});
