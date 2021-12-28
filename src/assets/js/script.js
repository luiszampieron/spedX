const disableButton = () => {
  const b = document.querySelector("#submit");
  b.setAttribute("disabled", "disabled");

  setTimeout(() => {
    b.removeAttribute("disabled");
  }, 10000);
};
