import { stringToHTML } from "../utls.js";

export default class Book {
  constructor(props) {
    const nodeString = `<div class="book-item">
            <div class="image-container">
                <img src="${props.imageLinks?.thumbnail}" />
            </div>
        
            <div class="book-body">
                <a target="_blank" href="${props.infoLink}">
                    <br />
                    <h3 class="book-title">${props.title}</h3>
                </a>
                <div class="author">
                    <a target="_blank" href="https://www.google.com/search?tbm=bks&amp;sxsrf=APq-WBtZsAvIaHrCTIl6yusVrZfeolHsnA:1646060951690&amp;tbm=bks&amp;q=inauthor:%22${props.authors?.[0]}%22&amp;sa=X&amp;ved=2ahUKEwjG9bby1qL2AhX0wAIHHd3RDtUQ9Ah6BAgLEAU">
                    <span>${props.authors[0]}</span>
                    </a>
                    · <span>2021</span>
                </div>
                <div class="description-wrapper">
                    <span>
                    ${props.description}
                    </span>
                </div>
                <div class="country-available">
                    <span> Available in ${props.countryName} </span> <img src="${props.flag}" />
                </div>
            </div>
        </div>`;

    props.parentNode.append(stringToHTML(nodeString));
  }
}
