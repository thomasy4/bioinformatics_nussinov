import React from 'react'
import Table from 'react-bootstrap/Table'; 

class MatrixTable extends React.Component {
    constructor(props) {
        super(props);
    }

    coordInPath = (x, y, path) => {
      for (let i = 0; i < path.length; i++) {
        let arr = path[i];
        if (arr[0] == x && arr[1] == y) {
          return true; 
        }
      }
      return false; 
    }
    
    render() {
      const { data, sequence, dotParentheses, path } = this.props; 
      return (
        <Table style = {{ "margin-top": "2%", "margin-left": "5%", "width": "80%" }} responsive bordered>
           <thead  style = {{ "background-color":"gray"}}> 
             <tr>
          {sequence.split('').map(letter => {
            return (<th>{letter}</th>)
          })}
          </tr>
          <tr>
          {dotParentheses.split('').map(paren => {
            return (<th>{paren}</th>)
          })}
          </tr>
          </thead >
          <tbody>
          {data.map((array, i) => {
            return (
              <tr>
                {array.map(((elem, j) => {
                  if (elem == 0) {
                    return (<th style = {{ "background-color":"#bcc0d4"}}>{elem}
                      </th>)
                  } else if (this.coordInPath(i, j, path)) {
                    return (<th style = {{"background-color":"yellow"}} >{elem}
                      </th>)
                  } else {
                    return (<th  >{elem}
                      </th>)
                  }
                }))}
              </tr>
            )
          })}
          </tbody>
        </Table>
      )
    }
}

export default MatrixTable
