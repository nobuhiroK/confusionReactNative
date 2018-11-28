import { Card, Icon, Rating, Input } from 'react-native-elements';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder } from 'react-native';
import React, { Component } from 'react';
//import { DISHES } from '../shared/dishes';
//import { COMMENTS } from '../shared/comments';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';





const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }
  const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment ) => dispatch(postComment(dishId, rating, author, comment))
})



function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Text style={{fontSize: 12}}>{item.rating} Stars</Text>
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>

            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
            <Card title='Comments' >
            <FlatList 
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

function RenderDish(props) {

    

    const dish = props.dish;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    }
    handleViewRef = ref => this.view = ref;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {this.view.rubberBand(1000)
            .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );

            return true;
        }
    })

    
        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000} 
                ref={this.handleViewRef}
                {...panResponder.panHandlers}>
                    <Card
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image}}>
                        <Text style={{margin: 10}}>
                            {dish.description}
                        </Text>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                            <Icon
                            raised
                            reverse
                            name={ props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                            style={{flex: 1}}
                            />
                            <Icon
                            raised
                            reverse
                            name={ 'pencil'}
                            type='font-awesome'
                            color= '#512DA8'
                            onPress={ () => props.toggleModal() }
                            style={{flex: 1}}
                            />
                        </View>
                    </Card>
                </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}
class Dishdetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rating: '',
            author: '',
            comment: '',
            showModal: false
        }

        this.toggleModal = this.toggleModal.bind(this);
        this.ratingComplete = this.ratingComplete.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.resetComment = this.resetComment.bind(this);
    }
    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }
    
    // handleComment(dishId, rating, author, comment) {
    //     //console.log(dishId, rating, author, comment)
    //     this.props.postComment(dishId, rating, author, comment );
    //     this.toggleModal();
    // }
    handleComment(dishId) {
        console.log(JSON.stringify(this.state));
        
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
        this.toggleModal();
        
        

    }
    resetComment() {
        this.setState({
            rating: '',
            author: '',
            comment: '',
            showModal: false
        });
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }
    ratingComplete(rating) {
        console.log("Rating is: " + this.state.rating)
        this.setState({rating: rating}) 


    }



    static navigationOptions = {
        title: 'Dish Dtails'
    };


    render() {
        const dishId = this.props.navigation.getParam('dishId','');
       
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} 
                    toggleModal={ () => this.toggleModal()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                    <View>
                        <Rating
                                showRating
                                type="star"
                                fractions={0}
                                startingValue={0}
                                imageSize={40}
                                style={{ paddingVertical: 10 }}
                                onFinishRating={ this.ratingComplete }
                                    />

                        <View style={{margin:10}}>
                        
                            <Input
                                placeholder="Author"
                                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                                onChangeText={ (author) => this.setState({ author : author })}
                                //value={this.state.author}
                                
                            />
                        </View>
                        <View style={{margin:10}}>
                            <Input 
                                placeholder="Comment"
                                leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                                //value={this.state.comment}
                                onChangeText={ (comment) => this.setState({ comment : comment })}
                            />
                        </View>
                        
                        {/*    <Text>
                            Updated rating: {this.state.rating}
                        </Text>
                        <Text>
                            Updated author: {this.state.author}
                        </Text>
                        <Text>
                           Updated comment: {this.state.comment}
                        </Text>*/}
                         <View style={{margin:10}}>   
                            <Button

                                onPress={ () => this.handleComment(dishId, this.state.rating, this.state.author, this.state.comment )}
                                title="Submit"
                                color="#512DA8"
                                accessibilityLabel="Add your comment"

                            />
                        </View>
                        <View style={{margin:10}}>
                            <Button
                                onPress= {() => this.resetComment()}
                                title="Dismiss"
                                color="#888"
                                accessibilityLabel="Dismiss modal"
                                
                            />
                        </View>
                        
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);

                       