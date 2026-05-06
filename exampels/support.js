export const support = {
    css: /*css*/ `

        #contact_wrapper {
            background: linear-gradient(135deg, #1e1e2f 0%, #2d2d44 100%);
            color: white;
            padding: 50px;
            border-radius: 20px;
            max-width: 500px;
            margin: 50px auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            font-family: sans-serif;
        }

        .contact-title {
            text-align: center;
            margin-top: 0;
            font-size: 32px;
            background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .contact-desc {
            text-align: center;
            color: #a0a0b0;
            margin-bottom: 40px;
        }

        .form-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }

        .modern-input {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 15px;
            border-radius: 10px;
            color: white;
            font-size: 16px;
            outline: none;
            transition: 0.3s;
        }

        .modern-input:focus {
            border-color: #4facfe;
            background: rgba(255, 255, 255, 0.1);
        }

        .full-width {
            grid-column: span 2;
            min-height: 120px;
            resize: vertical;
        }

        .send-btn {
            grid-column: span 2;
            background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
            border: none;
            padding: 15px;
            color: white;
            font-weight: bold;
            font-size: 18px;
            border-radius: 10px;
            cursor: pointer;
            margin-top: 10px;
        }

        .send-btn:hover {
            opacity: 0.9;
            transform: scale(0.98);
        }`,

    html: /*html*/ `
    <div id="contact_wrapper" class="contact-box">
        <h2 id="c_title" class="contact-title">צור קשר</h2>
        <p id="c_desc" class="contact-desc">יש לך שאלה? אנחנו כאן בשבילך.</p>

        <div id="form_grid" class="form-layout">
            <input type="text" id="inp_name" class="modern-input" placeholder="שם מלא">
            <input type="email" id="inp_email" class="modern-input" placeholder="אימייל">
            <textarea id="inp_msg" class="modern-input full-width" placeholder="ההודעה שלך..."></textarea>
            <button id="btn_send" class="send-btn">שלח הודעה 🚀</button>
        </div>
    </div>`
}