function createElement(innerText) {
  const element = document.createElement('div');
  element.innerText = innerText;
  return element;
}

// function handleTextLog(id, message) {
//   const innerText = `${message}`;
//   const element = createElement(innerText);
//   document.getElementById(id).prepend(element);
// };

function updateElementById(id, innerText) {
  document.getElementById(id).innerText = innerText;
}
