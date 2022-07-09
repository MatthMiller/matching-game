import { shuffle } from './shuffle.js';

const possibleEmojis = ['🎨', '🦔', '🦦', '🦆', '🦎', '🐬', '🎈', '💎', '🎲', '🔮', '🍟', '🌭', '🍔', '🍪', '🍦', '🧃', '🍓', '🍉', '🌺', '🌹', '🍰', '🌮', '😺', '🦝', '🌴', '🌵', '🍁', '⛄', '🍒', '🤡', '👽', '🐁', '🦐', '🐸', '🎃', '☔'];
const gameTitle = document.querySelector('.game-title');
const gameBoard = document.querySelector('.game-board');
const initialModalContainer = document.querySelector('.initial-modal-container');
const inputCardsQuantity = document.querySelector('#cards-quantity');
const errorMessage = document.querySelector('.input-error-text');
const victoryModalContainer = document.querySelector('.victory-modal-container');
const htmlBody = document.querySelector('body');

function openInitialModal() {
    initialModalContainer.classList.add('ativo');
    const startButton = document.querySelector('#start-button');
    gameTitle.classList.remove('ativo');
    startButton.addEventListener('click', initGame);
}
openInitialModal();

function closeInitialModal() {
    initialModalContainer.classList.remove('ativo');
}

function openVictoryModal() {
    victoryModalContainer.classList.add('ativo');
    htmlBody.style.overflow = "hidden"; // scroll block
    const playAgainButton = document.querySelector('#victory-button')
    playAgainButton.addEventListener('click', playAgainCallback);
}

function playAgainCallback() {
    const cards = document.querySelectorAll('.card');
    for(let actualCard of cards) {
        actualCard.remove();
    }
    victoryModalContainer.classList.remove('ativo');
    htmlBody.style.overflow = "auto";
    openInitialModal();
}

function initGame() {
    let cardQuantity = inputCardsQuantity.value || inputCardsQuantity.placeholder;

    if(cardQuantity >= 2 && cardQuantity <= +inputCardsQuantity.max) {
        errorMessage.classList.remove('ativo')
        gameTitle.classList.add('ativo');
        createCards(cardQuantity);
        gameBoard.classList.add('animar');
        gameTitle.classList.add('animar');
        activateCardClicks();
        closeInitialModal();
    } else {
        errorMessage.classList.add('ativo')
        errorMessage.innerText = 'Only values between 2 and 36 are permitted.'
    }
}

const createCards = (totalCards = 12) => {
    let emojiSelection = shuffle([...possibleEmojis]).slice(0, (totalCards/2));
    emojiSelection.push(...emojiSelection);
    emojiSelection = shuffle(emojiSelection);
    
    for(let emoji of emojiSelection) {
        gameBoard.appendChild(createElement(emoji));
    }
    
    function createElement(emoji) {
        let cardElement = document.createElement('div');
        cardElement.classList.add('card', 'back');
        cardElement.dataset.emoji = emoji;
        cardElement.dataset.backEmoji = '➰';
        cardElement.innerText = cardElement.dataset.backEmoji;
        return cardElement;
    }
}

function activateCardClicks() {
    const cards = document.querySelectorAll('.card');

    cards.forEach((actualCard) => {
        if(!actualCard.dataset.selectedCard) {
            actualCard.addEventListener('click', handleClick);
            actualCard.classList.add('back');
        }
    });
}

function handleClick() {
    const cards = document.querySelectorAll('.card');
    let cardsClone = [...cards];

    this.dataset.selectedCard = '';
    this.innerText = this.dataset.emoji;
    this.classList.remove('back');
    this.removeEventListener('click', handleClick);

    if(hasTwoSelectedCard(cardsClone)) {
        let selectedCards = [];
        for(let actualCard of cards) {
            if(actualCard.dataset.selectedCard == '') {
                selectedCards.push(actualCard);
                delete actualCard.dataset.selectedCard;
            }
        }

        if(verifyMatch(...selectedCards)) {
            for(let actualCard of selectedCards) {
                actualCard.classList.add('correct');
            }
        } else {
            for(let actualCard of selectedCards) {
                actualCard.classList.toggle('fail');
            }
            for(let actualCard of cards) {
                if(actualCard.classList.contains('back')) {
                    actualCard.removeEventListener('click', handleClick);
                }
            }
            failedMatchWait(...selectedCards);
        }
    }

    if(areAllCorrects(cards)) {
        openVictoryModal();
    }
}

function hasTwoSelectedCard(cards) {
    let selectedCounter = 0;
    for(let actualCard of cards) {
        if(actualCard.dataset.selectedCard == '') selectedCounter++;
    }
    return selectedCounter == 2;
}

function areAllCorrects(cards) {
    for(let actualCard of cards) {
        if(!actualCard.classList.contains('correct')) {
            return false;
        }
    }
    return true;
}

function verifyMatch(...selectedCards) {
    if(selectedCards[0].dataset.emoji === selectedCards[1].dataset.emoji) {
        return true;
    }
}

async function failedMatchWait(...selectedCards) {
    const cards = document.querySelectorAll('.card');

    await new Promise((resolve) => {
        setTimeout(() => {
            for(let card of selectedCards) {
                card.classList.add('back');
                card.innerText = card.dataset.backEmoji;
                card.classList.toggle('fail');
                card.addEventListener('click', handleClick);
            }
            resolve();
        }, 1500);
    });

    for(let actualCard of cards) {
        if(actualCard.classList.contains('back')) {
            actualCard.addEventListener('click', handleClick);
        }
    }
}