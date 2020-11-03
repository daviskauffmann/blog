class Renderer extends marked.Renderer {
    image(href, title, text) {
        return super.image(`../images/${href}`, title, text);
    }
}

const renderer = new Renderer();
const content = document.currentScript.getAttribute('content');
document.getElementById('post').innerHTML = marked(content, { renderer });
