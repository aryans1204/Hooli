import React, { Component } from 'react';
import NavBar from './NavBar';
import classes from './Forex.module.css';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons'

class Forex extends Component {
    constructor(props) {
        super(props);
        this.state = { from: "", to: "" };
    
        this.handleKeyDown = this.handleKeyDown.bind(this);
        
      }

    handleKeyDown(event) {
        console.log('User pressed: ', event.key);
        if (event.key === 'Enter') {
          console.log('Enter key pressed');
          console.log(event.target.value);

        }
        // const target = event.target;
        // this.setState({
        //   [target.name]: target.value,
        // });
    }

    render() {
        return (
            <><NavBar />
            <div className={classes.div}>
                <h1 className={classes.text}>FOREX</h1>
                <div className={classes.search}>
                    <InputGroup>
                    <InputLeftElement
                        pointerEvents='none'
                        children={<SearchIcon color='gray.600' />}
                    />
                    <Input placeholder='Enter Currency Pair' htmlSize={50} width='auto' variant='filled' onKeyDown={this.handleKeyDown}/>
                    </InputGroup>
                </div>
            </div>
            </>
        );
    }
}

export default Forex;