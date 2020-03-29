import React from "react";
import {CardDeck} from "react-bootstrap";
import {getAllHouses, getImage} from "../../utils/APIUtils";
import ItemCardAdmin from "../admin/ItemCardAdmin";

export default class SectionTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            investments: []
        }
    }

    componentDidMount() {
        getAllHouses()
            .then((result) => {
                let i = 0;
                let cards = result.map((item) =>
                    <ItemCardAdmin key={i++} id={item.id} title={item.nameToShow} name={item.name}
                                   description={item.description}
                                   image={getImage(item.name)} buttonTextEdit={"Edit"} buttonTextDelete={"Delete"}/>
                );
                this.setState({investments: cards});
            });
    }

    render() {
        return (
            <CardDeck>
                {this.state.investments}
            </CardDeck>
        )
    }
}