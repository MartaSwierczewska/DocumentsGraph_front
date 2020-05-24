import React from "react";
import {getAllTodos, sendCreatedInvestment} from "../../../utils/APIUtils";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import {Alert, ButtonToolbar, Container} from "react-bootstrap";

const Checkbox = ({type = 'checkbox', name, checked = false, onChange}) => (
    <input style={{float: 'right', marginTop:'6px'}} type={type} name={name} checked={checked} onChange={onChange}/>
);

export default class CreateInvestmentContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nameToShow: '',
            description: '',
            isSuccessfullySaved: false,
            showButton:false,
            fileNamePath: '',
            file: '',
            todos: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.getBase64 = this.getBase64.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
    }

    componentDidMount() {
        getAllTodos()
            .then(response => {
                let todos = response.map((item) =>
                    item = {...item, 'checked': false}
                )
                this.setState({todos: todos});
            })
    }


    handleChange = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    };

    handleSubmit(event) {
        event.preventDefault();
        console.log(this.state)
        sendCreatedInvestment(this.state)
            .then(response => {
                // TODO: tak na chama jest zrobione, zakladajac ze zawsze ten sam token
                if ( localStorage.getItem('token') === 'YWRtaW46YWRtaW4=') {
                    this.setState({isSuccessfullySaved: true});
                }
                this.setState({showButton:true});
            }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ', error.message);
        });
    }

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };

        reader.onloadend = () => cb(reader.result)
        reader.readAsDataURL(file);
    }

     onChangeHandler(event) {
         // this.getBase64(new File([event.target.files[0]], event.target.files[0].name), (a) => {
         //     this.setState({
         //         file: a,
         //     })
         // })
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })
    }

    handleCheckBoxChange(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;
        var newTodos = [...this.state.todos]
        newTodos.map((todo) => {
                if (todo.description === item) {
                    todo.checked = isChecked;
                    return {...newTodos, todo}
                } else {
                    return todo
                }
            }
        )
        this.setState({todos: newTodos})
    }

    mapToList(values) {
        const content = values.map((post) =>
            <div key={post.id}>
                {post.description}
                <Checkbox name={post.description} checked={post.checked} onChange={this.handleCheckBoxChange}/>
            </div>
        );
        return (<div>
            {content}
        </div>)
    }

    render() {
        return (
            <Form style={FormStyle}>
                <Form.Row>
                    <Form.Group controlId="formGridNameToShow">
                        <Form.Label>Name</Form.Label>
                        <Form.Control name={'nameToShow'} placeholder="Enter name to show"
                                      onChange={this.handleChange}/>
                    </Form.Group>
                </Form.Row>
                <Form.Group controlId="formGridDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control name={'description'} placeholder="Enter description"
                                  onChange={this.handleChange}/>
                </Form.Group>
                <h6>Image</h6>
                <input type="file" name="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.onChangeHandler}/>
                <h6 className={"mt-3"}>Todos</h6>
                <div className="flex-container">
                    <div className={"child-container"} style={{width:'90%'}}>
                        {this.mapToList(this.state.todos)}
                    </div>
                </div>

                <ButtonToolbar className="justify-content-between">
                    <ButtonGroup style={ButtonGroupStyle}>
                        <Button style={ButtonStyle} variant={"elegant"} onClick={this.handleSubmit}>
                            Save
                        </Button>
                    </ButtonGroup>
                    {(this.state.isSuccessfullySaved && this.state.showButton) && <ButtonGroup style={ButtonGroupStyle}>
                        <Alert variant={"success"}>
                            Success!
                        </Alert>
                    </ButtonGroup>}
                    {(!this.state.isSuccessfullySaved && this.state.showButton) && <ButtonGroup style={ButtonGroupStyle}>
                        <Alert variant={"danger"}>
                            Authorization required!
                        </Alert>
                    </ButtonGroup>}
                </ButtonToolbar>
            </Form>
        );
    }
}
const FormStyle = {
    margin: "10px"
};

const ButtonGroupStyle = {
    margin: "0"
};

const ButtonStyle = {
    marginLeft: "0"
};