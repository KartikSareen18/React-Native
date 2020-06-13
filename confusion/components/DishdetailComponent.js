import React, { Component } from 'react';
import {View,Text,ScrollView,FlatList,Modal,Button,StyleSheet} from 'react-native';
import {Card,Icon} from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import {postFavorite,postComment} from '../redux/ActionCreator';
import { Rating,Input} from 'react-native-elements';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites:state.favorites
    }
  }

const mapDispatchToProps = dispatch =>({
    postFavorite:(dishId)=>dispatch(postFavorite(dishId)),
    postComment:(dishId,rating,author,comment)=>dispatch(postComment(dishId,rating,author,comment))
})

function RenderDish(props){
    const dish=props.dish;
    if(dish!=null){
        return(
            <Card 
                featuredTitle={dish.name} 
                image={{uri:baseUrl+dish.image}}>
                <Text style={{margin:10}}>
                    {dish.description}
                </Text>
                <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',margin:20}}> 
                    <Icon 
                        raised
                        reverse
                        name={props.favorite ? 'heart':'heart-o'}
                        type='font-awesome'
                        color="#f50" onPress={() => props.favorite ? console.log('Already Favorite') : props.onPress()}/>
                    <Icon
                        raised
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color="#512DAB"
                        onPress={()=> props.toggleModal()}
                        />
                </View>
            </Card>
        );
    }
    else{
        return (
            <View></View>
        );
    }
}

function RenderComments(props){
    const comments=props.comments;
    const renderCommentItem = ({item,index})=>{
        return (
            <View key={index} style={{margin:10}}>
                <Text style={{fontSize:14}}>{item.comment}</Text>
                <Rating imageSize={15} readonly startingValue={item.rating} style={{ paddingVertical: 10,flexDirection:'row'}} />
                <Text style={{fontSize:12}}>{'-- ' + item.author + ' , ' + item.date}</Text>
            </View>
        );
    }

    return(
        <Card title="Comments">
            <FlatList data={comments}
                renderItem={renderCommentItem}
                keyExtractor={(item)=>item.id.toString()}/>
        </Card>
    );
}

class DishDetail extends Component{

    constructor(props){
        super(props);
        this.state={
            author:'',
            rating:1,
            comment:'',
            showModal:false
        }
    }

    toggleModal=()=>{
        this.setState({showModal:!this.state.showModal});
    }

    resetForm(){
        this.setState({
            author:'',
            rating:1,
            comment:''
        });
    }

    handleComment=(dishId)=>{
        console.log(JSON.stringify(this.state));
        this.toggleModal();
        console.log(dishId);
        this.props.postComment(dishId,this.state.rating,this.state.author,this.state.comment);
    }

    markFavorite=(dishId)=>{
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render(){
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]} 
                            favorite={this.props.favorites.some(elem => elem === dishId )}
                            onPress={()=>this.markFavorite(dishId)}
                            toggleModal={this.toggleModal}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment)=> comment.dishId===dishId)}/>
                <Modal 
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={()=>{this.toggleModal(); this.resetForm();}}
                    onRequestClose={()=>{this.toggleModal(); this.resetForm();}}>
                    <View style={styles.modal}>
                        
                        <Rating showRating
                            onFinishRating={(rating)=>this.setState({rating:rating})}
                            style={{ paddingVertical: 10 }}/>
                    
                        <Input
                            placeholder='  Author'
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            onChangeText={value => this.setState({ author: value })}
                            />    
                        
                        <Input
                            placeholder='  Comment'
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            onChangeText={value => this.setState({ comment: value })}
                            />    
                        
                        <View style={styles.formRow}>
                            <Button onPress={()=>this.handleComment(dishId)}
                                color='#512DAB'
                                title='SUBMIT'/>
                        </View>

                        <View style={styles.formRow}>
                            <Button onPress={()=>{this.toggleModal(); this.resetForm();}}
                                color='#808080'
                                title='CANCEL'/>
                        </View>
                    </View>
                </Modal>
            
            </ScrollView>
            
        )
    }
}

const styles=StyleSheet.create({
    formRow:{
        alignItems:'center',
        justifyContent:'center',
        flex:1,
        flexDirection:'row',
        margin:32
    },
    modal:{
        justifyContent:'center',
        margin:20
    }

})

export default connect(mapStateToProps,mapDispatchToProps)(DishDetail);
