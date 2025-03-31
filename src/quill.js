const Quill = window.Quill;

const BlockEmbed = Quill.import('blots/block/embed');

// create custom image blot for quill
class CustomImageBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.setAttribute('src', value);
    node.setAttribute('alt', 'Custom Image');
    node.style.width = '100%';
    return node;
  }

  static value(node) {
    return node.getAttribute('src');
  }
}
CustomImageBlot.blotName = 'customImage';
CustomImageBlot.tagName = 'img';

// create custom video blot for quill
class CustomVideoBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    node.innerHTML = `
      <iframe 
        src="${value}" 
        frameborder="0" 
        allowfullscreen 
        style="width: 100%; height: 400px;">
      </iframe>`;
    return node;
  }

  static value(node) {
    const iframe = node.querySelector('iframe');
    return iframe ? iframe.getAttribute('src') : '';
  }
}
CustomVideoBlot.blotName = 'customVideo';
CustomVideoBlot.tagName = 'div';

Quill.register(CustomImageBlot);
Quill.register(CustomVideoBlot);


export function setQuill(quillStringData) {
  const quill = new Quill('.project-display-description', {
    readOnly: true,
    theme: 'snow',
    modules: { toolbar: false }
  });
  quill.setContents(JSON.parse(quillStringData));
}

