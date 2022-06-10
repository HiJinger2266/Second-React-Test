import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


/*

class Square extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }   //super是物件的老爸，state是本身狀態，而props是可以往下丟的

 //接下來個人資訊轉由老爸代理接收，所以本身的state不用了，用老爸的props

  render() {
    return (
      <button
        className="square"
        onClick={() =>
          this.props.onClick()
        }
      >
        {this.props.value}
      </button>
    );
  }   
}
*/
//把this.state.value換成this.props.value，可以接收老爸的訊息
// onClick={function() {console.log('click');}}>
// 可以簡寫
// onClick={() => console.log('click')}>
// 不能在function()裏頭做this的指令，因為此時的this已經不是button而是function

// Finally我們要讓Board藉由傳遞props的方式告訴每一個Square該顯示什麼值
//需要在它們的 parent component 裡宣告一個共享的state


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
//Square降級為功能，物件也不需要this了，因為不是component

class Board extends React.Component {
  /*
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,      //這是boolean變數，預設true
    };
  }   //建造一個正方形陣列，起初填入null值，這是控制整坨正方形的地方
  */
 
  /*
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    //「||」是或or的意思，只要其中一個達成，遊戲不再進行
    //只要該格子已經填過，就不能再填。遊戲分出勝負，也不能再填
    squares[i] = this.state.xIsNext ? 'X' : 'O';    //這是輪流的意思
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }  
  */
  //透過兒子Square被點擊，叫老爸出來，使出handleClick這個功能
  //squares: squares，前面代表性值，後面代表變數，以陣列呈現
  //隨時改變這坨正方形的狀態state，也順便往下透過props丟個別狀態給兒子正方形
  //Board掌控了所有兒子Square
  //.slice()的意思是複製該項資料，透過更改副本內容，之後再回頭取代原資料
  //.slice()不同於以往傳統改變變數的方式，這可以達到歷史保存與回顧的可行性
  
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
    );
  }
  //renderSquare是一個功能，目標是要產生可變狀態的兒子Square們
  //後續每一個Square的狀態各自獨立，但Board要知道這一切，所以還是從此出發

  render() {
    /*
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }   //通知誰是贏家
    */
    return (
      <div>
        <div className="status">{/*status*/}</div>
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

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}   //這是告訴電腦，如何讓遊戲分出勝負

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    //每一個列表中的項目加入一個 key 的屬性，以確保 React 能清楚分辨每一個項目

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    //再次搬家遊戲規則到最上層
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
  //掌控Square的地方搬到這裡，constructor作為代表功能
  //history state放在Game component裡，每一場動作都是一個child Board component


  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    //「||」是或or的意思，只要其中一個達成，遊戲不再進行
    //只要該格子已經填過，就不能再填。遊戲分出勝負，也不能再填
    squares[i] = this.state.xIsNext ? 'X' : 'O';    //這是輪流的意思
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }  //concat是合併的概念，並不是完全改寫

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
}
// 在 JavaScript 中，array 有一個 map() 方法常被用來對比並轉變資料
// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
  