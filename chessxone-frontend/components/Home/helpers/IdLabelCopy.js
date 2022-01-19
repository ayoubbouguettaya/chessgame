import React,{useState} from 'react'

import styles from '../home.module.css';

const IdLabelCopy = ({playerID}) => {
    const [copyTrigged, setCopyTrigged] = useState(false);

    function copyToClipboard(textToCopy) {
        // navigator clipboard api needs a secure context (https)
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(textToCopy);
        } else {
            // text area method
            let textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            // make the textarea out of viewport
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((res, rej) => {
                // here the magic happens
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
            });
        }
    }
    
    const handleCopyLinkToClipBoard = () => {
        copyToClipboard(playerID)
        setCopyTrigged(true)
        const timer = setTimeout(() => {
            setCopyTrigged(false)
            clearTimeout(timer)
        }, 1000)
    }
    return (
        <div className={styles.label_id_copy}>
            <p><small >My ID</small></p>
            <input readOnly defaultValue={playerID} disabled  />
            <button className={copyTrigged ? styles.copy_trigged : ''} onClick={handleCopyLinkToClipBoard}>
                <img src="/icon/link.svg" height="20" width="20" id={styles.copy_icon} />
                <img src="/icon/check.svg" height="20" width="20" id={styles.check_icon} />
            </button>
        </div>
    )
}

export default IdLabelCopy
