import React from 'react';
import axios from 'axios';
import MatrixTable from './MatrixTable'
import { Form, Button, Modal } from 'react-bootstrap'; 
//import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = "https://nussinov-backend.herokuapp.com"

class App extends React.Component {
  constructor(props) {
    super(props); 

    this.state = {
      sequence: "",
      displayTable: false,
      showInvalidText: false, 
      data: [],
      dotParentheses: "", 
      path: []  
    }

    this.handleSubmit = this.handleSubmit.bind(this); 
    this.getSequence = this.getSequence.bind(this);
  }

  handleTextChange = e => {
    this.setState({ sequence: e.target.value }); 
  }

  validateSequence = () => {
    if (this.state.sequence.length == 0) return false; 
    let validLetters = ['A', 'U', 'G', 'C', 'a', 'u', 'g', 'c'];
    let letters = this.state.sequence.split(""); 
    for (let i = 0; i < letters.length; i++) {
      if (!validLetters.includes(letters[i])) {
        return false; 
      }
    }
    return true; 
  }

  handleModalClose = () => {
    this.setState({ showInvalidText: false})
  }

  async handleSubmit() {
    if (this.validateSequence()) {
      await this.getSequence(this.state.sequence)
    } else {
      this.setState({ showInvalidText: true }); 
    }
  }

  async getSequence(sequence){
    await axios.get(`${API_URL}?seq=${sequence}`).then(response => {
      this.setState({
        data: response.data.matrix,
        dotParentheses: response.data.dotparantheses, 
        path: response.data.path,
        displayTable: true 
      })
    }).catch(error => console.log(error));
  }

  render() {
    return (
      <>
        <h1 style={{ "margin-top": "2%", "text-align": "center" }} className="header">Nussinov Visualization</h1>
        <div style={{ "margin-left": "5%", "margin-top": "2%"}}>
        <p>This is a visualization tool to understand Nussinov's algorithm.<br></br>
        Given an RNA sequence, the algorithm will display the maximum number of pairs.<br></br>
        Enter a RNA sequence below to get started.</p>
        </div>
      <Form style={{ "margin-left": "5%", "width": "50%"}}>
        <Form.Group controlId="sequence">
          <Form.Label>Sequence</Form.Label>
          <Form.Control type="email" placeholder="ACUGCAU" onChange={this.handleTextChange}/>
          <Form.Text className="text-muted">
            Please make sure your sequence only contains A, C, G, and Us. 
          </Form.Text>
        </Form.Group>
        <Button variant="primary" onClick={this.handleSubmit}>
          Submit
        </Button>
      </Form>
      <br></br>
      {this.state.displayTable && 
        <MatrixTable sequence={this.state.sequence} data={this.state.data} dotParentheses={this.state.dotParentheses} path={this.state.path} >
        </MatrixTable>}
      {this.state.showInvalidText && 
       <Modal show={this.state.showInvalidText} onHide={this.handleModalClose}>
       <Modal.Header closeButton>
         <Modal.Title>Invalid Input</Modal.Title>
       </Modal.Header>
       <Modal.Body>You can only use the letters A, U, G or C.</Modal.Body>
       <Modal.Footer>
         <Button variant="secondary" onClick={this.handleModalClose}>
           Got it
         </Button>
       </Modal.Footer>
     </Modal>}        
      </>
    );
  }
}

export default App;
