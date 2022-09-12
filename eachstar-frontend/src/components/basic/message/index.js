export function msg(type, text) {
    const body = document.getElementsByTagName('body')[0];
    const message = document.createElement('div');
    message.className = 'message-box';
    message.innerHTML = `
        <span class="iconfont icon-${type}"></span>
        <span class="text">${text}</span>
    `;
    body.appendChild(message);
    setTimeout(function () {
        message.style.opacity = 0;
        message.style.transform = 'translate(-50%, -50%) translateY(-30px)';
        setTimeout(function () {
            message.remove();
        }, 400);
    }, 1000);
}
