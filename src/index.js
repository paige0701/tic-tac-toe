import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// function component 는 그냥 render method 만 있고 자기 state를 관리 하지 않는 것을 말한다.
// 상위 컴포넌트에서 스테이트를 관리 하기 때문에 square에서는 그냥 값만 보여주는 역할을 하는것 같다.
// 파라미터로 props를 받아 올 수 있다1
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        console.info('[a,b,c] ==> ', [a,b,c]);
        console.info('squares[a] ==> ', squares[a]);
        // TODO : is this the only way ?
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={()=>this.props.onClick(i)}/>
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>


        );
    }
}

// 게임이 모든 클라스를 갖고 있다.
class Game extends React.Component {

    constructor(props) {
        // 생성자를 갖고 있는 React 클라스 꼭 super(props); 를 먼저 선언한다
        super(props);

        // 컴포넌트가 무언가 기억해야 할 때 this.state 를 사용한다.
        // 생성자 안에 넣어서 state 를 초기화 한다.
        this.state = {
            history : [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber : 0,
        }
    }


    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X': 'O';
        this.setState({
            history: history.concat([{squares: squares}]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(i) {
        this.setState( {
            stepNumber: i,
            xIsNext: (i % 2) === 0
        })

    }

    getClassName(i) {
        return this.state.stepNumber === i ? 'bold':'';
    }



    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move? 'Go to move #' + move : 'Go to game start';
            return (
                <li>
                    <button onClick={() => this.jumpTo(move)}>
                        <span className={this.getClassName(move)}>{desc}</span>
                    </button>
                </li>
            )
        });

        let status;
        if (winner) {
            status = 'Winner: '+ winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        // Parent component 에서 children 의 state 를 관리 하는것이 좋다고 tutorial 에는 써있다.
        // Parent 컴포넌트에서 child 컴포넌트로 값을 넘길때는 props 를 사용한다.
        // 아래 <Board 태그 안에 선언 되어 있는 squares 와 onClick 이 있는데
        // child 컴포넌트에서 this.props.squares 나 this.props.onClick 으로 값을 받아올 수 있다,
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{ status }</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
