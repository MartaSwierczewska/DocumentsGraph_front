import React from 'react';
import CardDeck from "react-bootstrap/CardDeck";
import ItemCard from "./ItemCard";
import {getAllHouses, getImage} from "../utils/APIUtils";
import Background from "../assets/background.jpg";
import GoogleMap from "./GoogleMap";

export default class House extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
        };
    }

    componentDidMount() {
        getAllHouses()
            .then((result) => {
                let i = 0;
                let cards = result.map((item) =>
                    <ItemCard key={i++} title={item.nameToShow} name={item.name} text={item.description}
                              image={getImage(item.name)} url="item.name" buttonText={"See investment"}/>
                );
                this.setState({cards: cards});
            });

    }

    render() {
        return (
            <div className={"background"} style={{backgroundImage: `url(${Background})`}}>
                {/*<div style={{width: "65%", float: "right"}}>*/}
                    <CardDeck style={{paddingBottom:'50px'}}>
                        {this.state.cards}
                    </CardDeck>
                <GoogleMap/>
                {/*</div>*/}
            </div>
        )
    }
}