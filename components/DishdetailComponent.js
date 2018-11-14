import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import React, { Component } from 'react';
import { DISHES } from '../shared/dishes';
import { StackNavigator } from 'react-navigation';

function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Card
                featuredTitle={dish.mame}
                image={require('./images/uthappizza.png')}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                </Card>
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
            dishes: DISHES
        };
    }

    static navigationOptions = {
        title: 'Dishdetails'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <RenderDish dish={this.state.dishes[+dishId]} />
        );
    }
}

export default Dishdetail;