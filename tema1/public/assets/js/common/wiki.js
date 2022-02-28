import { stringToHTML } from "../utls.js";

export default class Wiki {
  constructor(props) {
    const nodeString = `
    <div class="book-item">
        <div class="image-container">
            <img
             src="${props.thumbnail?.url}"
            />
        </div>

        <div class="book-body">
            <h3 class="book-title">Related wiki article: ${props.title} </h3>
            <div class="description-wrapper">
            <span>${props.excerpt}</span>
            </div>
        </div>
    </div>
    `;
    props.parentNode.append(stringToHTML(nodeString));
  }
}
