class Renderer extends marked.Renderer {
    image(href, title, text) {
        return super.image(`../images/${href}`, title, text);
    }
}

const content = document.currentScript.getAttribute('content');
const renderer = new Renderer();
document.getElementById('post').innerHTML = marked(content, { renderer });
