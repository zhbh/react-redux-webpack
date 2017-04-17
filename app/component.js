export default (text = 'hello world') => {
  const element = document.createElement('div');

  element.innerHTML = JSON.stringify(process.env.NODE_ENV);

  return element;
};
