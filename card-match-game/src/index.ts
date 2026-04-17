// Imports your SCSS stylesheet
import "./styles/index.scss";

// global variables!

let attempts: number = 3;
let foundMatches: number = 0;
let selectedCard: HTMLElement[] = [];
// this variable is to help with animations later
let isLocked: boolean = false;

const attemptCounterRight = document.querySelector("#attemptsCounterRight") as HTMLElement;
const attemptCounterLeft = document.querySelector("#attemptsCounterLeft") as HTMLElement;

const cardBg: string = "../imgs/card-flip-card-image.png";

const renderGameScreen = (deck: number[]): void => {
  //   console.log(cardBg);
  const cardList = document.querySelector("#cards");

  if (!cardList) {
    return;
  }

  attemptCounterRight.innerHTML = `Attempts left: ${attempts}`;
  attemptCounterLeft.innerHTML = `Use the ${attempts} attempts you have left to get the matching pairs of cards!`;

  cardList.innerHTML = ``;

  deck.forEach((card) => {
    const cardElement = document.createElement("li");

    cardElement.classList.add("cardSlot");

    cardElement.dataset.card = card.toString();

    cardElement.innerHTML = `
    <div class="innerCard">
            <div class="outerCard" style="background-image: url('${cardBg}')" >
        </div>
            <div class="cardFront">
                ${card}
            </div>
        </div>`;

    cardList.appendChild(cardElement);

    cardElement.addEventListener("click", (e) => {
      cardClickHandler(cardElement);
      //   console.log("test");
    });
  });
};

const cardClickHandler = (clickedCard: HTMLElement): void => {
  if (isLocked || clickedCard.classList.contains("flipped") || selectedCard.length >= 2) return;

  clickedCard.classList.add("flipped");
  selectedCard.push(clickedCard);

  //   console.log(clickedCard.dataset.card);

  if (selectedCard.length === 2) {
    isLocked = true;

    const [cardA, cardB] = selectedCard;
    const valueA = cardA.dataset.card;
    const valueB = cardB.dataset.card;

    if (valueA === valueB) {
      foundMatches++;
      selectedCard = [];
      isLocked = false;

      if (foundMatches === 3) {
        setTimeout(() => {
          //   alert("Congratulations! You won!");
          const resultsScreen = document.querySelector("#resultsScreen") as HTMLElement;

          const resultsScreenTitle = document.querySelector("#resultTitle") as HTMLElement;

          resultsScreenTitle.innerHTML = `You won! Congratulations!`;

          resultsScreen.className = "expanded";

          //   startGame();
        }, 1000);
      }
    } else {
      attempts--;

      attemptCounterRight.innerHTML = `Attempts left: ${attempts}`;
      attemptCounterLeft.innerHTML = `Use the ${attempts} attempts you have left to get the matching pairs of cards!`;
      // updateAttempts();

      setTimeout(() => {
        cardA.classList.remove("flipped");
        cardB.classList.remove("flipped");
        selectedCard = [];
        isLocked = false;

        if (attempts === 0) {
          const resultsScreen = document.querySelector("#resultsScreen") as HTMLElement;

          const resultsScreenTitle = document.querySelector("#resultTitle") as HTMLElement;

          resultsScreenTitle.innerHTML = `You lost. Try again!`;

          resultsScreen.className = "expanded";
        }
      }, 1000);
    }
  }
};

const startGame = (): void => {
  attempts = 3;
  foundMatches = 0;
  isLocked = false;
  selectedCard = [];
  gameController.innerHTML = `Restart?`;

  const resultsScreen = document.querySelector("#resultsScreen") as HTMLElement;

  resultsScreen.className = "hidden";

  const cardPool: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  const selectedRandomizedCards = cardPool.sort(() => Math.random() - 0.5).slice(0, 3);

  //   console.log(selectedRandomizedCards);

  const gameDeck: number[] = [...selectedRandomizedCards, ...selectedRandomizedCards];

  //   console.log(gameDeck);

  const shuffleDeck = gameDeck.sort(() => Math.random() - 0.5);

  //   console.log(shuffleDeck);

  renderGameScreen(shuffleDeck);
  //   resetGame()
};

const gameController = document.querySelector("#gameController") as HTMLElement;

gameController.innerHTML = `Click here to try again!`;

gameController.addEventListener("click", () => startGame());

startGame();
